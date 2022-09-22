const express = require("express");
const validate = require("../middlewares/validate");
const auth = require("../middlewares/auth");
const { userController } = require("../controllers");
const { userValidation } = require("../validations");

const router = express.Router();

// register
router.post(
  "/register",
  validate(userValidation.register),
  userController.register
);

// login
router.post("/login", validate(userValidation.login), userController.login);

// get profile
router.get("/profile", auth, userController.getProfile);

// update profile
router.patch(
  "/update-profile",
  validate(userValidation.updateProfile),
  auth,
  userController.updateProfile
);

// change password
router.patch(
  "/change-password",
  validate(userValidation.changePassword),
  auth,
  userController.changePassword
);

// logout on your device
router.post("/logout/me", auth, userController.logoutMe);

// logout all the devices
router.post("/logout/all", auth, userController.logoutAll);

// list user
router.get(
  "/list",
  validate(userValidation.getList),
  auth("list-user"),
  userController.getList
);

// get user by id
router.get(
  "/:id",
  validate(userValidation.userId),
  auth("user-detail"),
  userController.getDetail
);

// update role user
router.patch(
  "/:id",
  validate(userValidation.userId),
  auth("update-role"),
  userController.updateRole
);

// delete user
router.delete(
  "/:id",
  validate(userValidation.userId),
  auth("delete-user"),
  userController.deleteUser
);

module.exports = router;
