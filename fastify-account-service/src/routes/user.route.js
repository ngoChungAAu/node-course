const { userController } = require("../controllers");

module.exports = (fastify, opts, done) => {
  fastify.post("/register", {}, userController.register);

  // login
  fastify.post("/login", {}, userController.login);

  // get profile
  fastify.get("/profile", {}, userController.getProfile);

  // update profile
  fastify.patch("/update-profile", {}, userController.updateProfile);

  // change password
  fastify.patch("/change-password", {}, userController.changePassword);

  // logout on your device
  fastify.post("/logout/me", {}, userController.logoutMe);

  // logout all the devices
  fastify.post("/logout/all", {}, userController.logoutAll);

  // list user
  fastify.get("/list", {}, userController.getList);

  // get user by id
  fastify.get("/:id", {}, userController.getDetail);

  // update role user
  fastify.patch("/:id", {}, userController.updateRole);

  // delete user
  fastify.delete("/:id", {}, userController.deleteUser);

  // active account
  fastify.post("/active-account", userController.activeAccount);

  done();
};
