const Category = require("../models/Category");
const ObjectId = require("mongoose").Types.ObjectId;

const categoryService = {
  getCategories: async function (page, limit) {
    const categories = await Category.find(
      {},
      {
        _id: 1,
        name: 1,
        displayName: 1,
        description: 1,
      },
    )
      .skip((page - 1) * limit)
      .limit(limit);

    if (!categories || categories.length === 0) {
      throw new Error("No categories found!");
    }

    const totalCategories = await Category.countDocuments();
    const totalPages = Math.round(totalCategories / limit);

    return {
      status: 200,
      body: {
        data: {
          message: "Categories fetched successfully",
          status: "success",
          categories: categories,
        },
        meta: {
          totalCategories,
          totalPages,
          page,
          limit,
        },
      },
    };
  },

  createCategory: async function (requestBody) {
    await Category.create(requestBody);

    return {
      status: 201,
      body: {
        data: {
          message: "Category created successfully",
          status: "success",
        },
      },
    };
  },

  updateCategory: async function (requestBody, categoryId) {
    let categoryToUpdate = await Category.findByIdAndUpdate(
      categoryId,
      { $set: requestBody },
      { runValidators: true },
    );

    if (!categoryToUpdate) {
      throw new Error("Could not find category to update");
    }

    return {
      status: 200,
      body: {
        data: {
          message: "Category updated successfully",
          status: "success",
        },
      },
    };
  },
};

module.exports = categoryService;
