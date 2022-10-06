const fastify = require("../index");

// Send an email
const sendEmail = async (to, subject, text) => {
  const msg = { to, subject, text };
  await fastify.mailer.sendMail(msg);
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
  const activeAccountUrl = `localhost:3000/api/user/active-account?token=${token}`;
  const text = `Dear user,
To verify your email, click on this link: ${activeAccountUrl}
If you did not create an account, then ignore this email.`;
  await sendEmail(to, subject, text);
};

module.exports = {
  sendEmail,
  sendResetPasswordEmail,
  sendActiveAccountEmail,
};
