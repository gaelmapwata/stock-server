import {
  Table, Column, Model,
} from 'sequelize-typescript';

@Table({
  tableName: 'type_articles',
  timestamps: true,
  paranoid: true,
})
export default class TypeArticle extends Model {
  static fillable = [
    'label',
  ];

  @Column
    label!: string;
}
