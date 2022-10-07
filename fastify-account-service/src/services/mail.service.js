const ejs = require("ejs");
const path = require("path");
const { transporter } = require("../config/transporter");

// Send an email
const sendEmail = async (to, subject, html) => {
  const msg = { from: process.env.EMAIL_FROM, to, subject, html };
  await transporter.sendMail(msg);
};

// Send reset password email
const sendResetPasswordEmail = async (to, token) => {
  const subject = "Reset password";
  const resetPasswordUrl = `localhost:3000/api/user/reset-password?token=${token}`;
  const text = `Dear user,
To reset your password, click on this link: ${resetPasswordUrl}
If you did not request any password resets, then ignore this email.`;
  await sendEmail(to, subject, text);
};

// Send active user
const sendActiveAccountEmail = async (to, token) => {
  const subject = "Active your account";
  const activeAccountUrl = `localhost:3000/api/user/active-account?token=${token}`;

  const pathFile = path.join(__dirname, "../views/activeAccount.ejs");

  const html = await ejs.renderFile(pathFile, {
    name: to,
    link: activeAccountUrl,
  });

  await sendEmail(to, subject, html);
};

module.exports = {
  sendEmail,
  sendResetPasswordEmail,
  sendActiveAccountEmail,
};
