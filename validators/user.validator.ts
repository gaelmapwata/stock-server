import { Request } from 'express';
import User from '../models/User';

const userValidators = {
  storeSchema: {
    email: {
      isEmail: {
        errorMessage: 'Le champ "Email" est invalide',
      },
      notEmpty: {
        errorMessage: 'Le champ "Email" est obligatoire',
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
  },

  updateSchema: {
    email: {
      isEmail: {
        errorMessage: 'Le champ "Email" est invalide',
      },
      notEmpty: {
        errorMessage: 'Le champ "Email" est obligatoire',
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
  },
};

export default userValidators;
