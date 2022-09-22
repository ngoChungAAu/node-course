const Joi = require("joi");
const {
  password,
  objectId,
  positiveNumber,
  integerNumber,
} = require("./common.validation");

const register = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    name: Joi.string().required(),
  }),
};

const login = {
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
};

const updateProfile = {
  body: Joi.object().keys({
    name: Joi.string(),
    age: Joi.number().custom(positiveNumber).custom(integerNumber),
    name: Joi.string(),
  }),
};

const changePassword = {
  body: Joi.object().keys({
    currentPassword: Joi.string().required(),
    newPassword: Joi.string().required().custom(password),
  }),
};

const getList = {
  query: Joi.object().keys({
    name: Joi.string(),
    role: Joi.string(),
    createdAt: Joi.string().valid("asc", "desc"),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const userId = {
  params: Joi.object().keys({
    id: Joi.required().custom(objectId),
  }),
};

module.exports = {
  register,
  login,
  updateProfile,
  changePassword,
  getList,
  userId,
};
