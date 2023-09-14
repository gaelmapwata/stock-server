import {
  Table, Column, Model, BelongsTo, BelongsToMany, ForeignKey,
} from 'sequelize-typescript';
import Ressource from './Ressource';
import PermissionRole from './PermissionRole';
import Role from './Role';

@Table({
  tableName: 'permissions',
  timestamps: true,
  paranoid: true,
})
export default class Permission extends Model {
  static USER = {
    CREATE: 'USER:CREATE',
    READ: 'USER:READ',
    DELETE: 'USER:DELETE',
    UPDATE: 'USER:UPDATE',
  };

  static ROLE = {
    CREATE: 'ROLE:CREATE',
    READ: 'ROLE:READ',
    DELETE: 'ROLE:DELETE',
    UPDATE: 'ROLE:UPDATE',
  };

  static RESSOURCE = {
    READ: 'ROLE:READ',
  };

  @ForeignKey(() => Ressource)
  @Column
    ressourceId!: number;

  @Column
    name!: string;

  @Column
    slug!: string;

  @BelongsTo(() => Ressource)
    ressource!: Ressource;

  @BelongsToMany(() => Role, () => PermissionRole)
    roles!: Role[];
}
