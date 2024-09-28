import { body, param } from "express-validator";

export const productCreateValidates = [
  body("name").notEmpty().withMessage("Product name is required"),
  body("price").isFloat({ gt: 0 }).withMessage("Price must be greater than 0"),
  body("stock")
    .isInt({ gt: -1 })
    .withMessage("Stock must be a positive integer"),
  body("category_id").isInt().withMessage("Category ID must be an integer"),
];

export const productUpdateValidates = [
  param("productId")
    .notEmpty()
    .isInt({ gt: 0 })
    .withMessage("Product Id is required and must be an integer"),
  body("name")
    .optional()
    .isString()
    .withMessage("Product name must be a string"),
  body("price")
    .optional()
    .isFloat({ gt: 0 })
    .withMessage("Price must be greater than 0"),
  body("stock")
    .optional()
    .isInt({ gt: -1 })
    .withMessage("Stock must be a positive integer"),
  body("category_id")
    .optional()
    .isInt()
    .withMessage("Category ID must be an integer"),
];

export const productDeleteValidates = [
  param("productId")
    .notEmpty()
    .isInt({ gt: 0 })
    .withMessage("Product Id is required and must be an integer"),
];
