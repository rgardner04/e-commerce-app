class InvalidVerificationError extends Error {
  constructor(message) {
    super(message);
    this.name = "InvalidVerificationError";
  }
}

module.exports = InvalidVerificationError;
