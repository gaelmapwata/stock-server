import {
  Table, Column, Model,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';

import TypeArticle from './TypeArticle';
import User from './User';

@Table({
  tableName: 'articles',
  timestamps: true,
  paranoid: true,
})
export default class Article extends Model {
  static fillable = [
    'label',
    'description',
    'stockQuantity',
    'typeArticleId',
    'userId',
  ];

  @Column
    label!: string;

  @Column
    description!: string;

  @Column
    stockQuantity!: number;

  @ForeignKey(() => TypeArticle)
  @Column
    typeArticleId!: number;

  @ForeignKey(() => User)
  @Column
    userId!: number;

  @BelongsTo(() => TypeArticle)
    typeArticle!:TypeArticle;

  @BelongsTo(() => User)
    user!:User;
}
