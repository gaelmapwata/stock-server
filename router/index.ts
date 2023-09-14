// TODO: Should fix this "any" issue
/* eslint-disable @typescript-eslint/no-explicit-any */

import express, { Request, Response } from 'express';
import AuthController from '../controllers/AuthController';
import authJwt from '../middleware/authJwt';

const router = express.Router();

router.get('/', (_: Request, res: Response) => {
  res.send('HELLO WORD !!');
});

/**
 * auth routes
 */

router.post('/auth/signin', AuthController.signin as any);
router.get('/auth/user', [authJwt.verifyToken], AuthController.getCurrentUser);

// ----------

router.get('/protected', [authJwt.verifyToken], (_: Request, res: Response) => {
  res.send('You have access to protected content !! ');
});

export default router;
