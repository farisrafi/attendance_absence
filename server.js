import express from "express";
import passport from "passport";
import session from "express-session";
import crypto from "crypto";
import sendReminderEmail from "./services/emailService.js";
import sequelize from "./config/db.js";
import { User, Attendance } from "./models/index.js";
import redisClient from "./config/redis.js";
import clientElasticSearch from "./config/elasticsearch.js";
import authRoutes from "./routes/authRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import oauthConfig from "./config/oauth.js";

// Untuk generate secret token
// const secret = crypto.randomBytes(64).toString("hex");
// console.log("secret_token", secret);

const app = express();

// Middleware
app.use(express.json());
app.use(
  session({
    secret:
      "2ecdad1846bcc844b1d734c25fea9c95e2b6bd3de2c3e9547caebbd12409d9ba02055aec5e02cadfa8ebccaf694f4b96bdfd10048fd5a39a24d6cc3358eeee19",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Untuk cek koneksi ke redis
if (!redisClient.isOpen) {
  await redisClient.connect();
}

clientElasticSearch.ping((error) => {
  if (error) {
    console.error("Elasticsearch connection error", error);
  } else {
    console.log("Elasticsearch connected");
  }
});

// Sync database and create default user
sequelize
  .sync()
  .then(async () => {
    console.log("Database synchronized");
    const [user, created] = await User.findOrCreate({
      where: { email: "farisrafiabdillah07@gmail.com" },
      defaults: { name: "fariss", email: "farisrafiabdillah07@gmail.com" },
    });
    if (created) console.log("Default user created:", user.name);
  })
  .catch((err) => {
    console.error("Database sync failed:", err);
  });

const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const sendClockInReminder = async () => {
  const users = await User.findAll();
  users.forEach((user) => {
    redisClient.setEx(`reminder:${user.id}`, 82800, "pending"); // delete key in 23 hours (82800 second)
    if (isValidEmail(user.email)) {
      sendReminderEmail(user.email);
    } else {
      console.error(`Invalid email format: ${user.email}`);
      return res
        .status(400)
        .json({ error: `Invalid email format: ${user.email}` });
    }
  });
};

// Schedule reminder with Redis
const scheduleReminder = async () => {
  const existingReminders = await redisClient.keys("reminder:*");
  if (existingReminders.length === 0) {
    await sendClockInReminder();
  }
};

setInterval(scheduleReminder, 3600); // Run every hours

// Routes
app.use("/auth", authRoutes);
app.use("/attendance", attendanceRoutes);
app.use("/user", userRoutes);

const PORT = process.env.PORT || 4500;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
