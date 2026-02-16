function loggingMiddleware(req, res, next) {
  req.requestStartTime = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - req.requestStartTime;
    console.log(`${req.method} to ${req.originalUrl} took ${duration}ms`);
  });

  next();
}

module.exports = loggingMiddleware;
