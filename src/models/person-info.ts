import { Table, Column, Model, DataType, HasOne } from "sequelize-typescript";
import User from "./user";

@Table({
  tableName: "person_info",
  schema: "users",
  timestamps: false,
})
export default class PersonInfo extends Model {
  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  first_name!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  last_name!: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  dob!: Date;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  phone_number!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  email!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  gender!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  religion!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  profile_picture!: string;

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

  @HasOne(() => User)
  user!: User;
}
