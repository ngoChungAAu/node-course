const { userController } = require("../controllers");

module.exports = async (fastify, opts) => {
  fastify.post("/register", {}, userController.register);

  // login
  fastify.post("/login", {}, userController.login);

  // get profile
  fastify.get(
    "/profile",
    { onRequest: fastify.auth() },
    userController.getProfile
  );

  // update profile
  fastify.patch(
    "/update-profile",
    { onRequest: fastify.auth() },
    userController.updateProfile
  );

  // change password
  fastify.patch(
    "/change-password",
    { onRequest: fastify.auth() },
    userController.changePassword
  );

  // logout on your device
  fastify.post(
    "/logout/me",
    { onRequest: fastify.auth() },
    userController.logoutMe
  );

  // logout all the devices
  fastify.post(
    "/logout/all",
    { onRequest: fastify.auth() },
    userController.logoutAll
  );

  // list user
  fastify.get(
    "/list",
    { onRequest: fastify.auth("list-user") },
    userController.getList
  );

  // get user by id
  fastify.get(
    "/:id",
    { onRequest: fastify.auth("user-detail") },
    userController.getDetail
  );

  // update role user
  fastify.patch(
    "/:id",
    { onRequest: fastify.auth("update-role") },
    userController.updateRole
  );

  // delete user
  fastify.delete(
    "/:id",
    { onRequest: fastify.auth("delete-user") },
    userController.deleteUser
  );

  // active account
  fastify.post("/active-account", userController.activeAccount);
};

module.exports.autoPrefix = "/user";
