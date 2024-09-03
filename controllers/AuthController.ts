import { Response } from 'express';
import bcrypt from 'bcryptjs';
import { checkSchema } from 'express-validator';
import authValidators from '../validators/auth.validator';
import { Request } from '../types/expressOverride';
import { handleExpressValidators } from '../utils/express.util';
import User from '../models/User';
import Role from '../models/Role';
import Permission from '../models/Permission';
import BlacklistToken from '../models/BlacklistToken';
import { TokenTypeE } from '../types/Token';
import AuthService from '../services/AuthService';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const jwt = require('jsonwebtoken');

const TOKEN_EXPIRATION_TIME_IN_SECONDS = 24 * 60 * 60; // 1 day

export default {
  signin: [
    checkSchema(authValidators.signinSchema),
    async (req: Request, res: Response) => {
      if (handleExpressValidators(req, res)) {
        return null;
      }

      const userToLogin = await User.findOne(
        { where: { email: req.body.email } },
      );

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

      const token = jwt.sign({
        id: userToLogin.id,
        type: TokenTypeE.LOGGED_TOKEN,
      }, process.env.JWT_SECRET, {
        expiresIn: TOKEN_EXPIRATION_TIME_IN_SECONDS,
      });
      return res.status(200).json({
        user: userToLogin,
        token,
      });
    },
  ],
  getCurrentUser: async (req: Request, res: Response) => {
    try {
      const loggedUser = await User.findByPk(req.userId as number, {
        include: [{ model: Role, include: [Permission] }],
      });
      if (!loggedUser) {
        return res.status(401).send({ msg: "Ce compte n'a pas été retrouvé" });
      }

      return res.status(200).json(loggedUser);
    } catch (error) {
      return res.status(500).json(error);
    }
  },

  logout: async (req: Request, res: Response) => {
    try {
      const token = AuthService.getLoggedToken(req);
      const blacklistToken = await BlacklistToken.create({ token, type: TokenTypeE.LOGGED_TOKEN });
      return res.status(201).json(blacklistToken);
    } catch (error) {
      return res.status(500).json(error);
    }
  },
};
