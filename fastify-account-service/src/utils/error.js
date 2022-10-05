const httpStatus = require("http-status");
const mongoose = require("mongoose");
const ApiError = require("./ApiError");

module.exports.errorHandler = (error, request, reply) => {
  let { statusCode, message } = error;

  if (!(error instanceof ApiError)) {
    statusCode =
      statusCode || error instanceof mongoose.Error
        ? httpStatus.BAD_REQUEST
        : httpStatus.INTERNAL_SERVER_ERROR;

    message = message || httpStatus[statusCode];
  } else {
    if (process.env.NODE_ENV === "prod" && !error.isOperational) {
      statusCode = httpStatus.INTERNAL_SERVER_ERROR;
      message = httpStatus[httpStatus.INTERNAL_SERVER_ERROR];
    }
  }

  const response = {
    code: statusCode,
    message,
  };

  if (process.env.NODE_ENV === "dev") {
    console.error(error);
  }

  reply.code(statusCode).send(response);
};
