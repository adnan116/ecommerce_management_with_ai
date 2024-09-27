import express, { NextFunction, Request, Response, Router } from "express";
import { Paginate } from "../../../utils/pagination.util";
import Container from "typedi";
import { wrap } from "../../../middlewares/wraps.middle";
import { getLongLivedToken } from "../../../utils/jwt.util";
// import { auth } from "../middlewares/auth.middle";
import UserService from "../services/user.service";
import BadRequestError from "../../../errors/bad-request.error";
import PersonInfo from "../../../models/person-info";
import bcrypt from "bcrypt";
import User from "../../../models/user";
import {
  IUserSignupData,
  IUserSignupResponse,
} from "../interfaces/user.interface";
import { validates } from "../../../middlewares/express-validation.middle";
import { userSignUpValidation } from "../validators/user.validator";
import jwt from "jsonwebtoken";

const router: Router = express.Router();

/**
 * sign up api for users
 */
router.post(
  "/sign-up",
  validates(userSignUpValidation),
  wrap(async (req: Request, res: Response, next: NextFunction) => {
    const userSignupData: IUserSignupData = req.body;
    const userService = Container.get(UserService);
    const user = await userService.registerUser(userSignupData);
    res.status(201).json({
      message: "User created successfully",
      user: {
        id: user?.id,
        username: user.username,
        email: user.email,
      },
    });
  })
);

// Login API
router.post("/login", async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const userService = Container.get(UserService);
  const user = await userService.verifyUserLogin(username, password);

  res.status(200).json({
    message: "Login successful",
    user
  });
});

/**
 * get user details by id
 * authId: 2.2
 */
router.get(
  "/:id",
  // auth(["*"]),
  wrap(async (req: Request, res: Response, next: NextFunction) => {
    const userService: UserService = Container.get(UserService);
    let result = {};
    return res.status(200).json({
      message: "Request Successful",
      data: result ?? null,
    });
  })
);

export default router;
