const httpStatus = require("http-status");
const jwt = require("jsonwebtoken");
const config = require("../config/config");
const { Token } = require("../models");
const { roleRights } = require("../types/roles");
const ApiError = require("../utils/ApiError");

const auth = (requiredRight) => async (req, res, next) => {
  const token = req.header("Authorization").replace("Bearer ", "");

  const tokenDoc = await Token.findOne({
    accessToken: token,
  });

  if (!tokenDoc) {
    return next(new ApiError(httpStatus.UNAUTHORIZED, "Please login!"));
  }

  jwt.verify(token, config.jwt.secret, async (err, res) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        await tokenDoc.remove();
      }

      return next(
        new ApiError(
          httpStatus.UNAUTHORIZED,
          "Token is expired!. Please login again!"
        )
      );
    }

    const { user } = await tokenDoc.populate("user");

    if (!user) {
      await Token.deleteMany({ user: res.userId });

      return next(
        new ApiError(httpStatus.UNAUTHORIZED, "User not found. Please register")
      );
    }

    req.user = user;
    req.token = tokenDoc;

    if (requiredRight) {
      const userRights = roleRights.get(user.role);
      const hasRight = userRights.includes(requiredRight);

      if (!hasRight) {
        return next(new ApiError(httpStatus.FORBIDDEN, "Forbidden"));
      }
    }

    next();
  });
};

module.exports = auth;
