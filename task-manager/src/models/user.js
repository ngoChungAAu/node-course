const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Task = require("./task");

const jwt_key = process.env.JWT_KEY;

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value, { ignore_max_length: true })) {
          throw new Error("Email is invalid");
        }
      },
    },
    password: {
      type: String,
      required: true,
      minlength: [7, "Min length is 7"],
      trim: true,
      validate(value) {
        if (value.toLowerCase().includes("password")) {
          throw new Error('Password cannot contain "password"');
        }
      },
    },
    age: {
      type: Number,
      default: 0,
      validate(value) {
        if (value < 0) {
          throw new Error("Age must be a positive number");
        }
      },
    },
    role: {
      type: String,
      default: "user",
      enum: ["user", "admin"],
    },
    avatar: {
      type: Buffer,
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

userSchema.virtual("tasks", {
  ref: "Task",
  localField: "_id",
  foreignField: "userID",
});

// define functions to the model
userSchema.statics.findByCredentials = async function (email, password) {
  try {
    const user = await User.findOne({ email });

    if (!user) {
      throw new Error("Not register!");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new Error("Incorrect password!");
    }

    return { error: undefined, user };
  } catch (error) {
    return { error, user: undefined };
  }
};

// define functions to the document
userSchema.methods.publicData = function () {
  const { password, tokens, ...data } = this.toObject();
  return data;
};

userSchema.methods.generateAuthToken = async function () {
  try {
    const token = jwt.sign(this.publicData(), jwt_key);

    this.tokens = this.tokens.concat({ token });

    await this.save();

    return token;
  } catch (error) {
    return undefined;
  }
};

// hash the password
userSchema.pre("save", async function (next) {
  const user = this;

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  next();
});

// delete tasks when delete user
userSchema.pre("remove", async function (next) {
  const user = this;

  Task.deleteMany({ userID: user._id });

  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
