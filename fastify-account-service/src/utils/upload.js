const multer = require("fastify-multer");
const httpStatus = require("http-status");
const ApiError = require("./ApiError");

const upload = multer({
  // dest: "uploads",
  limits: {
    fileSize: 500000,
  },
  fileFilter(req, file, callback) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      callback(new ApiError(httpStatus.BAD_REQUEST, "Must be image file"));
    }

    callback(undefined, true);
  },
});

module.exports = upload;
