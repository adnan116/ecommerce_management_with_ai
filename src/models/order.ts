import {
  Table,
  Column,
  Model,
  DataType,
  Index,
  ForeignKey,
  BelongsTo,
  HasMany,
  UpdatedAt,
  CreatedAt,
} from "sequelize-typescript";
import User from "./user";
import OrderItem from "./order-item";

@Table({
  tableName: "orders",
  schema: "ecommerce",
})
export default class Order extends Model {
  @Index
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id!: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  user_id!: number;

  @BelongsTo(() => User)
  user!: User;

  @Index
  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  order_date!: Date;

  @Index
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  status!: string;

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


  @HasMany(() => OrderItem)
  order_items!: OrderItem[];
}
