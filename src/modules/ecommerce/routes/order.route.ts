import express, { NextFunction, Request, Response, Router } from "express";
import Container from "typedi";
import { wrap } from "../../../middlewares/wraps.middle";
import {
  IProductCreate,
  IProductCreateUpdateDeleteResponse,
  IProductUpdate,
} from "../interfaces/product.interface";
import { validates } from "../../../middlewares/express-validation.middle";
import {
  productCreateValidates,
  productDeleteValidates,
  productUpdateValidates,
} from "../validators/product.validator";
import ProductService from "../services/product.service";
import {
  authMiddleware,
  checkPermission,
} from "../../user/middlewares/auth.middle";
import {
  cancelOrderValidation,
  createOrderValidation,
} from "../validators/order.validator";
import {
  IOrderCreate,
  IOrderCreateUpdateResponse,
} from "../interfaces/order.interface";
import OrderService from "../services/order.service";

const router: Router = express.Router();

// Create api for order
router.post(
  "/create",
  validates(createOrderValidation),
  [authMiddleware, checkPermission("create_order")],
  wrap(async (req: Request, res: Response, next: NextFunction) => {
    const orderCreateData: IOrderCreate = req.body;
    const orderService = Container.get(OrderService);
    const orderCreateResponse: IOrderCreateUpdateResponse =
      await orderService.createNewOrder(orderCreateData, req.user?.userId);
    res.status(201).json({
      message: "Order placed successfully",
      data: orderCreateResponse,
    });
  })
);

// Update api for order
router.put(
  "/cancel/:orderId",
  validates(cancelOrderValidation),
  [authMiddleware, checkPermission("cancel_order")],
  wrap(async (req: Request, res: Response, next: NextFunction) => {
    const orderId: number = Number(req.params?.orderId);
    const orderService = Container.get(OrderService);
    const orderCancelResponse: IOrderCreateUpdateResponse =
      (await orderService.cancelOrder(orderId, req.user?.userId)) as any;
    res.status(200).json({
      message: "Order cancelled successfully",
      data: orderCancelResponse,
    });
  })
);

// Get user wise order list with pagination
router.get(
  "/user-order-list",
  [authMiddleware, checkPermission("get_user_wise_orders")],
  wrap(async (req: Request, res: Response, next: NextFunction) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const orderService = Container.get(OrderService);

    const paginatedUserWiseOrders =
      await orderService.getPaginatedUserWiseOrders(page, limit);
    res.status(200).json({
      message: "Request successful",
      data: paginatedUserWiseOrders,
    });
  })
);

// Get ranked user list based on order count with pagination
router.get(
  "/ranked-user-list",
  [authMiddleware, checkPermission("get_ranked_users")],
  wrap(async (req: Request, res: Response, next: NextFunction) => {
    const limit = parseInt(req.query.limit as string) || 10;
    const orderService = Container.get(OrderService);

    const paginatedRankedUsers = await orderService.getPaginatedRankedUsers(
      limit
    );
    res.status(200).json({
      message: "Request successful",
      data: paginatedRankedUsers,
    });
  })
);

export default router;
