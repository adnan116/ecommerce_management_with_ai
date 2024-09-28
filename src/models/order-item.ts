import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  Index,
  CreatedAt,
  UpdatedAt,
} from "sequelize-typescript";
import Order from "./order";
import Product from "./product";

@Table({
  tableName: "order_items",
  schema: "ecommerce",
})
export default class OrderItem extends Model {
  @ForeignKey(() => Order)
  @Index
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  order_id!: number;

  @ForeignKey(() => Product)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  product_id!: number;

  @BelongsTo(() => Product)
  product!: Product;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  quantity!: number;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  created_by!: string;

  @CreatedAt
  @Column({ type: DataType.DATE, allowNull: true, field: "created_at" })
  created_at!: Date;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  updated_by!: string;

  @UpdatedAt
  @Column({ type: DataType.DATE, allowNull: true, field: "updated_at" })
  updated_at!: Date;
}
