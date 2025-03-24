import ValidatorHelper from './helpers/ValidatorHelper';

const typeArticleValidators = {
  storeSchema: {
    label: new ValidatorHelper('label')
      .notEmpty()
      .get(),
  },
  updateSchema: {
    label: new ValidatorHelper('label')
      .notEmpty()
      .get(),
  },
};

export default typeArticleValidators;
