/* eslint-disable import/no-import-module-exports */
import { QueryInterface } from 'sequelize';
import sequelize from '../sequelize-instance';
import User from '../models/User';
import { bcryptHashPassword } from '../utils/bcrypt.util';

interface IUserPayload {
  email: string;
  password: string;
}

const USERS: IUserPayload[] = [
  {
    email: 'user1@user.com',
    password: '1234',
  },
  {
    email: 'user2@user.com',
    password: '1235',
  },
  {
    email: 'user3@user.com',
    password: '1236',
  },
];

async function saveUser(user: IUserPayload) {
  try {
    const hashedPassword = await bcryptHashPassword(user.password);
    const newUser = await User.findOrCreate({
      where: { email: user.email },
      defaults: {
        email: user.email,
        password: hashedPassword,
      },
    });
    return newUser;
  } catch (error) {
    return Promise.reject(error);
  }
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up() {
    return new Promise((resolve, reject) => {
      sequelize.authenticate()
        .then(async () => {
          Promise.all(
            USERS.map((user) => saveUser(user)),
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
