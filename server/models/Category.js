const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Category = new Schema(
  {
    name: {
      type: String,
      required: [true, "name is required when creating a category!"],
      maxLength: [64, "name cannot be more than 64 characters in length!"],
      index: true,
      unique: [true, "A category with this name already exists!"],
    },
    displayName: {
      type: String,
      required: [true, "displayName is required when creating a category!"],
      maxLength: [
        64,
        "displayName cannot be more than 64 characters in length!",
      ],
      unique: [true, "A category with this displayName already exists!"],
    },
    description: {
      type: String,
      required: [true, "description is required when creating a category!"],
      maxLength: [
        256,
        "description cannot be more than 256 characters in length!",
      ],
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Category", Category);
