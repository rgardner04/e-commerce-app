const nodemailer = require("nodemailer");
const mongoose = require("mongoose");
const VerificationCode = require("../models/VerificationCode");
const User = require("../models/User");
const InvalidVerificationError = require("../errors/InvalidVerificationError");
const UserNotFoundError = require("../errors/UserNotFoundError");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.NODEMAILER_EMAIL,
    pass: process.env.GOOGLE_APP_PASSWORD,
  },
});

const verificationService = {
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

    const verificationCode = new VerificationCode({
      ...rest,
      verificationCode: code,
      expiresAt: getExpiresAt(),
    });

    return await VerificationCode.create(verificationCode);
  },

  verifyEmail: async function (verifyEmailData) {
    const { verificationCode: code } = verifyEmailData;

    const verificationCode = await VerificationCode.findOne({
      verificationCode: code,
      expiresAt: { $gte: new Date().toUTCString() },
      status: "pending",
    });

    if (!verificationCode) {
      throw new InvalidVerificationError(`Invalid verification code provided`);
    }

    const foundUser = await User.findById(verificationCode.userId);
    if (!foundUser) {
      throw new UserNotFoundError(`We are unable to find your account`);
    }

    const session = await mongoose.startSession();
    await session.withTransaction(async () => {
      await VerificationCode.updateOne(
        { _id: verificationCode._id },
        { $set: { status: "validated" } },
      );

      if (foundUser.status === "pending") {
        await User.updateOne(
          { _id: foundUser._id },
          { $set: { status: "activated" } },
        );
      }
    });

    return foundUser;
  },
};

function generateCode() {
  return Math.floor(100000 + Math.random() * 900000);
}

function getExpiresAt() {
  return new Date(new Date().getTime() + 60 * 5 * 1000).toUTCString();
}

module.exports = verificationService;
