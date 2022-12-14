const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { toJSON } = require("./plugins");
const { roleTypes } = require("../types/roles");
const Token = require("./token.model");

const schema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      trim: true,
      require: true,
    },
    password: {
      type: String,
      trim: true,
      require: true,
      validate(value) {
        if (value.length < 8) {
          throw Error("Password must be minimum 8 characters");
        }

        if (value.length > 255) {
          throw Error("Password must be maximum 255 characters");
        }

        if (
          !value.match(/(?=.*?[0-9])/) ||
          !value.match(/(?=.*?[A-Z])/) ||
          !value.match(/(?=.*?[a-z])/) ||
          !value.match(/(?=.*?[#?!@$%^&*-])/)
        ) {
          throw Error(
            "Password must contain at least 1 letter and 1 number and 1 special character"
          );
        }
      },
      private: true,
    },
    avatar: {
      type: String,
      default: "",
    },
    name: {
      type: String,
      require: true,
      trim: true,
    },
    age: {
      type: Number,
      default: 0,
      validate(value) {
        if (value < 0) {
          throw Error("Must be a positive number!");
        }

        if (!!(value % 1)) {
          throw Error("Must be an integer number");
        }
      },
    },
    address: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      default: "user",
      enum: roleTypes,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// add plugin that converts mongoose to json
schema.plugin(toJSON);

// check if email is taken
schema.statics.isEmailTaken = async function (email) {
  const user = await this.findOne({ email, isActive: true });
  return !!user;
};

// Check if password matches the user's password
schema.methods.isPasswordMatch = async function (password) {
  const user = this;
  return bcrypt.compare(password, user.password);
};

// Hash password before save
schema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

// Remove all token when delete user
schema.pre("remove", async function (next) {
  const user = this;

  Token.deleteMany({ user: user._id });

  next();
});

const User = mongoose.model("User", schema);

module.exports = User;
