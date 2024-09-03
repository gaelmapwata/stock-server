import Permission from '../models/Permission';
import Role from '../models/Role';
import ValidatorHelper from './helpers/ValidatorHelper';

const roleValidators = {
  storeSchema: {
    name: new ValidatorHelper('nom')
      .notEmpty()
      .notExistsInDB(Role, 'name')
      .get(),
  },
  updateSchema: {
    name: new ValidatorHelper('nom')
      .notEmpty()
      .notExistsInDBIfUpdated(Role, 'name')
      .get(),
  },
  addPermissionSchema: {
    permissions: new ValidatorHelper('permissions')
      .isArray()
      .get(),
    'permissions.*': new ValidatorHelper('permission')
      .isInt()
      .existsInDB(Permission, 'id')
      .get(),
  },
  updatePermissionSchema: {
    permissions: new ValidatorHelper('permissions')
      .isArray()
      .get(),
    'permissions.*': new ValidatorHelper('permission')
      .isInt()
      .existsInDB(Permission, 'id')
      .get(),
  },
};

export default roleValidators;
