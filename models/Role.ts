import {
  Table, Column, Model,
  BelongsToMany,
} from 'sequelize-typescript';
import Permission from './Permission';
import PermissionRole from './PermissionRole';
import User from './User';
import UserRole from './UserRole';

@Table({
  tableName: 'roles',
  timestamps: true,
  paranoid: true,
})
export default class Role extends Model {
  static fillable = [
    'name',
  ];

  @Column
    name!: string;

  @BelongsToMany(() => Permission, () => PermissionRole)
    permissions!: Permission[];

  @BelongsToMany(() => User, () => UserRole)
    users!: User[];
}
