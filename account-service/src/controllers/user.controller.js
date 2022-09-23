const httpStatus = require("http-status");
const { userService, tokenService, mailService } = require("../services");
const catchAsync = require("../utils/catchAsync");
const pick = require("../utils/pick");

const register = catchAsync(async (req, res) => {
  const user = await userService.register(req.body);

  const token = await tokenService.generateActiveAccountToken(user._id);

  mailService.sendActiveAccountEmail("to-example@email.com", token);

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

const logoutMe = catchAsync(async (req, res) => {
  await userService.logoutMe(req.token);
  res.status(httpStatus.OK).send("Logout successfully!");
});

const logoutAll = catchAsync(async (req, res) => {
  await userService.logoutAll(req.user.id);
  res.status(httpStatus.OK).send("Logout all device successfully!");
});

const getList = catchAsync(async (req, res) => {
  const filter = pick(req.query, ["name", "role"]);
  const options = pick(req.query, ["createdAt", "limit", "page"]);
  const data = await userService.getList(filter, options);
  res.status(httpStatus.OK).send(data);
});

const getDetail = catchAsync(async (req, res) => {
  const user = await userService.getDetail(req.params.id);
  res.status(httpStatus.OK).send(user);
});

const updateRole = catchAsync(async (req, res) => {
  await userService.updateRole(req.params.id);
  res.status(httpStatus.OK).send("Update role successfully!");
});

const deleteUser = catchAsync(async (req, res) => {
  await userService.deleteUser(req.params.id);
  res.status(httpStatus.OK).send("Delete user successfully!");
});

const activeAccount = catchAsync(async (req, res) => {
  await userService.activeAccount(req.query.token);
  res.status(httpStatus.OK).send("Active account successfully!");
});

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  logoutMe,
  logoutAll,
  getList,
  getDetail,
  updateRole,
  deleteUser,
  activeAccount,
};
