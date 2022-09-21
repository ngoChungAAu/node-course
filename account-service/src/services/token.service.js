const jwt = require("jsonwebtoken");
const moment = require("moment");
const httpStatus = require("http-status");
const config = require("../config/config");
const userService = require("./user.service");
const { Token } = require("../models");
const { tokenTypes } = require("../types/tokens");

// Generate token
const generateToken = (userId, expires, type) => {
  const payload = {
    userId,
    iat: moment().unix(),
    exp: expires.unix(),
    type,
  };
  return jwt.sign(payload, config.jwt.secret);
};

// Save a token
const saveToken = async (userId, token) => {
  const tokenDoc = await Token.create({
    user: userId,
    ...token,
  });

  return tokenDoc;
};

// Generate auth tokens
const generateAuthTokens = async (user) => {
  const accessTokenExpires = moment().add(
    config.jwt.accessExpirationMinutes,
    "minutes"
  );
  const accessToken = generateToken(
    user.id,
    accessTokenExpires,
    tokenTypes.ACCESS
  );

  const refreshTokenExpires = moment().add(
    config.jwt.refreshExpirationDays,
    "days"
  );
  const refreshToken = generateToken(
    user.id,
    refreshTokenExpires,
    tokenTypes.REFRESH
  );

  await saveToken(user.id, { accessToken, refreshToken });

  return { accessToken, refreshToken };
};

module.exports = {
  generateToken,
  saveToken,
  generateAuthTokens,
};
