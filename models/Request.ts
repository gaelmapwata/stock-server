import {
  Table, Column, Model,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';

import Article from './Article';
import User from './User';

@Table({
  tableName: 'requests',
  timestamps: true,
  paranoid: true,
})
export default class Request extends Model {
  static fillable = [
    'requestQuantity',
    'receivedQuantity',
    'articleId',
    'userRequest',
    'userApproved',
  ];

  @Column
    requestQuantity!: number;

  @Column
    receivedQuantity!: number;

  @ForeignKey(() => Article)
  @Column
    articleId!: number;

  @ForeignKey(() => User)
  @Column
    userRequest!: number;

  @ForeignKey(() => User)
  @Column
    userApproved!: number;

  @BelongsTo(() => User)
    user!:User;

  @BelongsTo(() => User, 'userApproved')
    checker!:User;
}
