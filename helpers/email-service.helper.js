const nodemailer = require("nodemailer");
const path = require("path");
const ejs = require("ejs");

module.exports = {
  sendEmail: async (type, data) => {
    const baseEmail = {
      from: process.env.EMAIL_MAIL,
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: process.env.EMAIL_SECURE == "true" ? true : false,
    }

    const emails = {
      "Reset Password": {
        subject: "Password Reset Request.",
        file: "../public/views/reset-email.ejs",
        data: {}
      },
    };

    const transporter = nodemailer.createTransport({
      host: baseEmail.host,
      port: baseEmail.port,
      secure: baseEmail.secure,
      auth: {
        user: baseEmail.user,
        pass: baseEmail.pass,
      },
    });

    transporter.verify(function (error, success) {
      if (error) {
        console.log(error);
      }
    });

    // Feed data to html file
    const email = emails[type];
    const file = path.join(__dirname, email.file);
    const html = await ejs.renderFile(file, { data: email.data });

    transporter.sendMail(
      {
        from: baseEmail.from,
        to: data.email,
        subject: email.subject,
        html,
      },
      function (err, info) {
        if (err) console.log(err.message);
        else console.log("Email Sent:", info.messageId);
      }
    );
  },
};
