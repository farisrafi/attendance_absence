import redisClient from "../config/redis.js";

export const setClockInReminder = (userId) => {
  const reminderTime = new Date();
  reminderTime.setHours(9, 0, 0); // Set reminder at 9 AM

  redisClient.set(
    `user:${userId}:reminder`,
    reminderTime.toISOString(),
    "EX",
    86400
  ); // Expire in 24 hours
};

export const getCachedUserProfile = async (userId) => {
  const cachedProfile = await redisClient.get(`user:${userId}:profile`);
  return cachedProfile ? JSON.parse(cachedProfile) : null;
};
