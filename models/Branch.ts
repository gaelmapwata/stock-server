import {
  Table, Column, Model,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';

import Bank from './Bank';

@Table({
  tableName: 'branches',
  timestamps: true,
  paranoid: true,
})
export default class Branch extends Model {
  static fillable = [
    'label',
    'solId',
    'bankId',
  ];

  @Column
    label!: string;

  @Column
    solId!: number;

  @ForeignKey(() => Bank)
  @Column
    bankId!: number;

  @BelongsTo(() => Bank)
    bank!:Bank;
}
