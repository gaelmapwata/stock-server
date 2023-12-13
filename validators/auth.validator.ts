const authValidators = {
  signinSchema: {
    email: {
      isEmail: {
        errorMessage: 'Le champ "email" est invalide',
      },
      notEmpty: {
        errorMessage: 'Le champ "email" est obligatoire',
      },
    },
    password: {
      notEmpty: {
        errorMessage: 'Le champ "password" est obligatoire',
      },
    },
  },
};

export default authValidators;
