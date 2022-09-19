const mongoose = require("mongoose");
const logger = require("../config/logger");
const config = require("../config/config");
const { User } = require("../models");

(async () => {
  try {
    await mongoose.connect(config.mongoose.url, config.mongoose.options);

    logger.info("Connected to MongoDB");

    const count = await User.countDocuments({ email: "admin@au.com" });

    if (count === 0) {
      const admin = new User({
        name: "admin",
        email: "admin@au.com",
        password: "Admin1234!",
        role: "admin",
      });

      await admin.save();

      logger.info("Set default admin success");
    }
  } catch (err) {
    logger.error(err.message);
  }
})();
