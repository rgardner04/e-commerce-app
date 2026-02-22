const express = require("express");
const router = express.Router();
const productService = require("../services/productService.js");

router.get("/", async (req, res) => {
  const {
    page = 0,
    limit = 10,
    category = null,
    sort = "date_created",
    order = "asc",
    search = null,
  } = req.query;
  const { status, body } = await productService.getProducts(
    page,
    limit,
    category,
    sort,
    order,
    search,
  );
  return res.status(status).send(body);
});

module.exports = router;
