import { Response, NextFunction } from 'express';
import { Request } from '../types/expressOverride';
import UserService from '../services/UserService';
import { TokenDecodedI, TokenTypeE } from '../types/Token';
import User from '../models/User';
import Role from '../models/Role';
import Permission from '../models/Permission';
import AuthService from '../services/AuthService';
import BlacklistTokenService from '../services/BlacklistTokenService';
import BlacklistToken from '../models/BlacklistToken';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const jwt = require('jsonwebtoken');

export default {
  shouldBeLogged: async (req: Request, res: Response, next: NextFunction) => {
    const tokenPrefix = AuthService.getLoggedTokenPrefix(req);
    if (tokenPrefix !== 'Bearer') {
      return res.sendStatus(401);
    }

    const token = AuthService.getLoggedToken(req);

    if (!token) {
      return res.status(403).json({
        message: 'Pas de Token fournis !',
      });
    }

    const isTokenBlacklisted = await BlacklistTokenService.isTokenBlacklisted(token);

    if (isTokenBlacklisted) {
      return res.status(409).json({
        message: 'Session expirée, veuillez vous reconnecter !',
      });
    }

    return jwt.verify(token, process.env.JWT_SECRET, (err: null, decoded: TokenDecodedI) => {
      if (err) {
        res.status(401).json({
          message: 'Veuillez vous connectez !',
        });
      }
      if (!decoded.type || decoded.type !== TokenTypeE.MAIN_TOKEN) {
        return res.status(409).json({
          msg: 'Invalid token',
        });
      }

      return User
        .findByPk(decoded.id, { include: [{ model: Role, include: [Permission] }] })
        .then((user) => {
          if (!user) {
            return res.status(401).json({
              msg: 'This account has not been found',
            });
          }

          req.userId = decoded.id;
          req.user = user;
          return next();
        });
    });
  },

  verifyPasswordToken: async (req: Request, res: Response, next: NextFunction) => {
    const { token } = req.body;

    if (!token) {
      return res.status(403).json({
        message: 'No tokens provided!',
      });
    }

    const blacklistToken = await BlacklistToken.findOne({
      where: {
        token,
        type: TokenTypeE.PASSWORD_TOKEN,
      },
    });

    if (blacklistToken) {
      return res.status(409).json({
        msg: 'Session expired please re-authenticate with your password',
      });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err: null, decoded: TokenDecodedI) => {
      if (err) {
        return res.status(401).json({
          msg: 'Session expired please re-authenticate with your password',
        });
      }

      if (!decoded.type || decoded.type !== TokenTypeE.PASSWORD_TOKEN) {
        return res.status(409).json({
          msg: 'Invalid token',
        });
      }

      User
        .findByPk(decoded.id)
        .then((user) => {
          if (user) {
            req.passwordAuthData = {
              userId: decoded.id,
              user,
            };
            next();
          } else {
            return res.status(401).json({
              msg: 'This account has not been found',
            });
          }
        });
    });
  },

  shouldParamIdBeLoggedUserId(req: Request, res: Response, next: NextFunction) {
    if (!req.userId || req.userId !== +req.params.id) {
      return res.status(403).json({
        message: 'Vous n\'êtes pas authorisé à effectuer cette action !',
      });
    }
    return next();
  },

  // eslint-disable-next-line max-len
  shouldHavePermission: (permission: string) => async (req: Request, res: Response, next: NextFunction) => {
    const passed = await UserService.userByIdHasPermission(req.userId as number, permission);
    if (passed) {
      return next();
    }
    return res.status(403).json({ message: "Vous n'avez pas les accès nécessaires" });
  },

  // eslint-disable-next-line max-len
  shouldHavePermissionOrParamIdBeLoggedUserId: (permission: string) => async (req: Request, res: Response, next: NextFunction) => {
    if (!req.userId || req.userId !== +req.params.id) {
      const passed = await UserService.userByIdHasPermission(req.userId as number, permission);
      if (passed) {
        return next();
      }
      return res.status(403).json({ message: "Vous n'avez pas les accès nécessaires" });
    }
    return next();
  },
};
