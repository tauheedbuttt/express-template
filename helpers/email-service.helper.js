const nodemailer = require("nodemailer");
const path = require("path");
const ejs = require("ejs");

module.exports = {
  sendEmail: async (type, data) => {
    var from = process.env.EMAIL_MAIL;
    var user = process.env.EMAIL_USER;
    var pass = process.env.EMAIL_PASS;

    const emails = {
      "SignUp": {
        subject: "Signup",
        file: "../public/views/temp.ejs",
        data: {}
      },
    };

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: process.env.EMAIL_SECURE == "true" ? true : false,
      auth: {
        user: user,
        pass: pass,
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
        from: from,
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
