import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import Role from "./role";
import Feature from "./feature";

@Table({
  tableName: "role_feature",
  schema: "users",
  timestamps: false,
})
export default class RoleFeature extends Model {
  @ForeignKey(() => Role)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  role_id!: number;

  @BelongsTo(() => Role)
  role!: Role;

  @ForeignKey(() => Feature)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  feature_id!: number;

  @BelongsTo(() => Feature)
  feature!: Feature;
}
