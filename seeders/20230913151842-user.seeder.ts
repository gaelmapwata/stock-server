/* eslint-disable import/no-import-module-exports */
import { QueryInterface } from 'sequelize';
import sequelize from '../sequelize-instance';
import User from '../models/User';

const USERS_EMAILS = [
  'user1@user.mail',
  'user2@user.mail',
  'user3@user.mail',
  'user4@user.mail',
  'user5@user.mail',
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up() {
    return new Promise((resolve, reject) => {
      sequelize.authenticate()
        .then(async () => {
          Promise.all(
            USERS_EMAILS.map((userEmail) => User.findOrCreate({
              where: { email: userEmail },
              defaults: { email: userEmail },
            })),
          )
            .then(() => resolve(null));
        })
        .catch((error: Error) => {
          reject(error);
        });
    });
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.bulkDelete('users', {}, {});
  },
};
