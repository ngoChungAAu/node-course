const fp = require("fastify-plugin");
const mongoose = require("mongoose");
const { User } = require("../models");

module.exports = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL, {});

    console.log("Connected to MongoDB");

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

      console.log("Set default admin success");
    }
  } catch (error) {
    console.log(error.message);
  }
};
