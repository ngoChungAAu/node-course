const express = require("express");
const httpStatus = require("http-status");
const ApiError = require("./utils/ApiError");
const routes = require("./routes");
const { errorConverter, errorHandler } = require("./middlewares/error");
const {
  successRequestHandler,
  errorRequestHandler,
} = require("./config/morgan");

const app = express();

app.use(successRequestHandler);
app.use(errorRequestHandler);

// parse json request body
app.use(express.json());

// routes
app.use(routes);

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, "Not found"));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

module.exports = app;
