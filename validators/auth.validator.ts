import ValidatorHelper from './helpers/ValidatorHelper';

const authValidators = {
  signinSchema: {
    email: new ValidatorHelper('email')
      .notEmpty()
      .isEmail()
      .get(),
    password: new ValidatorHelper('mot de passe')
      .notEmpty()
      .get(),
  },
};

export default authValidators;
