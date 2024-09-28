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
import User from "./user";
import RoleFeature from "./role-feature";

@Table({
  tableName: "role",
  schema: "users",
  timestamps: false, // Disable automatic timestamps
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

  // Define the relation to the User model
  @HasMany(() => User)
  users!: User[];

  @HasMany(() => RoleFeature)
  role_features!: RoleFeature[];
}
