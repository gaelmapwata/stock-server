import {
  Table, Column, Model,
} from 'sequelize-typescript';

@Table({
  tableName: 'users',
  timestamps: true,
  paranoid: true,
})
export default class User extends Model {
  static fillable = ['email'];

  @Column
    email!: string;
}
