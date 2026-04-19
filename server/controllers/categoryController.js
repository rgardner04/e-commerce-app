const express = require("express");
const router = express.Router();
const categoryService = require("../services/categoryService");
const validatorMiddleware = require("../middlewares/validatorMiddleware");
const wrap = require("../utils/asyncWrapper");

const {
  getCategoriesQuerySchema,
  createCategoryBodySchema,
  updateCategoryParamsSchema,
  updateCategoryBodySchema,
} = require("../validators/categoryValidators");

router.get(
  "/",
  validatorMiddleware(getCategoriesQuerySchema, "query"),
  wrap(async (req, res) => {
    const { page, limit } = req.query;
    const { status, body } = await categoryService.getCategories(page, limit);
    return res.status(status).send(body);
  }),
);

router.post(
  "/",
  validatorMiddleware(createCategoryBodySchema, "body"),
  wrap(async (req, res) => {
    const { status, body } = await categoryService.createCategory(req.body);
    return res.status(status).send(body);
  }),
);

router.patch(
  "/:categoryId",
  validatorMiddleware(updateCategoryParamsSchema, "params"),
  validatorMiddleware(updateCategoryBodySchema, "body"),
  wrap(async (req, res) => {
    const { body: requestBody, params } = req;
    const categoryId = params.categoryId;
    const { status, body } = await categoryService.updateCategory(
      requestBody,
      categoryId,
    );
    return res.status(status).send(body);
  }),
);

module.exports = router;
