const mongoose = require("mongoose");
const User = require("../models/user");

const uri = "mongodb://127.0.0.1:27017";

(async () => {
  try {
    await mongoose.connect(`${uri}/task-manager-api`, {
      autoIndex: true,
    });

    const count = await User.countDocuments({ email: "admin@au.com" });

    if (count === 0) {
      const admin = new User({
        name: "admin",
        email: "admin@au.com",
        password: "Admin1234!",
        role: "admin",
      });

      await admin.save();
    }
  } catch (error) {
    console.log(error);
  }
})();
