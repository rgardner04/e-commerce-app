const nodemailer = require("nodemailer");
const mongoose = require("mongoose");
const OneTimePassword = require("../models/OneTimePassword");
const User = require("../models/User");
const InvalidOtpError = require("../errors/InvalidOtpError");
const UserNotFoundError = require("../errors/UserNotFoundError");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.NODEMAILER_EMAIL,
    pass: process.env.GOOGLE_APP_PASSWORD,
  },
});

const verifyEmailService = {
  sendVerificationEmail: async function (userData) {
    const code = generateCode();

    const { toEmail, ...rest } = userData;

    await transporter.sendMail({
      from: `E-commerce App - ${process.env.NODEMAILER_EMAIL}`,
      to: toEmail,
      subject: "E-commerce App",
      text: "Please verify your email to access the E-commerce App",
      html: `<p>Please enter the following code in the app to verify your email: <b>${code}</b></p>`,
    });

    const oneTimePassword = new OneTimePassword({
      ...rest,
      code: code,
    });

    await oneTimePassword.save();
  },

  verifyEmail: async function (verifyEmailData) {
    const { code } = verifyEmailData;

    const oneTimePassword = await OneTimePassword.findOne({
      code: code,
      expiresAt: { $gte: new Date() },
      status: "pending",
    });

    if (!oneTimePassword) {
      throw new InvalidOtpError(`An invalid OTP has been provided: ${code}`);
    }

    const foundUser = await User.findById(oneTimePassword.userId);
    if (!foundUser) {
      throw new UserNotFoundError(
        `Unable to find user from OTP userId: ${oneTimePassword.userId}`,
      );
    }

    const session = await mongoose.startSession();
    await session.withTransaction(async () => {
      oneTimePassword.status = "validated";
      await oneTimePassword.save();

      foundUser.status = "activated";
      await foundUser.save();
    });

    return foundUser;
  },
};

function generateCode() {
  return Math.floor(100000 + Math.random() * 900000);
}

module.exports = verifyEmailService;
