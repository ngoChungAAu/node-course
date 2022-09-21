const express = require("express");
const validate = require("../middlewares/validate");
const auth = require("../middlewares/auth");
const { userController } = require("../controllers");
const { userValidation } = require("../validations");

const router = express.Router();

// register
router
  .route("/register")
  .post(validate(userValidation.register), userController.register);

// login
router
  .route("/login")
  .post(validate(userValidation.login), userController.login);

// get profile
router.route("/profile").get(auth, userController.getProfile);

// update profile
router
  .route("/update-profile")
  .patch(
    validate(userValidation.updateProfile),
    auth,
    userController.updateProfile
  );

// change password
router
  .route("/change-password")
  .patch(
    validate(userValidation.changePassword),
    auth,
    userController.changePassword
  );

// list user
router.route("/list").get(auth("list-user"), userController.getList);

module.exports = router;
