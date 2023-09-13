import { Request, Response, NextFunction } from 'express';

const jwt = require('jsonwebtoken');

export default {
  verifyToken: (req: Request, res: Response, next: NextFunction) => {
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

    return jwt.verify(token, process.env.JWT_SECRET, (err: null, decoded: any) => {
      if (err) {
        res.status(401).json({
          message: 'Veuillez vous connectez !',
        });
      }
      (req as any).userId = decoded.id;
      next();
    });
  },
};
