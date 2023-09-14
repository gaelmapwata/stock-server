import { Response } from 'express';
import AppError from '../types/AppError';

export default {
  handleResponseError(res: Response, err: Error): void {
    if (err instanceof AppError) {
      res.status(err.statusCode).json({ msg: err.message });
    } else {
      res.status(500).json(err);
    }
  },
};
