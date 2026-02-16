const jwt = require("jsonwebtoken");
const fs = require("fs");
const RefreshToken = require("../models/RefreshToken");

const privateKey = fs.readFileSync("./credentials/private.pem");
const publicKey = fs.readFileSync("./credentials/public.pem");

const jwtService = {
  generateAccessToken: function (userData) {
    const currentMs = Date.now();

    const expiresAt = new Date(
      currentMs + parseInt(process.env.ACCESS_JWT_EXPIRES_IN_SECONDS) * 1000,
    ).getTime();

    return jwt.sign(
      {
        sub: userData._id,
        iss: `${process.env.SERVER_URL}`,
        aud: "e-commerce-app",
        exp: expiresAt,
        iat: currentMs,
      },
      privateKey,
      { algorithm: "RS256" },
    );
  },

  generateRefreshToken: function (userData) {
    const currentMs = Date.now();

    const expiresAt = new Date(
      currentMs + parseInt(process.env.REFRESH_JWT_EXPIRES_IN_SECONDS * 1000),
    ).getTime();

    return jwt.sign(
      {
        sub: userData._id.toString(),
        iss: `${process.env.SERVER_URL}`,
        aud: "e-commerce-app",
        exp: expiresAt,
        iat: currentMs,
        roles: userData.roles,
      },
      privateKey,
      { algorithm: "RS256" },
    );
  },

  saveRefreshToken: async function (userData, token) {
    const refreshToken = new RefreshToken({
      userId: userData._id,
      token: token,
      status: "created",
    });

    await refreshToken.save();
  },

  updateOldToken: async function (oldToken, newToken) {
    await RefreshToken.updateOne(
      {
        token: oldToken,
      },
      { $set: { replacedByToken: newToken, status: "replaced" } },
    );
  },

  extractClaims: function (token) {
    return jwt.decode(token);
  },

  verifyToken: function (token) {
    return jwt.verify(token, publicKey);
  },
};

module.exports = jwtService;
