import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import RoleFeature from './role-feature';

@Table({
  tableName: 'feature',
  schema: 'users',
  timestamps: false,
})
export default class Feature extends Model {
  @Column({
    type: DataType.TEXT,
    allowNull: false,
    unique: true,
  })
  feature_name!: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  is_active!: boolean;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  created_by!: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
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

  @HasMany(() => RoleFeature)
  role_features!: RoleFeature[];
}

