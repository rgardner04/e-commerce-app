const ObjectId = require("mongoose").Types.ObjectId;
const Product = require("../models/Product");
const Category = require("../models/Category");

const productService = {
  getProducts: async function (page, limit, category, sort, order, search) {
    let foundCategory = null;
    if (category) {
      foundCategory = await Category.find(
        { name: category },
        {
          _id: 1,
        },
      );
    }

    if (category && (!foundCategory || !foundCategory._id)) {
      throw new InvalidCategoryError(`${category} is not a valid category`);
    }

    let query = {};

    if (foundCategory._id) {
      query.categoryId = foundCategory._id;
    }

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    const products = await Product.find(query)
      .sort(getSortValue(sort, order))
      .skip(page * limit)
      .limit(limit);

    const totalProducts = await Product.countDocuments();
    const totalPages = totalProducts / limit;

    return {
      status: 200,
      body: {
        data: {
          message: "Products fetched successfully",
          status: "success",
          products: products,
        },
        meta: {
          totalProducts,
          totalPages,
          page,
          limit,
        },
      },
    };
  },
};

function getSortValue(sort, order) {
  let sortValue;
  switch (sort) {
    case "date_created":
      sortValue = "createdAt";
      break;
    default:
      throw new InvalidSortError(
        `${sort} is an invalid sort option for products`,
      );
  }

  let orderValue;
  switch (order) {
    case "asc":
      orderValue = 1;
      break;
    case "desc":
      orderValue = -1;
      break;
  }

  return `${sortValue} ${orderValue}`;
}

module.exports = productService;
