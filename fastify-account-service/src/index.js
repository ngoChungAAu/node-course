const logger = require("./config/logger");
const path = require("path");
const autoLoad = require("@fastify/autoload");
const { errorHandler } = require("./utils/error");
const ApiError = require("./utils/apiError");
const httpStatus = require("http-status");
const fastify = require("fastify")(logger);

require("dotenv").config();

fastify.register(require("./databases/mongoose"));

// load all plugins
fastify.register(autoLoad, {
  dir: path.join(__dirname, "plugins"),
});

// Set the schema validator compiler for all routes
fastify.setValidatorCompiler(function ({ schema, method, url, httpPart }) {
  return (data) => schema.validate(data);
});

// load all route
fastify.register(autoLoad, {
  dir: path.join(__dirname, "routes"),
  options: Object.assign({ prefix: "/api" }),
});

// api not found
fastify.setNotFoundHandler((request, reply) => {
  throw new ApiError(httpStatus.NOT_FOUND, "Not found");
});

// handle error
fastify.setErrorHandler(errorHandler);

fastify.listen(
  { port: process.env.PORT, host: "127.0.0.1" },
  function (err, address) {
    if (err) {
      console.log(err.message);
      process.exit(1);
    }
  }
);

module.exports = fastify;
