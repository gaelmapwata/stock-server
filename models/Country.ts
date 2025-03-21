import {
  Table, Column, Model,
} from 'sequelize-typescript';

@Table({
  tableName: 'countries',
  timestamps: true,
  paranoid: true,
})
export default class Country extends Model {
  static fillable = [
    'label',
    'code2',
    'code3',
    'telPrefixNum',
  ];

  @Column
    label!: string;

  @Column
    code2!: string;

  @Column
    code3!: string;

  @Column
    telPrefixNum!: number;
}
