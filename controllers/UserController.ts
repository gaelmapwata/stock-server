import { Request, Response } from 'express';
import { checkSchema } from 'express-validator';
import User from '../models/User';
import userValidators from '../validators/user.validator';
import { bcryptHashPassword } from '../utils/bcrypt.util';
import { handleExpressValidators } from '../utils/express.util';

export default {
  index: async (req: Request, res: Response) => {
    try {
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 10;
      const offset = (page - 1) * limit;

      const limitQuery = limit === -1 ? {} : { limit };

      const usersAndCount = await User.findAndCountAll({
        ...limitQuery,
        offset,
        order: ['email'],
        attributes: { exclude: ['password'] },
      });

      const usersSize = usersAndCount.count;
      const totalPages = Math.ceil(usersSize / limit);

      return res.status(200).json({
        data: usersAndCount.rows,
        lastPage: totalPages,
        currentPage: page,
        limit,
        total: usersSize,
      });
    } catch (error) {
      return res.status(500).json(error);
    }
  },

  store: [
    checkSchema(userValidators.storeSchema),
    async (req: Request, res: Response) => {
      try {
        if (handleExpressValidators(req, res)) {
          return null;
        }

        const hashedPassword = await bcryptHashPassword(req.body.password);
        const user = await User.create({
          ...req.body,
          password: hashedPassword,
        }, {
          fields: User.fillable,
        });

        const { roles } = req.body;
        if (roles) {
          await user.$add('roles', roles);
        }

        return res.status(201).json(user);
      } catch (error) {
        return res.status(500).json(error);
      }
    },
  ],

  show: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const user = await User.findByPk(id, {
        attributes: { exclude: ['password'] },
      });
      return res.status(200).json(user);
    } catch (error) {
      return res.status(500).json(error);
    }
  },

  update: [
    checkSchema(userValidators.updateSchema),
    async (req: Request, res: Response) => {
      try {
        if (handleExpressValidators(req, res)) {
          return null;
        }

        const { id } = req.params;

        if (req.body.password) {
          req.body.password = await bcryptHashPassword(req.body.password);
        } else {
          delete req.body.password;
        }
        await User.update(
          req.body,
          {
            where: {
              id,
            },
            fields: User.fillable,
          },
        );

        const newUser = await User.findByPk(id);

        const { roles } = req.body;
        if (roles && newUser) {
          await newUser.$set('roles', roles);
        }

        return res.status(200).json(newUser);
      } catch (error) {
        return res.status(500).json(error);
      }
    },
  ],

  addRoles: [
    checkSchema(userValidators.addRolesSchema),
    async (req: Request, res: Response) => {
      try {
        if (handleExpressValidators(req, res)) {
          return null;
        }

        const user = await User.findByPk(req.params.id);
        if (!user) {
          return res.status(404).json({ msg: 'L\'utilisateur n\'a pas été retrouver' });
        }

        const { roles } = req.body;
        await user.$add('roles', roles);

        return res.status(201).json(user);
      } catch (error) {
        return res.status(500).json(error);
      }
    },
  ],

  delete: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const user = await User.destroy({
        where: { id },
      });
      return res.status(204).json(user);
    } catch (error) {
      return res.status(500).json(error);
    }
  },
};
