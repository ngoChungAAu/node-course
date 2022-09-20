const express = require("express");
const validate = require("../middlewares/validate");
const { userController } = require("../controllers");
const { userValidation } = require("../validations");

const router = express.Router();

router
  .route("/create")
  .post(validate(userValidation.createUser), userController.createUser);

module.exports = router;
