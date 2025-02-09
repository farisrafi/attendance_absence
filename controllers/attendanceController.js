import { User, Attendance } from "../models/index.js";
import redisClient from "../config/redis.js";
import elasticsearchClient from "../config/elasticsearch.js";
import sendReminderEmail from "../services/emailService.js";

export const clockIn = async (req, res) => {
  const { user_id } = req.body;
  const clockInTime = new Date();

  try {
    const get_data_attendace = await Attendance.findOne({
      where: { user_id, clock_out: null },
    });
    if (get_data_attendace) {
      return res.status(400).json({ error: "You have not clocked out" });
    }

    let result = await Attendance.create({ user_id, clock_in: clockInTime });

    // Simpan ke Elasticsearch
    await elasticsearchClient.index({
      index: "attendance",
      body: result.toJSON(),
    });

    // Simpan ke Redis (pastikan Redis client sudah terhubung)
    if (!redisClient.isOpen) {
      await redisClient.connect();
    }
    await redisClient.set(
      `user:${user_id}:clock-in`,
      clockInTime.toISOString()
    );

    res.status(201).json({ message: "Clock-in successful" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const clockOut = async (req, res) => {
  const { user_id } = req.body;
  const clockOutTime = new Date();

  try {
    const attendance = await Attendance.findOne({
      where: { user_id, clock_out: null },
      order: [["clock_in", "DESC"]],
    });

    if (attendance) {
      attendance.clock_out = clockOutTime;
      await attendance.save();
      redisClient.set(`user:${user_id}:clock-out`, clockOutTime.toISOString());
      res.status(200).json({ message: "Clock-out successful" });
    } else {
      res.status(404).json({ error: "No active clock-in found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAttendanceReport = async (req, res) => {
  const { user_id, startDate, endDate } = req.query;

  try {
    const query = {
      bool: {
        must: [{ range: { clock_in: { gte: startDate, lte: endDate } } }],
      },
    };

    if (user_id) {
      query.bool.must.push({ term: { user_id } });
    }

    const result = await elasticsearchClient.search({
      index: "attendance",
      body: {
        query: query,
      },
    });

    res.status(200).json(result.hits.hits);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const notifAttendanceFromEmail = async (req, res) => {
  try {
    const isValidEmail = (email) => {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const sendClockInReminder = async () => {
      // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
      // const today = new Date().getDay();
      // if (today === 0 || today === 6) return;

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
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
