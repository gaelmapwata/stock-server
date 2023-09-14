// TODO: Should fix this "any" issue
/* eslint-disable @typescript-eslint/no-explicit-any */

import express, { Request, Response } from 'express';
import UserController from '../controllers/UserController';
import AuthController from '../controllers/AuthController';
import authJwt from '../middleware/authJwt';
import Permission from '../models/Permission';

const router = express.Router();

router.get('/', (_: Request, res: Response) => {
  res.send('HELLO WORD !!');
});

/**
 * auth routes
 */

router.post('/auth/signin', AuthController.signin as any);
router.get('/auth/user', [authJwt.shouldBeLogged], AuthController.getCurrentUser);

// ----------

/**
 * routes users
 */

router.get(
  '/users',
  [authJwt.shouldBeLogged, authJwt.shouldHavePermission(Permission.USER.READ)],
  UserController.index,
);
router.post(
  '/users',
  [authJwt.shouldBeLogged, authJwt.shouldHavePermission(Permission.USER.CREATE)],
  UserController.store as any,
);
router.get(
  '/users/:id',
  [
    authJwt.shouldBeLogged,
    authJwt.shouldHavePermissionOrParamIdBeLoggedUserId(Permission.USER.READ),
  ],
  UserController.show,
);
router.put(
  '/users/:id',
  [
    authJwt.shouldBeLogged,
    authJwt.shouldHavePermissionOrParamIdBeLoggedUserId(Permission.USER.UPDATE),
  ],
  UserController.update as any,
);
router.delete(
  '/users/:id',
  [authJwt.shouldBeLogged, authJwt.shouldHavePermission(Permission.USER.DELETE)],
  UserController.delete,
);

// ----------

router.get('/protected', [authJwt.shouldBeLogged], (_: Request, res: Response) => {
  res.send('You have access to protected content !! ');
});

export default router;
