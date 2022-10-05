const moment = require("moment");
const jwt = require("jsonwebtoken");
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

  return jwt.sign(payload, process.env.JWT_SECRET);
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
    process.env.JWT_ACCESS_EXPIRATION_MINUTES,
    "minutes"
  );
  const accessToken = generateToken(
    user.id,
    accessTokenExpires,
    tokenTypes.ACCESS
  );

  const refreshTokenExpires = moment().add(
    process.env.JWT_REFRESH_EXPIRATION_DAYS,
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

const generateActiveAccountToken = async (userId) => {
  const expires = moment().add(
    process.env.JWT_ACTIVE_ACCOUNT_EXPIRATION_MINUTES,
    "minutes"
  );
  const activeAccountToken = generateToken(userId, expires, tokenTypes.ACTIVE);

  const tokenDoc = await Token.findOne({ user: userId, accessToken: "###" });

  if (tokenDoc) {
    tokenDoc.activeToken = activeAccountToken;

    tokenDoc.save();
  } else {
    await saveToken(userId, {
      accessToken: "###",
      refreshToken: "###",
      activeToken: activeAccountToken,
    });
  }

  return activeAccountToken;
};

module.exports = {
  generateToken,
  saveToken,
  generateAuthTokens,
  generateActiveAccountToken,
};
