const nodemailer = require("nodemailer");
const config = require("../config/config");
const logger = require("../config/logger");

var transporter = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "9d538a1514e486",
    pass: "3c6037cb3cac28",
  },
});
/* istanbul ignore next */
if (config.env !== "test") {
  transporter.verify(function (error, success) {
    if (error) {
      logger.error(error);
    } else {
      logger.info("Server is ready to take our messages");
    }
  });
}

// Send an email
const sendEmail = async (to, subject, text) => {
  const msg = { from: config.email.from, to, subject, text };
  await transporter.sendMail(msg);
};

// Send reset password email
const sendResetPasswordEmail = async (to, token) => {
  const subject = "Reset password";
  const resetPasswordUrl = `localhost:3000/reset-password?token=${token}`;
  const text = `Dear user,
To reset your password, click on this link: ${resetPasswordUrl}
If you did not request any password resets, then ignore this email.`;
  await sendEmail(to, subject, text);
};

// Send active user
const sendActiveAccountEmail = async (to, token) => {
  const subject = "Active your account";
  const activeAccountUrl = `localhost:3000/active-account?token=${token}`;
  const text = `Dear user,
To verify your email, click on this link: ${activeAccountUrl}
If you did not create an account, then ignore this email.`;
  await sendEmail(to, subject, text);
};

module.exports = {
  transporter,
  sendEmail,
  sendResetPasswordEmail,
  sendActiveAccountEmail,
};
