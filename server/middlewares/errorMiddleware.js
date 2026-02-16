function errorMiddleware(err, req, res, next) {
  if (!err) {
    next();
  }

  if (!err.name) {
    return res.status(500).send({
      message: `An internal server error has occured: ${err.message}`,
      path: req.originalUrl,
      timestamp: new Date(),
      status: "failure",
    });
  }

  let errorDetails = {};
  switch (err.name) {
    case "ValidationError":
      errorDetails = getValidationErrorDetails(err, req);
      break;
    case "MongoServerError":
      errorDetails = getMongoServerErrorDetails(err, req);
      break;
    case "InvalidOtpError":
      errorDetails = getInvalidOtpErrorDetails(err, req);
      break;
    case "UserNotFoundError":
      errorDetails = getUserNotFoundErrorDetails(err, req);
      break;
    case "InvalidPasswordError":
      errorDetails = getInvalidPasswordErrorDetails(err, req);
      break;
    case "InvalidTokenError":
      errorDetails = getInvalidTokenErrorDetails(err, req);
      break;
    default:
      errorDetails = {
        status: 500,
        body: {
          message: `An internal server error has occured: ${err.message}`,
          path: req.originalUrl,
          timestamp: new Date(),
          status: "failure",
        },
      };
  }

  return res.status(errorDetails.status).send(errorDetails.body);
}

function getValidationErrorDetails(err, req) {
  return {
    status: 400,
    body: {
      message: `A validation error has occured: ${err.message}`,
      path: req.originalUrl,
      timestamp: new Date(),
      status: "failure",
    },
  };
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
  const [key, value] = Object.entries(err.keyValue)[0];
  return {
    status: 409,
    body: {
      message: `A user with the ${key} ${value} already exists`,
      path: req.originalUrl,
      timestamp: new Date(),
      status: "failure",
    },
  };
}

function getInvalidOtpErrorDetails(err, req) {
  return {
    status: 400,
    body: {
      message: err.message,
      path: req.originalUrl,
      timestamp: new Date(),
      status: "failure",
    },
  };
}

function getUserNotFoundErrorDetails(err, req) {
  return {
    status: 404,
    body: {
      message: err.message,
      path: req.originalUrl,
      timestamp: new Date(),
      status: "failure",
    },
  };
}

function getInvalidPasswordErrorDetails(err, req) {
  return {
    status: 400,
    body: {
      message: err.message,
      path: req.originalUrl,
      timestamp: new Date(),
      status: "failure",
    },
  };
}

function getInvalidTokenErrorDetails(err, req) {
  return {
    status: 400,
    body: {
      message: err.message,
      path: req.originalUrl,
      timestamp: new Date(),
      status: "failure",
    },
  };
}

module.exports = errorMiddleware;
