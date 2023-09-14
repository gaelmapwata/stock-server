import express, { Request, Response } from 'express';
import UserController from '../controllers/UserController';

const router = express.Router();

router.get('/', (_: Request, res: Response) => {
  res.send('HELLO WORD !!');
});

/**
 * routes users
 */

router.get('/users', UserController.index);

// TODO: Should fix this any issue
// eslint-disable-next-line @typescript-eslint/no-explicit-any
router.post('/users', UserController.store as any);
router.get('/users/:id', UserController.show);

// TODO: Should fix this any issue
// eslint-disable-next-line @typescript-eslint/no-explicit-any
router.put('/users/:id', UserController.update as any);
router.delete('/users/:id', UserController.delete);

export default router;
