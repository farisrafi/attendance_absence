import { User } from "../models/index.js";
import redisClient from "../config/redis.js";

export const getUserProfile = async (req, res) => {
  const { user_id } = req.body;

  try {
    // Check Redis cache first
    const cachedProfile = await redisClient.get(`user:${user_id}:profile`);

    if (cachedProfile) {
      return res.status(200).json(JSON.parse(cachedProfile));
    }

    // Fetch from database
    const user = await User.findByPk(user_id, {
      attributes: ["id", "name", "email"],
    });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Cache the profile in Redis
    await redisClient.set(
      `user:${user_id}:profile`,
      JSON.stringify(user),
      "EX",
      3600
    ); // Expire in 1 hour

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateUserProfile = async (req, res) => {
  const { user_id } = req.body;
  const { name, email } = req.body;

  try {
    const user = await User.findByPk(user_id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.name = name || user.name;
    user.email = email || user.email;
    await user.save();

    // Update Redis cache
    await redisClient.set(
      `user:${user_id}:profile`,
      JSON.stringify(user),
      "EX",
      3600
    );

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
