// TODO: Should fix this "any" issue
/* eslint-disable @typescript-eslint/no-explicit-any */

import express, { Request, Response } from 'express';
import UserController from '../controllers/UserController';
import AuthController from '../controllers/AuthController';
import authJwt from '../middleware/authJwt';
import Permission from '../models/Permission';
import RessourceController from '../controllers/RessourceController';
import RoleController from '../controllers/RoleController';
import TypeArticleController from '../controllers/TypeArticleController';
import rateLimiting from '../middleware/rateLimiting';

const router = express.Router();

router.get('/', (_: Request, res: Response) => {
  res.send('HELLO WORD !!');
});

/**
 * auth routes
 */

router.post('/auth/signin', [rateLimiting.rateLimitMiddleware], AuthController.signin as any);
router.get('/auth/user', [authJwt.shouldBeLogged], AuthController.getCurrentUser);
router.post('/auth/logout', [authJwt.shouldBeLogged], AuthController.logout);

// ----------

/**
 * users routes
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

/**
 * roles routes
 */

router.get(
  '/roles',
  [authJwt.shouldBeLogged, authJwt.shouldHavePermission(Permission.ROLE.READ)],
  RoleController.index,
);
router.post(
  '/roles',
  [authJwt.shouldBeLogged, authJwt.shouldHavePermission(Permission.ROLE.CREATE)],
  RoleController.store as any,
);
router.post(
  '/roles/:id/add-permissions',
  [authJwt.shouldBeLogged, authJwt.shouldHavePermission(Permission.ROLE.UPDATE)],
  RoleController.addPermissions as any,
);
router.post(
  '/roles/:id/update-permissions',
  [authJwt.shouldBeLogged, authJwt.shouldHavePermission(Permission.ROLE.UPDATE)],
  RoleController.updatePermissions as any,
);
router.get(
  '/roles/:id',
  [authJwt.shouldBeLogged, authJwt.shouldHavePermission(Permission.ROLE.READ)],
  RoleController.show,
);
router.put(
  '/roles/:id',
  [authJwt.shouldBeLogged, authJwt.shouldHavePermission(Permission.ROLE.UPDATE)],
  RoleController.update as any,
);
router.delete(
  '/roles/:id',
  [authJwt.shouldBeLogged, authJwt.shouldHavePermission(Permission.ROLE.DELETE)],
  RoleController.delete,
);

// ----------

/**
 * ressources routes
 */

router.get(
  '/ressources',
  [authJwt.shouldBeLogged, authJwt.shouldHavePermission(Permission.RESSOURCE.READ)],
  RessourceController.index as any,
);

//-----------
/**
 * typeArticle routes
 */

router.get(
  '/type-articles',
  [authJwt.shouldBeLogged, authJwt.shouldHavePermission(Permission.ROLE.READ)],
  TypeArticleController.index,
);
router.post(
  '/type-articles',
  [authJwt.shouldBeLogged, authJwt.shouldHavePermission(Permission.ROLE.CREATE)],
  TypeArticleController.store as any,
);

router.get(
  '/type-articles/:id',
  [authJwt.shouldBeLogged, authJwt.shouldHavePermission(Permission.ROLE.READ)],
  TypeArticleController.show,
);
router.put(
  '/type-articles/:id',
  [authJwt.shouldBeLogged, authJwt.shouldHavePermission(Permission.ROLE.UPDATE)],
  TypeArticleController.update as any,
);
router.delete(
  '/type-articles/:id',
  [authJwt.shouldBeLogged, authJwt.shouldHavePermission(Permission.ROLE.DELETE)],
  TypeArticleController.delete,
);

// ----------

router.get('/protected', [authJwt.shouldBeLogged], (_: Request, res: Response) => {
  res.send('You have access to protected content !! ');
});

export default router;
