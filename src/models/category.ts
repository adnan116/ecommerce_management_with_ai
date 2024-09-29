import {
  Table,
  Column,
  Model,
  DataType,
  Index,
  HasMany,
  CreatedAt,
  UpdatedAt,
} from "sequelize-typescript";
import Product from "./product";

@Table({
  tableName: "categories",
  schema: "ecommerce",
})
export default class Category extends Model {
  @Index
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id!: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  name!: string;

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

  @HasMany(() => Product)
  products!: Product[];
}
