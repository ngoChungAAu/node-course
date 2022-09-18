var nodemailer = require("nodemailer");

var transporter = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "1c132a6868416a",
    pass: "d1f2987199b283",
  },
});

var mainOptions = {
  from: "from-example@email.com",
  to: "to-example@email.com",
  subject: "Subject",
  text: "Hello SMTP Email",
};

const sendEmail = () => {
  transporter.sendMail(mainOptions, function (err, info) {
    if (err) {
      console.log(err);
    } else {
      console.log("Message sent: " + info.response);
    }
  });
};

module.exports = {
  sendEmail,
};
