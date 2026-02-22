const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const User = new Schema(
  {
    email: {
      type: String,
      required: [true, "Please enter a valid email!"],
      unique: [true, "A user with this email already exists!"],
      index: true,
      maxLength: [128, "Email cannot be more than 128 characters in length!"],
      validate: {
        validator: function (v) {
          return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v);
        },
        message: (props) => `${props.value} is not a valid email!`,
      },
    },
    password: {
      type: String,
      required: [true, "Please enter a valid password!"],
    },
    roles: {
      type: [String],
      required: true,
      validate: {
        validator: function (v) {
          return (
            Array.isArray(v) &&
            v.filter((role) => role === "user" || role === "admin").length > 0
          );
        },
      },
    },
    firstName: {
      type: String,
      required: [true, "Please enter a valid first name!"],
      maxLength: [
        128,
        "First name cannot be more than 128 characters in length!",
      ],
    },
    lastName: {
      type: String,
      required: [true, "Please enter a valid last name!"],
      maxLength: [
        128,
        "Last name cannot be more than 128 characters in length!",
      ],
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["activated", "deactivated", "pending"],
        message: "{VALUE} is not a valid status!",
      },
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", User);
