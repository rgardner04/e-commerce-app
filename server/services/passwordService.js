const bcrypt = require("bcrypt");

const passwordService = {
  hashPassword: async function (plainTextPassword) {
    return bcrypt.hash(plainTextPassword, 10);
  },

  isValidPassword: async function (plainTextPassword, hashedPassword) {
    return bcrypt.compare(plainTextPassword, hashedPassword);
  },
};

module.exports = passwordService;
