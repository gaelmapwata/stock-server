import {
  Table, Column, Model,
} from 'sequelize-typescript';

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
}
