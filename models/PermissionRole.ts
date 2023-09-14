import {
  Table, Column, Model, ForeignKey, BelongsTo,
} from 'sequelize-typescript';

import Permission from './Permission';
import Role from './Role';

@Table({
  tableName: 'permission_role',
  timestamps: true,
})

export default class PermissionRole extends Model {
  @ForeignKey(() => Permission)
  @Column
    permissionId!: number;

  @ForeignKey(() => Role)
  @Column
    roleId!: number;

  @BelongsTo(() => Permission)
    permission!: Permission;

  @BelongsTo(() => Role)
    role!: Role;
}
