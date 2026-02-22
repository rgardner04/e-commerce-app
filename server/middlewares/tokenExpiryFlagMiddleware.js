function tokenExpiryFlagMiddleware(_req, res, next) {
  const originalSend = res.send.bind(res);

  res.send = (body) => {
    try {
      if (typeof body === "object" && body !== null) {
        body.tokenExpiresSoon = res.locals.tokenExpiresSoon ?? flase;
      }
    } catch (error) {}
    return originalSend(body);
  };

  next();
}

module.exports = tokenExpiryFlagMiddleware;
