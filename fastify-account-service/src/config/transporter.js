const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USERNAME,
    pass: process.env.SMTP_PASSWORD,
  },
});

module.exports = async (fastify, opts) => {
  await transporter.verify(function (error, success) {
    if (error) {
      fastify.log.error(error);
    } else {
      fastify.log.info("Server is ready to take our messages");
    }
  });
};

module.exports.transporter = transporter;
