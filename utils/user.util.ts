import { IUser } from '../types/user';

// eslint-disable-next-line import/prefer-default-export
export const USERS: IUser[] = [
  { id: 1, email: 'user1@user.com', password: '$2a$10$MbdhQ9.0nolif60BPk1v7.B5jE5MN9a8eaL03qOCNtevqnDdagc0.' }, // pass equivalent to 1234
  { id: 2, email: 'user2@user.com', password: '$2a$10$T0iyaQvTCQGM5xBXwSb6WecuBDH5rplzWYeCSkJVFLc.NrWQHTkKi' }, // equivalent to 1235
  { id: 3, email: 'user3@user.com', password: '$2a$10$ocdjXTWoow3oc/BEp10UTOr3Tmt6NNTyhuEHgTMHMLq3wbVc7HDri' }, // equivalent to 1236
];
