function errorMiddleware(err, req, res, next) {
  if (!err) {
    next();
  }

  console.log("err", err);

  if (!err.name) {
    const { status, body } = getErrorDetails(
      500,
      "An internal server error has occurred",
      req,
    );
    return res.status(status).send(body);
  }

  let response;
  switch (err.name) {
    case "ValidationError":
      response = getValidationErrorDetails(err, req);
      break;
    case "MongooseError":
      response = getMongooseErrorDetails(err, req);
      break;
    case "MongoServerError":
      response = getMongoServerErrorDetails(err, req);
      break;
    case "InvalidVerificationError":
      response = getInvalidVerificationErrorDetails(err, req);
      break;
    case "UserNotFoundError":
      response = getUserNotFoundErrorDetails(err, req);
      break;
    case "InvalidPasswordError":
      response = getInvalidPasswordErrorDetails(err, req);
      break;
    case "InvalidTokenError":
      response = getInvalidTokenErrorDetails(err, req);
      break;
    case "JsonWebTokenError":
      response = getJsonWebTokenErrorDetails(err, req);
      break;
    case "TokenExpiredError":
      response = getTokenExpiredErrorDetails(err, req);
      break;
    default:
      response = getErrorDetails(
        500,
        "An internal server error has occurred",
        req,
      );
  }
  const { status = 500, body = "An internal server error has occured" } =
    response;
  return res.status(status).send(body);
}

function getErrorDetails(status, message, req) {
  return {
    status: status,
    body: {
      message: message,
      path: req.originalUrl,
      timestamp: new Date(),
      status: "failure",
    },
  };
}

function getValidationErrorDetails(err, req) {
  return getErrorDetails(
    400,
    `A validation error has occured: ${err.message}`,
    req,
  );
}

function getMongooseErrorDetails(err, req) {
  if (!err.cause || !err.cause?.code) {
    return getErrorDetails(
      500,
      `An internal server error has occurred: ${err.message}`,
      req,
    );
  }

  switch (err.cause.code) {
    case 11000:
      return getUniquenessViolationErrorDetails(err, req);
  }
}

function getMongoServerErrorDetails(err, req) {
  if (!err.code) {
    return {
      status: 500,
      body: {
        message: `An internal server error has occured: ${err.message}`,
        path: req.originalUrl,
        timestamp: new Date(),
        status: "failure",
      },
    };
  }

  switch (err.code) {
    case 11000:
      return getUniquenessViolationErrorDetails(err, req);
  }
}

function getUniquenessViolationErrorDetails(err, req) {
  return getErrorDetails(409, err.message, req);
}

function getInvalidVerificationErrorDetails(err, req) {
  return getErrorDetails(400, err.message, req);
}

function getUserNotFoundErrorDetails(err, req) {
  return getErrorDetails(404, err.message, req);
}

function getInvalidPasswordErrorDetails(err, req) {
  return getErrorDetails(400, err.message, req);
}

function getInvalidTokenErrorDetails(err, req) {
  return getErrorDetails(400, err.message, req);
}

function getJsonWebTokenErrorDetails(err, req) {
  return getErrorDetails(401, err.message, req);
}

function getTokenExpiredErrorDetails(err, req) {
  return getErrorDetails(401, err.message, req);
}

module.exports = errorMiddleware;
