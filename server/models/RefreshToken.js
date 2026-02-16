const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const RefreshToken = new Schema(
  {
    userId: {
      type: ObjectId,
      required: [true, "userId is required when creating a refresh token!"],
    },
    token: {
      type: String,
      required: [true, "token is required when creating a refresh token!"],
      index: true,
    },
    replacedByToken: {
      type: String,
      index: true,
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["created", "expired", "revoked", "replaced"],
        message: "{VALUE} is not a valid status for a refresh token!",
      },
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("RefreshToken", RefreshToken);
