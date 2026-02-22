const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const ShippingDetails = new Schema(
  {
    userId: {
      type: ObjectId,
      required: [true, "userId is required when creating shipping details!"],
      index: true,
    },
    street: {
      type: String,
      required: [true, "street is required when creating shipping details!"],
      maxLength: [255, "street cannot be more than 255 characters in length!"],
    },
    city: {
      type: String,
      required: [true, "city is required when creating shipping details!"],
      maxLength: [255, "city cannot be more than 255 characters in length!"],
    },
    state: {
      type: String,
      maxLength: [128, "state cannot be more than 128 characters in length!"],
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
      maxLength: [255, "country cannot be more than 255 characters in length!"],
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("ShippingDetails", ShippingDetails);
