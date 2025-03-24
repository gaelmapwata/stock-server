import {
  Table, Column, Model,
  HasMany,
} from 'sequelize-typescript';
import Permission from './Permission';

@Table({
  tableName: 'ressources',
  timestamps: true,
  paranoid: true,
})
export default class Ressource extends Model {
  static fillable = [
    'name',
  ];

  @Column
    name!: string;

  @HasMany(() => Permission)
    permissions!: Permission[];
}
