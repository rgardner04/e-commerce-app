const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { ObjectId, Decimal128 } = mongoose.SchemaTypes;

const Product = new Schema(
  {
    name: {
      type: String,
      required: [true, "A name is required when creating a product!"],
      maxLength: [128, "Name cannot be more than 128 characters in length!"],
    },
    description: {
      type: String,
      required: [true, "A description is required when creating a product!"],
      maxLength: [
        512,
        "Description cannot be more than 512 characters in length!",
      ],
    },
    price: {
      type: Decimal128,
      required: [true, "A price is required when creating a product!"],
    },
    categoryId: {
      type: ObjectId,
      required: [true, "A categoryId is required when creating a product!"],
      index: true,
    },
    status: {
      type: String,
      default: "created",
      enum: {
        values: ["created", "listed", "unlisted"],
        message: "{VALUE} is not a valid status!",
      },
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Product", Product);
