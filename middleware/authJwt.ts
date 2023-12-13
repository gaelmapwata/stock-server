import { Response, NextFunction } from 'express';
import { Request } from '../types/expressOverride';
import UserService from '../services/UserService';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const jwt = require('jsonwebtoken');

export default {
  shouldBeLogged: (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    const bearer = authHeader && authHeader.split(' ')[0];

    if (bearer !== 'Bearer') {
      return res.sendStatus(401);
    }

    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(403).json({
        message: 'Pas de Token fournis !',
      });
    }

    return jwt.verify(token, process.env.JWT_SECRET, (err: null, decoded: { id: number }) => {
      if (err) {
        res.status(401).json({
          message: 'Veuillez vous connectez !',
        });
      }
      req.userId = decoded.id;
      next();
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
