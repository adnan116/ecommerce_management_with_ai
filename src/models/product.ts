import {
  Table,
  Column,
  Model,
  DataType,
  Index,
  ForeignKey,
  BelongsTo,
  CreatedAt,
  UpdatedAt,
  HasMany,
} from "sequelize-typescript";
import Category from "./category";
import OrderItem from "./order-item";

@Table({
  tableName: "products",
  schema: "ecommerce",
})
export default class Product extends Model {
  @Index
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id!: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name!: string;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  price!: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  stock!: number;

  @ForeignKey(() => Category)
  @Index
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  category_id!: number;

  @BelongsTo(() => Category)
  category!: Category;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  created_by!: string;

  @HasMany(() => OrderItem)
  orderItems!: OrderItem[];

  @CreatedAt
  @Index
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
