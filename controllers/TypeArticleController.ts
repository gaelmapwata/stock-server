import { Request, Response } from 'express';
import { checkSchema } from 'express-validator';
import typeArticleValidators from '../validators/typeArticle.validator';
import { handleExpressValidators } from '../utils/express.util';
import TypeArticle from '../models/TypeArticle';

export default {
  index: async (req: Request, res: Response) => {
    try {
      const typeArticles = await TypeArticle.findAll();

      res.status(200).json(typeArticles);
    } catch (error) {
      res.status(500).json(error);
    }
  },

  store: [
    checkSchema(typeArticleValidators.storeSchema),
    async (req: Request, res: Response) => {
      try {
        if (handleExpressValidators(req, res)) {
          return null;
        }

        const role = await TypeArticle.create(req.body);
        return res.status(201).json(role);
      } catch (error) {
        return res.status(500).json(error);
      }
    },
  ],
  show: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const typeArticle = await TypeArticle.findByPk(id);

      res.status(200).json(typeArticle);
    } catch (error) {
      res.status(500).json(error);
    }
  },
  update: [
    checkSchema(typeArticleValidators.updateSchema),
    async (req: Request, res: Response) => {
      try {
        if (handleExpressValidators(req, res)) {
          return null;
        }

        const { id } = req.params;
        await TypeArticle.update(
          req.body,
          {
            where: {
              id,
            },
            fields: TypeArticle.fillable,
          },
        );

        const typeArticle = await TypeArticle.findByPk(id);
        return res.status(200).json(typeArticle);
      } catch (error) {
        return res.status(500).json(error);
      }
    },
  ],
  delete: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const typeArticle = await TypeArticle.findByPk(id);

      if (typeArticle) {
        typeArticle.label = `${typeArticle.label}_DELETED_AT_${new Date().toISOString()}`;
        typeArticle.save();
        typeArticle.destroy();
      }
      res.status(204).json({});
    } catch (error) {
      res.status(500).json(error);
    }
  },
};
