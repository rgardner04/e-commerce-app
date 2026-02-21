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
    age: {
      type: Number,
      required: [true, "Please enter a valid age!"],
      min: [18, "You must be at least 18 years old to access the app!"],
    },
    street: {
      type: String,
      required: [true, "Please enter a valid street!"],
      maxLength: [255, "Street cannot be more than 255 characters in length!"],
    },
    city: {
      type: String,
      required: [true, "Please enter a valid city!"],
      maxLength: [255, "City cannot be more than 255 characters in length!"],
    },
    state: {
      type: String,
      maxLength: [128, "State cannot be more than 128 characters in length!"],
    },
    zipCode: {
      type: Number,
      validate: {
        validator: function (v) {
          return v.toString().length === 5;
        },
        message: (props) => `${props.value} is not a valid zip code!`,
      },
    },
    country: {
      type: String,
      required: true,
      maxLength: [255, "Country cannot be more than 255 characters in length!"],
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
