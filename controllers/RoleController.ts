import { Request, Response } from 'express';
import { checkSchema } from 'express-validator';
import Role from '../models/Role';
import Permission from '../models/Permission';
import Ressource from '../models/Ressource';
import roleValidators from '../validators/role.validator';
import { handleExpressValidators } from '../utils/express.util';

function groupPermissionsByRessources(permissions: Permission[]): Ressource[] {
  const ressources: Ressource[] = [];
  permissions.forEach((permission) => {
    const index = ressources.findIndex((ressource) => ressource.id === permission.ressource.id);
    if (index !== -1) {
      ressources[index].permissions.push(permission);
    } else {
      const newRessource = {
        ...permission.ressource.dataValues,
        permissions: [permission],
      } as Ressource;
      ressources.push(newRessource);
    }
  });
  return ressources;
}

export default {
  index: async (req: Request, res: Response) => {
    try {
      const roles = await Role.findAll({
        include: [{ model: Permission, include: [Ressource] }],
      });

      const rolesRessources = roles.map((role) => ({
        ...role.toJSON(),
        ressources: groupPermissionsByRessources(role.permissions),
      }));

      res.status(200).json(rolesRessources);
    } catch (error) {
      res.status(500).json(error);
    }
  },

  store: [
    checkSchema(roleValidators.storeSchema),
    async (req: Request, res: Response) => {
      try {
        if (handleExpressValidators(req, res)) {
          return null
        }

        const role = await Role.create(req.body);
        return res.status(201).json(role);
      } catch (error) {
        return res.status(500).json(error);
      }
    },
  ],
  show: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const role = await Role.findByPk(id, {
        include: [{ model: Permission, include: [Ressource] }],
      });

      const roleJSON = role?.toJSON();
      if (role) {
        roleJSON.ressources = groupPermissionsByRessources(role.permissions);
      }
      res.status(200).json(roleJSON);
    } catch (error) {
      res.status(500).json(error);
    }
  },

  addPermissions: [
    checkSchema(roleValidators.addPermissionSchema),
    async (req: Request, res: Response) => {
      try {
        if (handleExpressValidators(req, res)) {
          return null
        }

        const role = await Role.findByPk(req.params.id);
        if (!role) {
          return res.status(404).json({ msg: 'Le role n\'a pas été retrouvé' });
        }

        await role.$add('permissions', req.body.permissions);

        return res.status(201).json(role);
      } catch (error) {
        return res.status(500).json(error);
      }
    },
  ],

  updatePermissions: [
    checkSchema(roleValidators.updatePermissionSchema),
    async (req: Request, res: Response) => {
      try {
        if (handleExpressValidators(req, res)) {
          return null
        }

        const role = await Role.findByPk(req.params.id);
        if (!role) {
          return res.status(404).json({ msg: 'Le role n\'a pas été retrouvé' });
        }

        await role.$set('permissions', req.body.permissions);

        return res.status(201).json(role);
      } catch (error) {
        return res.status(500).json(error);
      }
    },
  ],

  update: [
    checkSchema(roleValidators.updateSchema),
    async (req: Request, res: Response) => {
      try {
        if (handleExpressValidators(req, res)) {
          return null
        }

        const { id } = req.params;
        await Role.update(
          req.body,
          {
            where: {
              id,
            },
            fields: Role.fillable,
          },
        );

        const newRole = await Role.findByPk(id);
        return res.status(200).json(newRole);
      } catch (error) {
        return res.status(500).json(error);
      }
    },
  ],

  delete: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const role = await Role.findByPk(id);

      if (role) {
        role.name = `${role.name}_DELETED_AT_${new Date().toISOString()}`;
        role.save();
        role.destroy();
      }
      res.status(204).json({});
    } catch (error) {
      res.status(500).json(error);
    }
  },
};
