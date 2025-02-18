const nodemailer = require("nodemailer");
const { JWT_SECRET, EMAIL_USER, EMAIL_PASS } = process.env;
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  service: "gmail",
  secure: false,
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

const sendVerificationCode = (email, code, type) => {
  let subject, htmlContent;
  const username = email.split("@")[0];
  if (type === "register") {
    subject = "Verification Code";
    htmlContent = `<div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9;">
            <h2 style="color: #333; text-align: center;">Verify Your Email Address</h2>
            <p>Hello, ${username}. Welcome to Going With Me! We're excited to have you on board.</p>
            <p>Please enter the 6-digit code below to verify your email address and complete your registration:</p>
            <div style="margin: 20px 0; display: flex; justify-content: center;">
              <span style="background-color: #4CAF50; color: white; padding: 10px 20px; border-radius: 5px; font-size: 24px;">${code}</span>
            </div>
            <p>If you did not request this, please disregard this email.</p>
            <p>Thank you,<br>The Going With Me Team</p>
    </div>`;
  } else if (type === "login") {
    subject = "Your login code";
    htmlContent = `<div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9;">
            <h2 style="color: #333; text-align: center;">Login Code</h2>
            <p>Hello, ${username}. Welcome back to Going With Me.</p>
            <p>Please enter the 6-digit code below to login:</p>
            <div style="margin: 20px 0; display: flex; justify-content: center;">
              <span style="background-color: #4CAF50; color: white; padding: 10px 20px; border-radius: 5px; font-size: 24px;">${code}</span>
            </div>
            <p>If you did not request this, please disregard this email.</p>
            <p>Thank you,<br>The Going With Me Team</p>
    </div>`;
  }
  const mailOptions = {
    from: {
      name: "GWM Support",
      address: EMAIL_USER,
    },
    to: email,
    subject: subject,
    html: htmlContent,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

module.exports = { sendVerificationCode };
