import { toCamelKeys, toSnakeCase } from "keys-transform";
import { Service } from "typedi";
import {
  IPaginatedProductResult,
  IProductCreate,
  IProductCreateUpdateDeleteResponse,
  IProductUpdate,
} from "../interfaces/product.interface";
import PersonInfo from "../../../models/person-info";
import BadRequestError from "../../../errors/bad-request.error";
import bcrypt from "bcrypt";
import User from "../../../models/user";
import Role from "../../../models/role";
import jwt from "jsonwebtoken";
import { jwtSecret, tokenExpireTime } from "../../../configs/app.config";
import AuthError from "../../../errors/auth.error";
import Product from "../../../models/product";
import Category from "../../../models/category";
import { sequelize } from "../../../configs/db";
import Order from "../../../models/order";
import {
  IEachOrderProduct,
  IOrderCreate,
  IOrderCreateUpdateResponse,
  UsersWithOrdersResponse,
} from "../interfaces/order.interface";
import OrderItem from "../../../models/order-item";

@Service()
export default class OrderService {
  constructor() {}

  // create order
  async createNewOrder(
    orderCreateData: IOrderCreate,
    createdBy: number
  ): Promise<IOrderCreateUpdateResponse> {
    const transaction = await sequelize.transaction();
    try {
      const { userId, items } = orderCreateData;
      // Create a new order
      const order = await Order.create(
        {
          user_id: userId,
          status: "Pending",
          created_by: createdBy,
        },
        { transaction }
      );

      // Process each item in the order
      for (const item of items) {
        // Find the product
        const product = await Product.findByPk(item.productId, { transaction });
        console.log({ product });

        if (!product) {
          throw new BadRequestError("Product not available.");
        }

        if (product.stock < item.quantity) {
          throw new BadRequestError(
            `Product ${product?.name} is in insufficient stock.`
          );
        }

        // Create order item
        await OrderItem.create(
          {
            order_id: order.id,
            product_id: product.id,
            quantity: item.quantity,
            created_by: createdBy,
          },
          { transaction }
        );

        // Reduce the stock
        product.stock -= item.quantity;
        await product.save({ transaction });
      }

      // Commit the transaction
      await transaction.commit();
      const orderCreateResponse: IOrderCreateUpdateResponse = {
        orderId: order.id,
        ...orderCreateData,
      };
      return orderCreateResponse;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  // cancel order
  async cancelOrder(
    orderId: number,
    updatedBy: number
  ): Promise<IOrderCreateUpdateResponse> {
    const transaction = await sequelize.transaction();
    try {
      // Find the order
      const order = await Order.findByPk(orderId, {
        include: [OrderItem],
        transaction,
      });

      let orderedItems: IEachOrderProduct[] = [];
      if (!order || order.status === "Cancelled") {
        throw new BadRequestError("Order not found or already cancelled.");
      }

      // Refund stock for each item in the order
      for (const item of order.order_items) {
        const product = await Product.findByPk(item.product_id, {
          transaction,
        });
        if (product) {
          product.stock += item.quantity;
          await product.save({ transaction });
        }
        orderedItems.push({
          productId: item.product_id,
          quantity: item.quantity,
        });
      }

      // Update the order status
      order.status = "Cancelled";
      order.updated_by = updatedBy.toString();
      order.updated_at = new Date();
      await order.save({ transaction });

      // Commit transaction
      await transaction.commit();
      const orderCancelResponse: IOrderCreateUpdateResponse = {
        orderId: order.id,
        userId: order.user_id,
        items: orderedItems,
      };
      return orderCancelResponse;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async getPaginatedUserWiseOrders(
    page: number,
    limit: number
  ): Promise<UsersWithOrdersResponse> {
    const offset = (page - 1) * limit;

    const users = await User.findAndCountAll({
      include: [
        {
          model: Order,
          as: "orders",
        },
      ],
      attributes: { exclude: ["password"] },
      limit: limit,
      offset: offset,
    });
    const camelCasedData = users.rows.map((user) =>
      toCamelKeys(user.get({ plain: true }))
    );
    return {
      data: camelCasedData as any,
      totalCount: users.count,
      totalPages: Math.ceil(users.count / limit),
      currentPage: page,
      pageSize: limit,
    };
  }

  async getPaginatedRankedUsers(limit: number): Promise<Response> {
    try {
      // Retrieve top users by highest orders count
      const topUsers = await User.findAll({
        attributes: {
          exclude: ["password"], // Exclude password from the result
          include: [
            [
              sequelize.literal(`(
              SELECT COUNT(*)
              FROM "ecommerce"."orders" AS "Order"
              WHERE "Order"."user_id" = "User"."id"
            )`),
              "total_orders", // Alias to avoid ambiguity
            ],
          ],
        },
        order: [[sequelize.literal('"total_orders"'), "DESC"]], // Sort by total orders in descending order
        limit: limit,
      });

      // Convert the Sequelize response to camelCase
      const camelCasedData = topUsers.map((user) =>
        toCamelKeys(user.get({ plain: true }))
      );

      return camelCasedData as any;
    } catch (error) {
      throw error;
    }
  }
}
