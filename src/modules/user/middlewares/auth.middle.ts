import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../../../models/user";
import Role from "../../../models/role";
import RoleFeature from "../../../models/role-feature";
import Feature from "../../../models/feature";
import { jwtSecret } from "../../../configs/app.config";

// Auth middleware to verify JWT and permissions
export const authMiddleware = (requiredFeature: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    try {
      // Verify token
      const decodedToken: any = jwt.verify(token, jwtSecret as jwt.Secret);

      // Find the user by ID
      const user = await User.findOne({
        where: { id: decodedToken.userId },
        include: [Role],
      });

      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      // Check if the role has the required feature
      const roleFeature = await RoleFeature.findOne({
        where: {
          role_id: user.role_id,
        },
        include: [
          {
            model: Feature,
            where: { feature_name: requiredFeature },
          },
        ],
      });

      if (!roleFeature) {
        return res.status(403).json({ message: "Insufficient permissions" });
      }

      // User and permission are valid, proceed to the next middleware
      req.user = { id: user.id, role: user.role_id };
      next();
    } catch (error) {
      console.error("Authorization error:", error);
      res.status(401).json({ message: "Invalid token" });
    }
  };
};
