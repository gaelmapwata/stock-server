import { Request, Response } from 'express';
import { checkSchema } from 'express-validator';
import articleValidators from '../validators/article.validator';
import { handleExpressValidators } from '../utils/express.util';
import Article from '../models/Article';

export default {
  index: async (req: Request, res: Response) => {
    try {
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 10;
      const offset = (page - 1) * limit;

      const limitQuery = limit === -1 ? {} : { limit };

      const articlesAndCount = await Article.findAndCountAll({
        ...limitQuery,
        offset,
        order: ['label'],
      });

      const articlesSize = articlesAndCount.count;
      const totalPages = Math.ceil(articlesSize / limit);

      return res.status(200).json({
        data: articlesAndCount.rows,
        lastPage: totalPages,
        currentPage: page,
        limit,
        total: articlesSize,
      });
    } catch (error) {
      return res.status(500).json(error);
    }
  },
  store: [
    checkSchema(articleValidators.storeSchema),
    async (req: Request, res: Response) => {
      try {
        if (handleExpressValidators(req, res)) {
          return null;
        }

        const article = await Article.create({
          ...req.body,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          userId: (req as any).userId,
        });
        return res.status(201).json(article);
      } catch (error) {
        return res.status(500).json(error);
      }
    },
  ],
  show: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const article = await Article.findByPk(id);

      res.status(200).json(article);
    } catch (error) {
      res.status(500).json(error);
    }
  },
  update: [
    checkSchema(articleValidators.updateSchema),
    async (req: Request, res: Response) => {
      try {
        if (handleExpressValidators(req, res)) {
          return null;
        }

        const { id } = req.params;
        await Article.update(
          req.body,
          {
            where: {
              id,
            },
            fields: Article.fillable,
          },
        );

        const article = await Article.findByPk(id);
        return res.status(200).json(article);
      } catch (error) {
        return res.status(500).json(error);
      }
    },
  ],
  delete: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const article = await Article.findByPk(id);

      if (article) {
        article.label = `${article.label}_DELETED_AT_${new Date().toISOString()}`;
        article.save();
        article.destroy();
      }
      res.status(204).json({});
    } catch (error) {
      res.status(500).json(error);
    }
  },
};
