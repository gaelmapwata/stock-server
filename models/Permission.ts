import {
  Table, Column, Model,
  ForeignKey,
  BelongsTo,
  BelongsToMany,
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
    LOCK: 'USER:LOCK',
    UNLOCK: 'USER:UNLOCK',
    VALIDATE: 'USER:VALIDATE',
    ALL: 'USER:ALL',
  };

  static ROLE = {
    CREATE: 'ROLE:CREATE',
    READ: 'ROLE:READ',
    DELETE: 'ROLE:DELETE',
    UPDATE: 'ROLE:UPDATE',
    ADD_PERMISSIONS: 'ROLE:ADD_PERMISSIONS',
    UPDATE_PERMISSIONS: 'ROLE:UPDATE_PERMISSIONS',
    ALL: 'ROLE:ALL',
  };

  static RESSOURCE = {
    READ: 'RESSOURCE:READ',
    ALL: 'RESSOURCE:ALL',
  };

  static BRANCH = {
    READ: 'BRANCH:READ',
    CREATE: 'BRANCH:CREATE',
    UPDATE: 'BRANCH:UPDATE',
    DELETE: 'BRANCH:DELETE',
    ALL: 'BRANCH:ALL',
  };

  static TYPE_ARTICLE = {
    READ: 'TYPE_ARTICLE:READ',
    CREATE: 'TYPE_ARTICLE:CREATE',
    UPDATE: 'TYPE_ARTICLE:UPDATE',
    DELETE: 'TYPE_ARTICLE:DELETE',
    ALL: 'TYPE_ARTICLE:ALL',
  };

  static ARTICLE = {
    READ: 'ARTICLE:READ',
    CREATE: 'ARTICLE:CREATE',
    UPDATE: 'ARTICLE:UPDATE',
    DELETE: 'ARTICLE:DELETE',
    ALL: 'ARTICLE:ALL',
  };

  static REQUEST = {
    READ: 'REQUEST:READ',
    READ_OWN_REQUESTS: 'REQUEST:READ_OWN_REQUESTS',
    READ_ALL_REQUESTS: 'REQUEST:READ_ALL_REQUESTS',
    READ_REQUESTS_TO_VALIDATE: 'REQUEST:READ_REQUESTS_TO_VALIDATE',
    CREATE: 'REQUEST:CREATE',
    UPDATE: 'REQUEST:UPDATE',
    DELETE: 'REQUEST:DELETE',
    VALIDATE: 'REQUEST:VALIDATE',
    READ_REQUEST_TO_VALIDATE_AT_DEPARTMENT_LEVEL: 'READ_REQUEST_TO_VALIDATE_AT_DEPARTMENT_LEVEL',
    ALL: 'REQUEST:ALL',
  };

  static fillable = [
    'slug',
    'name',
    'ressourceId',
  ];

  @Column
    slug!: string;

  @Column
    name!: string;

   @ForeignKey(() => Ressource)
    @Column
     ressourceId!: number;

    @BelongsTo(() => Ressource)
      ressource!:Ressource;

    @BelongsToMany(() => Role, () => PermissionRole)
      roles!: Role[];
}
