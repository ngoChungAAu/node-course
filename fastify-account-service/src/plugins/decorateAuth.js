const fp = require("fastify-plugin");
const httpStatus = require("http-status");
const { Token } = require("../models");
const { roleRights } = require("../types/roles");
const ApiError = require("../utils/ApiError");

module.exports = fp((fastify, opts, done) => {
  fastify.decorate("auth", (requiredRight) => async (req, rep) => {
    const token = req.headers.authorization.replace("Bearer ", "");

    const tokenDoc = await Token.findOne({
      accessToken: token,
    });

    fastify.jwt.verify(token, async (err, res) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          await tokenDoc.remove();

          throw new ApiError(
            httpStatus.UNAUTHORIZED,
            "Token is expired!. Please login again!"
          );
        }

        throw new ApiError(httpStatus.UNAUTHORIZED, "Token is not exist!");
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
