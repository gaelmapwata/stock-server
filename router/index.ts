// TODO: Should fix this "any" issue
/* eslint-disable @typescript-eslint/no-explicit-any */

import express, { Request, Response } from 'express';
import UserController from '../controllers/UserController';
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

/**
 * routes users
 */

router.get('/users', UserController.index);
router.post('/users', UserController.store as any);
router.get('/users/:id', UserController.show);
router.put('/users/:id', [authJwt.verifyToken, authJwt.paramIdIsLoggedUserId], UserController.update as any);
router.delete('/users/:id', UserController.delete);

// ----------

router.get('/protected', [authJwt.verifyToken], (_: Request, res: Response) => {
  res.send('You have access to protected content !! ');
});

export default router;
