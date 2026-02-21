const User = require("../models/User");
const RefreshToken = require("../models/RefreshToken");
const verifyEmailService = require("./verifyEmailService");
const jwtService = require("./jwtService");
const bcrypt = require("bcrypt");
const UserNotFoundError = require("../errors/UserNotFoundError");
const InvalidPasswordError = require("../errors/InvalidPasswordError");
const InvalidTokenError = require("../errors/InvalidTokenError");
const mongoose = require("mongoose");

const authService = {
  register: async function (requestBody) {
    const { password, ...rest } = requestBody;

    const userToRegister = new User({
      ...rest,
      password: await hashPassword(password),
      roles: ["user"],
      status: "pending",
    });
    await userToRegister.save();

    /*
     * Don't await verifyEmailService.sendVerificationEmail,
     * but wrap in try-catch to handle Promise rejection
     */
    try {
      verifyEmailService.sendVerificationEmail({
        userId: userToRegister._id,
        toEmail: userToRegister.email,
      });
    } catch (error) {}

    return {
      status: 201,
      body: {
        message:
          "User has been registered as pending. Awaiting confirmation of email.",
        status: "success",
      },
    };
  },

  login: async function (requestBody) {
    const { email, password: plainTextPassword } = requestBody;

    const foundUser = await User.findOne({
      email: email,
    });

    if (!foundUser) {
      throw new UserNotFoundError(`Unable to find user from email: ${email}`);
    }

    if (!isValidPassword(plainTextPassword, foundUser.password)) {
      throw new InvalidPasswordError(
        `Invalid password provided: ${plainTextPassword}`,
      );
    }

    return {
      status: 200,
      body: {
        message:
          "User has provided the correct credentials. Verification email has been sent.",
        status: "success",
      },
    };
  },

  verifyEmail: async function (requestBody) {
    const verifiedUser = await verifyEmailService.verifyEmail(requestBody);

    const { accessToken, refreshToken } = generateTokens(verifiedUser);

    await jwtService.saveRefreshToken(verifiedUser, refreshToken);

    return {
      status: 201,
      body: {
        message: "User's email has been validated succesfully.",
        status: "success",
        tokens: {
          accessToken,
          refreshToken,
        },
      },
    };
  },

  refresh: async function (requestBody) {
    const { refreshToken: passedRefreshToken } = requestBody;

    const foundRefreshToken = await RefreshToken.findOne({
      token: passedRefreshToken,
      status: "created",
    });

    if (!foundRefreshToken) {
      throw new InvalidTokenError(
        `Invalid refresh token provided: ${passedRefreshToken}`,
      );
    }

    const verifiedToken = jwtService.verifyToken(passedRefreshToken);

    const foundUser = await User.findById(verifiedToken.sub);

    if (!foundUser) {
      throw new UserNotFoundError(
        "User not found from the subject of the refresh token.",
      );
    }

    const { accessToken, refreshToken: newlyGeneratedRfToken } =
      generateTokens(foundUser);

    const session = await mongoose.startSession();
    session.withTransaction(async () => {
      await jwtService.saveRefreshToken(foundUser, newlyGeneratedRfToken);
      await jwtService.updateOldToken(
        passedRefreshToken,
        newlyGeneratedRfToken,
      );
    });

    return {
      status: 201,
      body: {
        message: "New access and refresh tokens generated successfully.",
        status: "success",
        tokens: {
          accessToken,
          refreshToken: newlyGeneratedRfToken,
        },
      },
    };
  },
};

async function hashPassword(plainTextPassword) {
  const hashedPassword = await bcrypt.hash(plainTextPassword, 10);
  return hashedPassword;
}

async function isValidPassword(plainTextPassword, hashedPassword) {
  const isValidPassword = await bcrypt.compare(
    plainTextPassword,
    hashedPassword,
  );
  return isValidPassword;
}

function generateTokens(user) {
  const accessToken = jwtService.generateAccessToken(user);
  const refreshToken = jwtService.generateRefreshToken(user);

  return { accessToken, refreshToken };
}

module.exports = authService;
