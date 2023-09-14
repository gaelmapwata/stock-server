/* eslint-disable import/no-import-module-exports */
import { QueryInterface } from 'sequelize';
import sequelize from '../sequelize-instance';
import Role from '../models/Role';
import Permission from '../models/Permission';

interface IRole {
  name: string;
  permissions: string[]
}

const ROLES: IRole[] = [
  {
    name: 'admin',
    permissions: [
      'ROLE:ALL',
      'USER:ALL',
      'RESSOURCE:ALL',
    ],
  },
  {
    name: 'user',
    permissions: [],
  },
];

module.exports = {
  async up() {
    return new Promise((resolve, reject) => {
      sequelize.authenticate()
        .then(async () => {
          const permissions = await Permission.findAll();

          const saveRole = async (role: IRole): Promise<void> => new Promise((resolveRole) => {
            Role.findOrCreate({
              where: { name: role.name },
              defaults: { name: role.name },
            }).then(async ([roleDB]) => {
              await roleDB.$set(
                'permissions',
                role.permissions
                  .map((permission) => permissions.find((p) => p.slug === permission)?.id),
              );

              resolveRole();
            });
          });

          Promise.all(
            ROLES.map((role) => saveRole(role)),
          )
            .then(() => resolve(null));
        })
        .catch((error: Error) => {
          reject(error);
        });
    });
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.bulkDelete('roles', {}, {});
  },
};
