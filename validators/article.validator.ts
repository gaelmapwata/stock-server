import ValidatorHelper from './helpers/ValidatorHelper';

const articleValidators = {
  storeSchema: {
    label: new ValidatorHelper('label')
      .notEmpty()
      .isString()
      .get(),
    description: new ValidatorHelper('description')
      .notEmpty()
      .isString()
      .get(),
    stockQuantity: new ValidatorHelper('quantité en stock')
      .notEmpty()
      .isInt()
      .get(),
  },
  updateSchema: {
    label: new ValidatorHelper('label')
      .notEmpty()
      .isString()
      .get(),
    description: new ValidatorHelper('description')
      .notEmpty()
      .isString()
      .get(),
    stockQuantity: new ValidatorHelper('quantité en stock')
      .notEmpty()
      .isInt()
      .get(),
  },
};

export default articleValidators;
