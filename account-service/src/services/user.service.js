const httpStatus = require("http-status");
const { User } = require("../models");
const ApiError = require("../utils/ApiError");

const createUser = async (user) => {
  const isTaken = await User.isEmailTaken(user.email);

  if (isTaken) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Email already taken");
  }

  return User.create(user);
};

module.exports = { createUser };
