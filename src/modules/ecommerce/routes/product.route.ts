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

const router: Router = express.Router();

// Create api for products
router.post(
  "/create",
  validates(productCreateValidates),
  [authMiddleware, checkPermission("create_product")],
  wrap(async (req: Request, res: Response, next: NextFunction) => {
    const productCreateData: IProductCreate = req.body;
    const productService = Container.get(ProductService);
    const productCreateResponse: IProductCreateUpdateDeleteResponse =
      await productService.createNewProduct(
        productCreateData,
        req.user?.userId
      );
    res.status(201).json({
      message: "Product created successfully",
      data: productCreateResponse,
    });
  })
);

// Update api for products
router.put(
  "/update/:productId",
  validates(productUpdateValidates),
  [authMiddleware, checkPermission("update_product")],
  wrap(async (req: Request, res: Response, next: NextFunction) => {
    let productUpdateData: IProductUpdate = req.body;
    productUpdateData = {
      ...productUpdateData,
      productId: Number(req.params?.productId),
    };
    const productService = Container.get(ProductService);
    const productUpdateResponse: IProductCreateUpdateDeleteResponse =
      await productService.updateExistingProduct(
        productUpdateData,
        req.user?.userId
      );
    res.status(200).json({
      message: "Product updated successfully",
      data: productUpdateResponse,
    });
  })
);

// Delete api for products
router.delete(
  "/delete/:productId",
  validates(productDeleteValidates),
  [authMiddleware, checkPermission("delete_product")],
  wrap(async (req: Request, res: Response, next: NextFunction) => {
    const productId: number = Number(req.params?.productId);
    const productService = Container.get(ProductService);
    const productDeleteResponse: IProductCreateUpdateDeleteResponse =
      await productService.deleteExistingProduct(productId);
    res.status(200).json({
      message: "Product deleted successfully",
      data: productDeleteResponse,
    });
  })
);

// Get all products list with pagination
router.get(
  "/product-list",
  [authMiddleware, checkPermission("get_all_products")],
  wrap(async (req: Request, res: Response, next: NextFunction) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const productService = Container.get(ProductService);

    const paginatedProducts = await productService.getPaginatedProducts(
      page,
      limit
    );
    res.status(200).json({
      message: "Request successful",
      data: paginatedProducts,
    });
  })
);

// Get all products list with pagination
router.get(
  "/total-sales-per-category",
  [authMiddleware, checkPermission("get_products_sale_by_category")],
  wrap(async (req: Request, res: Response, next: NextFunction) => {
    const productService = Container.get(ProductService);
    const totalSalesPerCategoryProducts =
      await productService.getTotalSalesPerCategory();
    res.status(200).json({
      message: "Request successful",
      data: totalSalesPerCategoryProducts,
    });
  })
);

export default router;
