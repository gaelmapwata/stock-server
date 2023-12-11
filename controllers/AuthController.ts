import { Response } from 'express';
import bcrypt from 'bcryptjs';
import { checkSchema } from 'express-validator';
import { USERS } from '../utils/user.util';
import authValidators from '../validators/auth.validator';
import { Request } from '../types/expressOverride';
import { handleExpressValidators } from '../utils/express.util';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const jwt = require('jsonwebtoken');

const TOKEN_EXPIRATION_TIME_IN_MS = 2592000; // 30 days

export default {
  signin: [
    checkSchema(authValidators.signinSchema),
    (req: Request, res: Response) => {
      if (handleExpressValidators(req, res)) {
        return null
      }

      const userToLogin = USERS.find((user) => user.email === req.body.email);

      if (!userToLogin) {
        return res.status(401).send({ message: "Ce compte n'a pas été retrouvé" });
      }

      const passwordIsValid = bcrypt.compareSync(
        req.body.password,
        userToLogin.password,
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          token: null,
          message: 'Mot de passe invalide',
        });
      }

      const token = jwt.sign({ id: userToLogin.id }, process.env.JWT_SECRET, {
        expiresIn: TOKEN_EXPIRATION_TIME_IN_MS,
      });
      return res.status(200).json({
        ...userToLogin,
        token,
      });
    },
  ],
  getCurrentUser: async (req: Request, res: Response) => {
    try {
      const loggedUser = USERS.find((user) => user.id === req.userId);
      if (!loggedUser) {
        return res.status(401).send({ msg: "Ce compte n'a pas été retrouvé" });
      }

      return res.status(200).json(loggedUser);
    } catch (error) {
      return res.status(500).json(error);
    }
  },
};
