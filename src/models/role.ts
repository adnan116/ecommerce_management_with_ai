import {
  Table,
  Column,
  Model,
  DataType,
  Unique,
  CreatedAt,
  UpdatedAt,
  HasMany,
} from "sequelize-typescript";
import User from "./user"; // Ensure you have the correct import path

@Table({
  tableName: "role",
  schema: "users",
})
export default class Role extends Model<Role> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id!: number;

  @Unique
  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  role_name!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  description!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  created_by!: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    defaultValue: DataType.NOW,
  })
  created_at!: Date;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  updated_by!: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  updated_at!: Date;
  // Define the relation to the User model
  @HasMany(() => User)
  users!: User[];
}
