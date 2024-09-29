import { body, param } from "express-validator";

export const aslToLLMValidates = [
  body("question")
    .optional()
    .isString()
    .withMessage("Question is required and must be a string"),
];
