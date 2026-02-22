const User = require("../models/User");
const VerificationCode = require("../models/VerificationCode");
const RefreshToken = require("../models/RefreshToken");
const verificationService = require("./verificationService");
const jwtService = require("./jwtService");
const passwordService = require("./passwordService");
const UserNotFoundError = require("../errors/UserNotFoundError");
const InvalidPasswordError = require("../errors/InvalidPasswordError");
const InvalidTokenError = require("../errors/InvalidTokenError");
const mongoose = require("mongoose");

const authService = {
  getAuthPageData: function () {
    return {
      status: 200,
      body: {
        message: "Auth page data fetched successfully.",
        status: "success",
        data: {
          loginPrimaryMessage: "Welcome back!",
          loginSecondaryMessage: "Enter your credentials to continue",
          loginRedirectMessage: "Already have an account?",
          loginActionMessage: "Sign in",
          registerPrimaryMessage: "Create an account",
          registerSecondaryMessage: "Fill in your details to get started",
          registerRedirectMessage: "Don't have an account?",
          registerActionMessage: "Sign up",
          fields: [
            {
              name: "email",
              label: "Email",
            },
            {
              name: "password",
              label: "Password",
            },
            {
              name: "firstName",
              label: "First Name",
            },
            {
              name: "lastName",
              label: "Last Name",
            },
          ],
        },
      },
    };
  },

  register: async function (requestBody) {
    const userToRegister = new User({
      ...requestBody,
      password: await passwordService.hashPassword(requestBody.password),
      roles: ["user"],
      status: "pending",
    });
    await User.create(userToRegister);

    verificationService.sendVerificationEmail({
      userId: userToRegister._id,
      toEmail: userToRegister.email,
    });

    return {
      status: 201,
      body: {
        message:
          'User registered as "pending" successfully. A verification email has been sent.',
        status: "success",
        data: {
          verificationPrimaryMessage: "Verify your account",
          verificationSecondaryMessage: `Enter the ${parseInt(process.env.VERIFICATION_CODE_LENGTH)}-digit code sent to your email`,
          verificationActionMessage: "Verify email",
          verificationCodeLength: parseInt(
            process.env.VERIFICATION_CODE_LENGTH,
          ),
          resendMessage: "Didn't receive and email?",
          resendActionMessage: "Resend",
          secondsBeforeResend: 30,
        },
      },
    };
  },

  login: async function (requestBody) {
    const { email, password: plainTextPassword } = requestBody;

    const foundUser = await User.findOne({
      email: email,
    });

    if (!foundUser) {
      throw new UserNotFoundError(`Invalid credentials provided`);
    }

    const isValidPassword = await passwordService.isValidPassword(
      plainTextPassword,
      foundUser.password,
    );
    if (!isValidPassword) {
      throw new InvalidPasswordError(`Invalid credentials provided`);
    }

    verificationService.sendVerificationEmail({
      userId: foundUser._id,
      toEmail: foundUser.email,
    });

    return {
      status: 200,
      body: {
        message:
          "User credentials verified. A verification email has been sent.",
        status: "success",
        data: {
          verificationPrimaryMessage: "Verify your account",
          verificationSecondaryMessage: `Enter the ${parseInt(process.env.VERIFICATION_CODE_LENGTH)}-digit code sent to your email`,
          verificationActionMessage: "Verify email",
          verificationCodeLength: parseInt(
            process.env.VERIFICATION_CODE_LENGTH,
          ),
          resendMessage: "Didn't receive and email?",
          resendActionMessage: "Resend",
          secondsBeforeResend: 30,
        },
      },
    };
  },

  verifyEmail: async function (requestBody) {
    const verifiedUser = await verificationService.verifyEmail(requestBody);

    const { accessToken, refreshToken } =
      jwtService.generateTokens(verifiedUser);

    await jwtService.saveRefreshToken(verifiedUser, refreshToken);

    return {
      status: 201,
      body: {
        message:
          "User email verified. Access and refresh tokens have been provided.",
        status: "success",
        data: {
          accessToken,
          refreshToken,
        },
      },
    };
  },

  resendVerification: async function (requestBody) {
    const { email } = requestBody;

    const foundUser = await User.findOne({ email: email });
    if (!foundUser) {
      throw new UserNotFoundError("Invalid credentials provided");
    }

    await VerificationCode.findOneAndUpdate(
      { userId: foundUser._id },
      { $set: { status: "invalidated" } },
    ).sort({ createdAt: -1 });

    verificationService.sendVerificationEmail({
      toEmail: email,
      userId: foundUser._id,
    });

    return {
      status: 201,
      body: {
        message: "Verification code has been resent!",
        status: "success",
        data: {
          resendSuccessMessage:
            "A verification code has been resent to your email",
        },
      },
    };
  },

  refresh: async function (requestBody) {
    const { refreshToken: token } = requestBody;

    const foundToken = await RefreshToken.findOne({
      token: token,
      status: "created",
    });

    if (!foundToken) {
      throw new InvalidTokenError(`Invalid refresh token provided: ${token}`);
    }

    const verifiedToken = jwtService.verifyToken(token);

    const foundUser = await User.findById(verifiedToken.sub);

    if (!foundUser) {
      throw new UserNotFoundError("Invalid refresh token provided");
    }

    const { accessToken, refreshToken: newlyGeneratedRfToken } =
      jwtService.generateTokens(foundUser);

    const session = await mongoose.startSession();
    await session.withTransaction(async () => {
      await jwtService.saveRefreshToken(foundUser, newlyGeneratedRfToken);
      await jwtService.updateOldToken(token, newlyGeneratedRfToken);
    });

    return {
      status: 201,
      body: {
        message:
          "Refresh successful! New access and refresh tokens generated successfully.",
        status: "success",
        tokens: {
          accessToken,
          refreshToken: newlyGeneratedRfToken,
        },
      },
    };
  },
};

module.exports = authService;
