import ValidatorHelper from './helpers/ValidatorHelper';

const requestValidators = {
  storeSchema: {
    requestQuantity: new ValidatorHelper('Quantité demander')
      .notEmpty()
      .isInt()
      .get(),
    articleId: new ValidatorHelper('Id Article')
      .notEmpty()
      .isInt()
      .get(),
  },
  updateSchema: {
    requestQuantity: new ValidatorHelper('Quantité demander')
      .notEmpty()
      .isInt()
      .get(),
    articleId: new ValidatorHelper('Id Article')
      .notEmpty()
      .isInt()
      .get(),
  },
};

export default requestValidators;
