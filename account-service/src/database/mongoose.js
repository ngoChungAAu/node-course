const mongoose = require("mongoose");
const config = require("../config/config");
const logger = require("../config/logger");
const { User } = require("../models");

(async () => {
  try {
    await mongoose.connect(config.mongoose.url, config.mongoose.options);

    logger.info("Connected to MongoDB");

    const count = await User.countDocuments({ email: "admin@au.com" });

    if (count === 0) {
      const admin = new User({
        email: "admin@au.com",
        password: "Admin1234!",
        name: "admin",
        role: "admin",
        isActive: true,
      });

      await admin.save();

      logger.info("Set default admin success");
    }
  } catch (err) {
    logger.error(err.message);
  }
})();
