class InvalidOtpError extends Error {
  constructor(message) {
    super(message);
    this.name = "InvalidOtpError";
  }
}

module.exports = InvalidOtpError;
