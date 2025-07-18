const { ratelimit } = require("../config/upstash.js");

const rateLimiter = async (req, res, next) => {
  try {
    const { success } = await ratelimit.limit(req.ip); // Use dynamic key like IP or user ID

    if (!success) {
      return res
        .status(429)
        .json({ message: "Too many requests, try again later!" });
    }

    next();
  } catch (error) {
    console.error("Rate limit error:", error);
    next(error);
  }
};

module.exports = rateLimiter;
