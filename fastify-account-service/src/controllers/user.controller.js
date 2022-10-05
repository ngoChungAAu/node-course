const httpStatus = require("http-status");
const { userService, tokenService } = require("../services");
const pick = require("../utils/pick");

const register = async (req, rep) => {
  const user = await userService.register(req.body);

  await tokenService.generateActiveAccountToken(user._id);

  rep.code(httpStatus.CREATED).send(user);
};

const login = async (req, rep) => {
  const { email, password } = req.body;
  const user = await userService.login(email, password);
  const tokenObj = await tokenService.generateAuthTokens(user);
  rep.code(httpStatus.CREATED).send(tokenObj);
};

const getProfile = async (req, rep) => {
  rep.status(httpStatus.OK).send(req.user);
};

const updateProfile = async (req, rep) => {
  const user = await userService.updateProfile(req.user, req.body);
  rep.status(httpStatus.OK).send(user);
};

const changePassword = async (req, rep) => {
  await userService.changePassword(req.user, req.body);
  rep.status(httpStatus.OK).send("Change password successfully!");
};

const logoutMe = async (req, rep) => {
  await userService.logoutMe(req.token);
  rep.code(httpStatus.OK).send("Logout successfully!");
};

const logoutAll = async (req, rep) => {
  await userService.logoutAll(req.user.id);
  rep.code(httpStatus.OK).send("Logout all device successfully!");
};

const getList = async (req, rep) => {
  const filter = pick(req.query, ["name", "role"]);
  const options = pick(req.query, ["createdAt", "limit", "page"]);
  const data = await userService.getList(filter, options);
  rep.code(httpStatus.OK).send(data);
};

const getDetail = async (req, rep) => {
  const user = await userService.getDetail(req.params.id);
  rep.code(httpStatus.OK).send(user);
};

const updateRole = async (req, rep) => {
  await userService.updateRole(req.params.id);
  rep.code(httpStatus.OK).send("Update role successfully!");
};

const deleteUser = async (req, rep) => {
  await userService.deleteUser(req.params.id);
  rep.code(httpStatus.OK).send("Delete user successfully!");
};

const activeAccount = async (req, rep) => {
  await userService.activeAccount(req.query.token);
  rep.code(httpStatus.OK).send("Active account successfully!");
};

const uploadAvatar = async (req, rep) => {
  req.user.avatar = req.file.buffer;

  await req.user.save();

  rep.code(httpStatus.OK).send("Upload avatar success!");
};

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
  uploadAvatar,
};
