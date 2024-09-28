import { toCamelKeys, toSnakeCase } from "keys-transform";
import { Service } from "typedi";
import {
  IUserLoginResponse,
  IUserSignupData,
  IUserSignupResponse,
} from "../interfaces/user.interface";
import PersonInfo from "../../../models/person-info";
import BadRequestError from "../../../errors/bad-request.error";
import bcrypt from "bcrypt";
import User from "../../../models/user";
import Role from "../../../models/role";
import { sequelize } from "../../../configs/db";
import jwt from "jsonwebtoken";
import { jwtSecret, tokenExpireTime } from "../../../configs/app.config";
import AuthError from "../../../errors/auth.error";

@Service()
export default class UserService {
  constructor() {}

  async registerUser(userInfo: IUserSignupData): Promise<IUserSignupResponse> {
    let {
      firstName,
      lastName,
      dob,
      profilePicture,
      phoneNumber,
      email,
      gender,
      religion,
      password,
    } = userInfo;

    // Start a transaction
    const transaction = await sequelize.transaction();

    try {
      // Check if the email already exists in person_info
      const existingPerson = await PersonInfo.findOne({
        where: { email: userInfo.email },
        transaction, // Ensures the find operation is part of the transaction
      });

      if (existingPerson) {
        throw new BadRequestError("Email already in use");
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create PersonInfo entry
      const personInfo = await PersonInfo.create(
        {
          first_name: firstName,
          last_name: lastName,
          dob,
          phone_number: phoneNumber,
          email,
          gender,
          religion,
          created_by: "SELF",
        },
        { transaction }
      );

      // Generate dynamic username
      const username = await this.generateDynamicUsername(firstName, lastName);

      // Get the 'user' role
      const userRole = await Role.findOne({
        where: { role_name: "user" },
        transaction,
      });
      if (!userRole) {
        throw new BadRequestError("User role not found");
      }

      // Create User entry
      const user = await User.create(
        {
          username,
          password: hashedPassword,
          person_id: personInfo.id,
          role_id: userRole.id,
          is_active: true,
          created_by: "SELF",
        },
        { transaction }
      );

      // If everything goes well, commit the transaction
      await transaction.commit();

      // Prepare the response
      const userResponseInfo: IUserSignupResponse = {
        id: user?.id,
        username: user?.username,
        email: personInfo?.email,
      };

      return userResponseInfo;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async generateDynamicUsername(
    firstName: string,
    lastName: string
  ): Promise<string> {
    const baseName = `${firstName}${lastName}`.toLowerCase().replace(/\s/g, "");
    const randomNum = Math.floor(Math.random() * 9000) + 1000;
    const username = `${baseName}${randomNum}`;

    return username.slice(0, 20);
  }

  async verifyUserLogin(
    username: string,
    password: string
  ): Promise<IUserLoginResponse> {
    try {
      // Find the user by username
      const user = (await User.findOne({
        where: { username },
        include: [
          {
            model: Role,
            attributes: ["id", "role_name"], // Include the fields you need from Role
          },
          {
            model: PersonInfo, // Include PersonInfo related to the User
            attributes: [
              "first_name",
              "last_name",
              "email",
              "phone_number",
              "dob",
            ], // Include fields you need from PersonInfo
          },
        ],
      })) as any;

      if (!user) {
        throw new AuthError("User not found");
      }

      // Compare password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new AuthError("Invalid credentials");
      }

      // Create JWT payload with user ID and role
      const tokenPayload = {
        userId: user.id,
        username: user.username,
        roleId: user.role_id,
        userType: user?.role?.role_name,
      };

      // Generate a token valid for 1 hour
      const accessToken = jwt.sign(tokenPayload, jwtSecret as jwt.Secret, {
        expiresIn: tokenExpireTime,
      });

      const loginResponse: IUserLoginResponse = {
        accessToken,
        userName: user.username,
        userInfo: {
          firstName: user?.person_info?.first_name ?? null,
          lastName: user?.person_info?.last_name ?? null,
          email: user?.person_info?.email ?? null,
        },
      };

      return loginResponse;
    } catch (error) {
      console.error("Error during login:", error);
      throw error;
    }
  }

  injectionFilter(key: string): string {
    return toSnakeCase(key);
  }
}
