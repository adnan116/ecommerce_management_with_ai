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

@Service()
export default class ProductService {
  constructor() {}

  // create product
  async createNewProduct(
    productCreateData: IProductCreate,
    createdBy: number
  ): Promise<IProductCreateUpdateDeleteResponse> {
    try {
      const { name, price, stock, category_id } = productCreateData;

      const category = await Category.findByPk(category_id);
      if (!category) {
        throw new BadRequestError("Category not found");
      }

      const product = await Product.create({
        name,
        price,
        stock,
        category_id,
        created_by: createdBy,
      });

      const productCreateResponse: IProductCreateUpdateDeleteResponse = {
        name: product.name,
        price: product.price,
        stock: product.stock,
      };

      return productCreateResponse;
    } catch (error) {
      throw error;
    }
  }

  // update product
  async updateExistingProduct(
    productUpdateData: IProductUpdate,
    updatedBy: number
  ): Promise<IProductCreateUpdateDeleteResponse> {
    try {
      const { productId, name, price, stock, category_id } = productUpdateData;

      const product = await Product.findByPk(productId);
      if (!product) {
        throw new BadRequestError("Product not found");
      }

      const category = await Category.findByPk(category_id);
      if (!category) {
        throw new BadRequestError("Category not found");
      }

      await product.update({
        name,
        price,
        stock,
        category_id,
        updated_by: updatedBy,
      });
      const productUpdateResponse: IProductCreateUpdateDeleteResponse = {
        id: product.id,
        name: product.name,
        price: product.price,
        stock: product.stock,
      };
      return productUpdateResponse;
    } catch (error) {
      throw error;
    }
  }

  // delete product
  async deleteExistingProduct(
    productId: number
  ): Promise<IProductCreateUpdateDeleteResponse> {
    try {
      const product = await Product.findByPk(productId);
      if (!product) {
        throw new BadRequestError("Product not found");
      }

      await product.destroy();
      const productDeleteResponse: IProductCreateUpdateDeleteResponse = {
        id: product.id,
        name: product.name,
        price: product.price,
        stock: product.stock,
      };
      return productDeleteResponse;
    } catch (error) {
      throw error;
    }
  }

  async getPaginatedProducts(
    page: number,
    limit: number
  ): Promise<IPaginatedProductResult> {
    const offset = (page - 1) * limit; 
    // Fetch products and count the total products
    const { rows: products, count: totalProducts } =
      await Product.findAndCountAll({
        offset,
        limit,
        include: [{ all: true }],
      });

    const totalPages = Math.ceil(totalProducts / limit); 
    return {
      products,
      totalProducts,
      totalPages,
      currentPage: page,
    };
  }
}
