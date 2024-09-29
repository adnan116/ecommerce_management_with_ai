import express, { NextFunction, Request, Response, Router } from "express";
import Container from "typedi";
import { wrap } from "../../../middlewares/wraps.middle";
import { validates } from "../../../middlewares/express-validation.middle";

import {
  authMiddleware,
  checkPermission,
} from "../../user/middlewares/auth.middle";
import AskLLMService from "../services/ask-llm.service";
import { aslToLLMValidates } from "../validators/ask-llm.validator";

const router: Router = express.Router();

// Get question answer from llm
router.get(
  "/ask-question",
  validates(aslToLLMValidates),
  [authMiddleware, checkPermission("get_llm_question_answer")],
  wrap(async (req: Request, res: Response, next: NextFunction) => {
    const question: string = req.body.question;
    const askLlmService = Container.get(AskLLMService);
    const aiRespopnse = await askLlmService.getQuestionAnswerFromAI(question);
    res.status(200).json({
      message: "Request successful",
      data: aiRespopnse,
    });
  })
);

export default router;
