const jwtService = require("../services/jwtService");

function authMiddleware(req, res, next) {
  const authorizationHeader = req?.headers?.authorization;

  if (!authorizationHeader) {
    return res.status(401).send({
      message:
        'Invalid authorization provided. Missing "Authorization" header.',
      path: req.originalUrl,
      timestamp: new Date(),
      status: "failure",
    });
  }

  const authToken = authorizationHeader.split(" ")[1];

  if (!authToken) {
    return res.status(401).send({
      message: "Invalid authorization provided. Missing authorization token.",
      path: req.originalUrl,
      timestamp: new Date(),
      status: "failure",
    });
  }

  const decodedToken = jwtService.verifyToken(authToken);

  req.user = decodedToken;
  res.locals.tokenExpiresSoon = decodedToken.exp - Date.now() <= 5 * 60 * 1000;

  next();
}

module.exports = authMiddleware;
