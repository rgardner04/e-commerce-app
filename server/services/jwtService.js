const jwt = require("jsonwebtoken");
const RefreshToken = require("../models/RefreshToken");

const jwtService = {
  generateAccessToken: function (userData) {
    const currentMs = Date.now();
    const privateKey = getPrivateKey();
    return jwt.sign(
      {
        sub: userData._id,
        iss: `${process.env.SERVER_URL}`,
        aud: "e-commerce-app",
        iat: currentMs / 1000,
        exp:
          currentMs / 1000 + parseInt(process.env.ACCESS_JWT_EXPIRES_SECONDS),
      },
      privateKey,
      { algorithm: "RS256" },
    );
  },

  generateRefreshToken: function (userData) {
    const currentMs = Date.now();
    return jwt.sign(
      {
        sub: userData._id.toString(),
        iss: `${process.env.SERVER_URL}`,
        aud: "e-commerce-app",
        iat: currentMs / 1000,
        exp:
          currentMs / 1000 + parseInt(process.env.REFRESH_JWT_EXPIRES_SECONDS),
        roles: userData.roles,
      },
      getPrivateKey(),
      { algorithm: "RS256" },
    );
  },

  saveRefreshToken: async function (userData, token) {
    const refreshToken = new RefreshToken({
      userId: userData._id,
      token: token,
      status: "created",
    });

    await RefreshToken.create(refreshToken);
  },

  updateOldToken: async function (oldToken, newToken) {
    await RefreshToken.updateOne(
      {
        token: oldToken,
      },
      { $set: { replacedByToken: newToken, status: "replaced" } },
    );
  },

  generateTokens: function (user) {
    const accessToken = jwtService.generateAccessToken(user);
    const refreshToken = jwtService.generateRefreshToken(user);

    return { accessToken, refreshToken };
  },

  extractClaims: function (token) {
    return jwt.decode(token);
  },

  verifyToken: function (token) {
    const publicKey = getPublicKey();
    return jwt.verify(token, publicKey, {
      algorithms: ["RS256"],
    });
  },
};

function getPrivateKey() {
  return process.env.JWT_PRIVATE_KEY;
}

function getPublicKey() {
  return process.env.JWT_PUBLIC_KEY;
}

module.exports = jwtService;
