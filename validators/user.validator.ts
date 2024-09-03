import Role from '../models/Role';
import User from '../models/User';
import ValidatorHelper from './helpers/ValidatorHelper';

const userValidators = {
  storeSchema: {
    email: new ValidatorHelper('email')
      .notEmpty()
      .isEmail()
      .notExistsInDB(User, 'email')
      .get(),
    password: new ValidatorHelper('mot de passe').notEmpty().isString().get(),
    roles: new ValidatorHelper('roles').optional().isArray().get(),
    'roles.*': new ValidatorHelper('role').isInt().existsInDB(Role, 'id').get(),
  },

  updateSchema: {
    email: new ValidatorHelper('email')
      .optional()
      .isEmail()
      .notExistsInDBIfUpdated(User, 'email')
      .get(),
    password: new ValidatorHelper('mot de passe').optional().isString().get(),
    roles: new ValidatorHelper('roles').optional().isArray().get(),
    'roles.*': new ValidatorHelper('role').isInt().existsInDB(Role, 'id').get(),
  },

  addRolesSchema: {
    roles: new ValidatorHelper('roles').optional().isArray().get(),
    'roles.*': new ValidatorHelper('role').isInt().existsInDB(Role, 'id').get(),
  },

};

export default userValidators;
