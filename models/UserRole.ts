import {
  Table, Column, Model, ForeignKey, BelongsTo,
} from 'sequelize-typescript';

import User from './User';
import Role from './Role';

@Table({
  tableName: 'user_role',
  timestamps: true,
})

export default class UserRole extends Model {
  @ForeignKey(() => User)
  @Column
    userId!: number;

  @ForeignKey(() => Role)
  @Column
    roleId!: number;

  @BelongsTo(() => User)
    user!: User;

  @BelongsTo(() => Role)
    role!: Role;
}
