import {
  Table, Column, Model,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';

import Branch from './Branch';

@Table({
  tableName: 'departments',
  timestamps: true,
  paranoid: true,
})
export default class Department extends Model {
  static fillable = [
    'label',
    'branchId',
  ];

  @Column
    label!: string;

   @ForeignKey(() => Branch)
    @Column
     branchId!: number;

    @BelongsTo(() => Branch)
      branch!:Branch;
}
