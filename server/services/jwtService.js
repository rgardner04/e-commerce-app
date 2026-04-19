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
  const privateKey = process.env.JWT_PRIVATE_KEY;
  if (!privateKey) {
    throw new Error("JWT private key missing from environment variables!");
  }
  const formattedPrivateKey = privateKey.replace(/\\n/g, "\n");
  return formattedPrivateKey;
}

function getPublicKey() {
  const publicKey = process.env.JWT_PUBLIC_KEY;
  if (!publicKey) {
    throw new Error("JWT public key missing from environment variables!");
  }
  const formattedPublicKey = publicKey.replace(/\\n/g, "\n");
  return formattedPublicKey;
}

module.exports = jwtService;
