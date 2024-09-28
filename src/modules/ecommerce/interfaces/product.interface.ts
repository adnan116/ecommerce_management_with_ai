import Product from "../../../models/product";

export interface IProductCreate {
  name: string;
  price: number;
  stock: number;
  category_id: number;
}

export interface IProductCreateUpdateDeleteResponse {
  id?: number;
  name: string;
  price: number;
  stock: number;
}

export interface IProductUpdate {
  productId: number;
  name?: string;
  price?: number;
  stock?: number;
  category_id?: number;
}

export interface IPaginatedProductResult {
  products: Product[];
  totalProducts: number;
  totalPages: number;
  currentPage: number;
}
