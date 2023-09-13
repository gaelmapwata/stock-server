import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { checkSchema, validationResult } from 'express-validator';
import { USERS } from '../utils/user.utils';
import authValidators from '../validators/auth.validator';

const jwt = require('jsonwebtoken');

const TOKEN_EXPIRATION_TIME_IN_MS = 2592000; // 30 days

export default {
  signin: [
    checkSchema(authValidators.signinSchema),
    (req: Request, res: Response) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ msg: errors.array() });
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
      res.status(200).json({
        ...userToLogin,
        token,
      });
    },
  ],
  getCurrentUser: async (req: Request, res: Response) => {
    try {
      const loggedUser = USERS.find((user) => user.id === (req as any).userId);
      if (!loggedUser) {
        return res.status(401).send({ msg: "Ce compte n'a pas été retrouvé" });
      }

      return res.status(200).json(loggedUser);
    } catch (error) {
      return res.status(500).json(error);
    }
  },
};
