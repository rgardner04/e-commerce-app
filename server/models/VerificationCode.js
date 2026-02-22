const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const VerificationCode = new Schema(
  {
    userId: {
      type: ObjectId,
      required: [true, "userId is required when creating a verification code!"],
    },
    verificationCode: {
      type: Number,
      required: [
        true,
        "verificationCode is required when creating a verification code!",
      ],
      index: true,
    },
    expiresAt: {
      type: Date,
      required: [
        true,
        "expiresAt is required when creating a verification code!",
      ],
    },
    status: {
      type: String,
      default: "pending",
      enum: {
        values: ["pending", "expired", "validated", "invalidated"],
        message: "{VALUE} is not a valid status!",
      },
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("VerificationCode", VerificationCode);
