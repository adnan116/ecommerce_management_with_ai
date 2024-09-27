import { Table, Column, Model, DataType, ForeignKey } from 'sequelize-typescript';
import Role from './role';
import Feature from './feature';

@Table({
  tableName: 'role_feature',
  schema: 'users',
  timestamps: false,
})
export default class RoleFeature extends Model {
  @ForeignKey(() => Role)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  role_id!: number;

  @ForeignKey(() => Feature)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  feature_id!: number;
}
