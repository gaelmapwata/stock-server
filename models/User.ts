import {
  Table, Column, Model,
  ForeignKey,
  BelongsTo,
  BelongsToMany,
} from 'sequelize-typescript';

import Department from './Department';
import UserRole from './UserRole';
import Role from './Role';

@Table({
  tableName: 'users',
  timestamps: true,
  paranoid: true,
})
export default class User extends Model {
  static fillable = [
    'email',
    'locked',
    'totalLoginAttempt',
    'departmentId',
  ];

  @Column
    email!: string;

  @Column
    locked!: boolean;

  @Column
    totalLoginAttempt!: number;

   @ForeignKey(() => Department)
    @Column
     departmentId!: number;

    @BelongsTo(() => Department)
      department!:Department;

    @BelongsToMany(() => Role, () => UserRole)
      roles!: Role[];
}
