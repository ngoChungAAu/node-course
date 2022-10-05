const fp = require("fastify-plugin");
const httpStatus = require("http-status");
const jwt = require("jsonwebtoken");
const { Token } = require("../models");
const { roleRights } = require("../types/roles");
const ApiError = require("../utils/ApiError");

module.exports = fp((fastify, opts, done) => {
  fastify.decorate("auth", (requiredRight) => async (req, rep) => {
    const token = req.headers.authorization.replace("Bearer ", "");

    const tokenDoc = await Token.findOne({
      accessToken: token,
    });

    if (!tokenDoc) {
      throw new ApiError(httpStatus.NOT_FOUND, "Token is not exist!");
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          await tokenDoc.remove();

          throw new ApiError(
            httpStatus.UNAUTHORIZED,
            "Token is expired!. Please login again!"
          );
        }
      }
    });

    const { user } = await tokenDoc.populate("user");

    if (!user) {
      await Token.deleteMany({ user: tokenDoc.user });

      throw new ApiError(
        httpStatus.UNAUTHORIZED,
        "User not found. Please register"
      );
    }

    req.user = user;
    req.token = tokenDoc;

    if (requiredRight) {
      const userRights = roleRights.get(user.role);
      const hasRight = userRights.includes(requiredRight);

      if (!hasRight) {
        throw new ApiError(httpStatus.FORBIDDEN, "You are not admin!");
      }
    }
  });

  done();
});
