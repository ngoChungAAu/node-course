var nodemailer = require("nodemailer");

var transporter = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "a3cf7f588bb483",
    pass: "393db9b89dbc08",
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
