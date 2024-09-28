import { body, param } from "express-validator";

export const createOrderValidation = [
  body("userId").isInt().withMessage("User ID must be a valid integer"),
  body("items").isArray().withMessage("Items must be an array"),
  body("items.*.productId")
    .isInt()
    .withMessage("Product ID must be a valid integer"),
  body("items.*.quantity")
    .isInt({ gt: 0 })
    .withMessage("Quantity must be a positive integer"),
];

export const cancelOrderValidation = [
  param("orderId").isInt().withMessage("Order ID must be a valid integer"),
];
