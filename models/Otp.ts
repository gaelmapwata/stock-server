import {
  Table, Column, Model,
} from 'sequelize-typescript';

@Table({
  tableName: 'otps',
  timestamps: true,
  paranoid: true,
})
export default class Otp extends Model {
  static fillable = [
    'email',
    'otp',
    'expirationDate',
  ];

  @Column
    email!: string;

  @Column
    otp!: string;

  @Column
    expirationDate!: string;
}
