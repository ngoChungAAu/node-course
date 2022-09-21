const httpStatus = require("http-status");
const { userService, tokenService } = require("../services");
const catchAsync = require("../utils/catchAsync");

const register = catchAsync(async (req, res) => {
  const user = await userService.register(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await userService.login(email, password);
  const tokenObj = await tokenService.generateAuthTokens(user);
  res.status(httpStatus.CREATED).send(tokenObj);
});

const getProfile = catchAsync(async (req, res) => {
  res.status(httpStatus.OK).send(req.user);
});

const updateProfile = catchAsync(async (req, res) => {
  const user = await userService.updateProfile(req.user, req.body);
  res.status(httpStatus.OK).send(user);
});

const changePassword = catchAsync(async (req, res) => {
  await userService.changePassword(req.user, req.body);
  res.status(httpStatus.OK).send("Change password successfully!");
});

const getList = catchAsync(async (req, res) => {
  res.status(httpStatus.OK).send("successfully!");
});

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  getList,
};
