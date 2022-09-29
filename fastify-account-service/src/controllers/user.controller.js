const register = async (req, rep) => {
  rep.code(200).send("register");
};

const login = async (req, rep) => {
  rep.code(200).send("login");
};

const getProfile = async (req, rep) => {
  rep.code(200).send("get profile");
};

const updateProfile = async (req, rep) => {
  rep.code(200).send("update profile");
};

const changePassword = async (req, rep) => {
  rep.code(200).send("change password");
};

const logoutMe = async (req, rep) => {
  rep.code(200).send("logout me");
};

const logoutAll = async (req, rep) => {
  rep.code(200).send("logout all");
};

const getList = async (req, rep) => {
  rep.code(200).send("get list");
};

const getDetail = async (req, rep) => {
  rep.code(200).send("get detail ");
};

const updateRole = async (req, rep) => {
  rep.code(200).send("update role");
};

const deleteUser = async (req, rep) => {
  rep.code(200).send("delete user");
};

const activeAccount = async (req, rep) => {
  rep.code(200).send("active account");
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
};
