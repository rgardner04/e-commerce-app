const joi = require("joi");

const getCategoriesQuerySchema = joi
  .object({
    page: joi.number().min(1).required(),
    limit: joi.number().max(25).required(),
  })
  .required();

const createCategoryBodySchema = joi
  .object({
    name: joi.string().required(),
    displayName: joi.string().required(),
    description: joi.string().required(),
  })
  .required();

const updateCategoryParamsSchema = joi.object({
  categoryId: joi.string().required(),
});

const updateCategoryBodySchema = joi
  .object({
    name: joi.string().optional(),
    displayName: joi.string().optional(),
    description: joi.string().optional(),
  })
  .min(1)
  .required();

module.exports = {
  getCategoriesQuerySchema,
  createCategoryBodySchema,
  updateCategoryParamsSchema,
  updateCategoryBodySchema,
};
