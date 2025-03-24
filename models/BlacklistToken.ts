import {
  Table, Column, Model,
} from 'sequelize-typescript';

@Table({
  tableName: 'blacklist_tokens',
  timestamps: true,
  paranoid: true,
})
export default class BlacklistToken extends Model {
  static fillable = [
    'token',
    'type',
  ];

  @Column
    token!: string;

  @Column
    type!: string;
}
