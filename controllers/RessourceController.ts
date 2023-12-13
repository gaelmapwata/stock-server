import { Request, Response } from 'express';
import Permission from '../models/Permission';
import Ressource from '../models/Ressource';

// eslint-disable-next-line @typescript-eslint/no-var-requires
export default {
  index: async (req: Request, res: Response) => {
    try {
      const ressources = await Ressource.findAll({
        include: [Permission],
      });

      res.status(200).json(ressources);
    } catch (error) {
      res.status(500).json(error);
    }
  },
};
