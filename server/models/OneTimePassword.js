const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const OneTimePassword = new Schema(
  {
    userId: {
      type: ObjectId,
      required: [true, "userId is required when creating an OTP!"],
    },
    code: {
      type: Number,
      required: [true, "code is required when creating an OTP!"],
      index: true,
    },
    expiresAt: {
      type: Date,
      default: generateExpiresAt(),
    },
    status: {
      type: String,
      default: "pending",
      enum: {
        values: ["pending", "expired", "validated"],
        message: "{VALUE} is not a valid status!",
      },
    },
  },
  { timestamps: true },
);

OneTimePassword.index({ userId: 1, otpCode: 1 });

function generateExpiresAt() {
  const currentDate = new Date();
  return new Date(currentDate.getTime() + 5 * 60 * 1000);
}

module.exports = mongoose.model("OneTimePassword", OneTimePassword);
