const validatorMiddleware =
  (schema, property = "body") =>
  (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      return res.status(400).send({
        message: `${error?.message}`,
        path: req.originalUrl,
        timestamp: new Date(),
        status: "failure",
      });
    }

    req[property] = value;
    next();
  };

module.exports = validatorMiddleware;
