const httpStatus = require("http-status");
const { User } = require("../models");
const ApiError = require("../utils/ApiError");

const getUserById = async (id) => {
  return User.findById(id);
};

const getUserByEmail = async (email) => {
  return User.findOne({ email });
};

const register = async (user) => {
  const isTaken = await User.isEmailTaken(user.email);

  if (isTaken) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Email already taken");
  }

  return User.create(user);
};

const login = async (email, password) => {
  const user = await getUserByEmail(email);
  if (!user || !(await user.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Incorrect email or password");
  }
  return user;
};

const updateProfile = async (user, body) => {
  const fields = Object.keys(body);

  fields.forEach((e) => (user[e] = body[e]));

  await user.save();

  return user;
};

const changePassword = async (user, body) => {
  if (!(await user.isPasswordMatch(body.currentPassword))) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Incorrect current password");
  }

  user.password = body.newPassword;

  await user.save();
};

module.exports = {
  getUserById,
  getUserByEmail,
  register,
  login,
  updateProfile,
  changePassword,
};
