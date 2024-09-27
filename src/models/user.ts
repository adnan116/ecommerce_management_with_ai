import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  CreatedAt,
  UpdatedAt,
} from "sequelize-typescript";
import Role from "./role";
import PersonInfo from "./person-info";

@Table({
  tableName: "user", 
  schema: "users",
})
export default class User extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id!: number;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  username!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  password!: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
    defaultValue: true,
  })
  is_active!: boolean;

  @ForeignKey(() => PersonInfo)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  person_id!: number;

  @BelongsTo(() => PersonInfo)
  person_info!: PersonInfo;

  @ForeignKey(() => Role)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  role_id!: number;

  @BelongsTo(() => Role)
  role!: Role;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  created_by!: string;

  @CreatedAt
  @Column({ type: DataType.DATE })
  created_at!: Date;

  @UpdatedAt
  @Column({ type: DataType.DATE })
  updated_at!: Date;
}
