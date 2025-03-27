import {
  Table, Column, Model,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';

import Article from './Article';
import User from './User';
import Department from './Department';

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
    'departmentId',
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

  @ForeignKey(() => Department)
  @Column
    departmentId!: number;

  @ForeignKey(() => User)
  @Column
    userRequest!: number;

  @ForeignKey(() => User)
  @Column
    userApproved!: number;

  // Association avec User (demandeur) -> Éviter le conflit avec 'userRequest'
  @BelongsTo(() => User, { foreignKey: 'userRequest', as: 'requester' })
    requester!: User;

  // Association avec User (approbateur) -> Éviter le conflit avec 'userApproved'
  @BelongsTo(() => User, { foreignKey: 'userApproved', as: 'approver' })
    approver!: User;

  // Association avec Article
  @BelongsTo(() => Article)
    article!: Article;

  // Association avec Department
  @BelongsTo(() => Department)
    department!: Department;
}
