import { Request } from 'express';
import User from '../models/User';

const userValidators = {
  storeSchema: {
    email: {
      notEmpty: {
        errorMessage: 'Le champ "Email" est obligatoire',
      },
      isEmail: {
        errorMessage: 'Le champ "Email" doit-être un email invalide',
      },
      custom: {
        options: async (value: string) => {
          const user = await User.findOne({ where: { email: value }, paranoid: false });
          if (user && !user.deletedAt) {
            throw new Error('Un utilisateur ayant cet email existe déjà');
          }
          if (user) {
            throw new Error('Cet email a déjà été utilisé par un utilisateur supprimé');
          }
        },
      },
    },
    password: {
      isString: {
        errorMessage: 'Le champ "password" doit être une chaîne de caractère valide',
      },
      notEmpty: {
        errorMessage: 'Le champ "password" est obligatoire',
      },
    },
  },

  updateSchema: {
    email: {
      optional: true,
      isEmail: {
        errorMessage: 'Le champ "Email" doit-être un email invalide',
      },
      custom: {
        options: async (value: string, { req }: { req: unknown }) => {
          const { id } = (req as Request).params;
          const user = await User.findByPk(id);
          if (user && user.email !== value) {
            const existUser = await User.findOne({ where: { email: value }, paranoid: false });
            if (existUser && !existUser.deletedAt) {
              throw new Error('Un utilisateur ayant cet email existe déjà');
            }
            if (existUser) {
              throw new Error('Cet email a déjà été utilisé par un utilisateur supprimé');
            }
          }
        },
      },
    },
    password: {
      optional: true,
      isString: {
        errorMessage: 'Le champ "password" doit être une chaîne de caractère valide',
      },
    },
    roles: {
      optional: true,
      isArray: {
        errorMessage: 'Le champ "roles" doit être un tableau',
      },
    },
    'roles.*': {
      isInt: true,
    },
  },

  addRolesSchema: {
    roles: {
      isArray: {
        errorMessage: 'Le champ "roles" doit être un tableau',
      },
    },
    'roles.*': {
      isInt: true,
    },
  },

};

export default userValidators;
