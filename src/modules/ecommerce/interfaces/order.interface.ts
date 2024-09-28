import Order from "../../../models/order";

export interface IEachOrderProduct {
  productId: number;
  quantity: number;
}

export interface IOrderCreate {
  userId: number;
  items: IEachOrderProduct[];
}

export interface IOrderCreateUpdateResponse {
  orderId: number;
  userId: number;
  items: IEachOrderProduct[];
}

export interface IUserSection {
  id: number;
  username: string;
  is_active: boolean;
  created_at: Date;
  orders?: Order[];
}

export interface IOrderSection {
  id: number;
  status: string;
  order_date: Date;
  created_at: Date;
}

export interface PaginatedResponse<T> {
  data: T[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export interface UsersWithOrdersResponse
  extends PaginatedResponse<IUserSection> {}
