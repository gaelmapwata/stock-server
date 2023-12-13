/* eslint-disable import/no-import-module-exports */
import { QueryInterface } from 'sequelize';
import sequelize from '../sequelize-instance';
import User from '../models/User';
import { bcryptHashPassword } from '../utils/bcrypt.util';
import Role from '../models/Role';

interface IUserPayload {
  email: string;
  password: string;
  roleName: string;
}

const USERS: IUserPayload[] = [
  {
    email: 'admin@user.com',
    password: '1234',
    roleName: 'admin',
  },
  {
    email: 'user1@user.com',
    password: '1234',
    roleName: 'user',
  },
  {
    email: 'user2@user.com',
    password: '1235',
    roleName: 'user',
  },
  {
    email: 'user3@user.com',
    password: '1236',
    roleName: 'user',
  },
];

async function saveUser(user: IUserPayload, role: Role | undefined) {
  try {
    const hashedPassword = await bcryptHashPassword(user.password);
    const [newUser] = await User.findOrCreate({
      where: { email: user.email },
      defaults: {
        email: user.email,
        password: hashedPassword,
      },
    });
    newUser.$set('roles', role?.id ?? null);
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
          const roles = await Role.findAll();
          Promise.all(
            USERS.map((user) => saveUser(user, roles.find((role) => role.name === user.roleName))),
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
