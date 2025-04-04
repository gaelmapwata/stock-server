import { Request, Response } from 'express';
import { checkSchema } from 'express-validator';
import {
  literal, Op, Sequelize, WhereOptions,
} from 'sequelize';
import sequelize from '../sequelize-instance';
import requestValidators from '../validators/request.validator';
import { handleExpressValidators } from '../utils/express.util';
import Requested from '../models/Request';
import User from '../models/User';
import Permission from '../models/Permission';
import Article from '../models/Article';
import UserService from '../services/UserService';
import LogHelper, { userLogIdentifier } from '../utils/logHelper';
import Department from '../models/Department';
import {
  // eslint-disable-next-line max-len
  firstDayOfWeekDate, getTodayDate, getYesterdayDate, lastDayOfWeekDate, getFirstDayOfMonth, getLastDayOfMonth,
} from '../utils/date.util';

async function generateFilterAttributes(req: Request):Promise<any> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const filterAttributes: any = {};

  const userCanSeeAllRequestDepartmentLevel = await UserService
    // eslint-disable-next-line max-len, @typescript-eslint/no-explicit-any
    .userHasOneOfPermissions((req as any).user as User, Permission.REQUEST.READ_REQUEST_TO_VALIDATE_AT_DEPARTMENT_LEVEL);

  if (userCanSeeAllRequestDepartmentLevel) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    filterAttributes['$Department.branchId$'] = (req as any).user?.department.branchId;
  } else {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    filterAttributes.departmentId = (req as any).user?.departmentId;
  }

  const userCanSeeAllRequests = await UserService
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .userHasOneOfPermissions((req as any).user as User, Permission.REQUEST.READ);

  if (!userCanSeeAllRequests) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    filterAttributes.userId = (req as any).userId;
  }

  if (req.query.articleId) {
    filterAttributes.articleId = {
      [Op.like]: `%${req.query.articleId}%`,
    };
  }

  if (['1', 'true'].includes(req.query.success as string)) {
    filterAttributes.success = true;
  }
  if (req.query.startDate || req.query.endDate) {
    filterAttributes[Op.and] = [
      req.query.startDate
        ? sequelize.where(
          sequelize.fn('DATE', sequelize.col('Request.createdAt')),
          { [Op.gte]: req.query.startDate },
        ) : null,
      req.query.endDate
        ? sequelize.where(
          sequelize.fn('DATE', sequelize.col('Request.createdAt')),
          { [Op.lte]: req.query.endDate },
        ) : null,
    ];
  }
  return filterAttributes;
}

export default {
  index: async (req: Request, res: Response) => {
    try {
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 10;
      const offset = (page - 1) * limit;

      const limitQuery = limit === -1 ? {} : { limit };
      const whereFilter = await generateFilterAttributes(req);

      const requestsAndCount = await Requested.findAndCountAll({
        include: [
          Article,
          Department,
          { model: User, as: 'requester' },
          { model: User, as: 'approver' },
        ],
        where: whereFilter,
        ...limitQuery,
        offset,
        order: [
          ['createdAt', 'DESC'],
        ],
      });

      const requestsSize = requestsAndCount.count;
      const totalPages = Math.ceil(requestsSize / limit);

      return res.status(200).json({
        data: requestsAndCount.rows,
        lastPage: totalPages,
        currentPage: page,
        limit,
        total: requestsSize,
      });
    } catch (error) {
      return res.status(500).json(error);
    }
  },
  getRequestsToValidate: async (req: Request, res: Response) => {
    try {
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 10;
      const offset = (page - 1) * limit;

      const limitQuery = limit === -1 ? {} : { limit };
      const whereFilter = await generateFilterAttributes(req);

      const requestsAndCount = await Requested.findAndCountAll({
        include: [
          Article,
          { model: User, as: 'requester' },
          { model: User, as: 'approver' },
        ],
        where: {
          ...whereFilter,
          userApproved: null,
        },
        ...limitQuery,
        offset,
        order: [
          ['createdAt', 'DESC'],
        ],
      });

      const requestsSize = requestsAndCount.count;
      const totalPages = Math.ceil(requestsSize / limit);

      return res.status(200).json({
        data: requestsAndCount.rows,
        lastPage: totalPages,
        currentPage: page,
        limit,
        total: requestsSize,
      });
    } catch (error) {
      return res.status(500).json(error);
    }
  },
  getRequestsValidated: async (req: Request, res: Response) => {
    try {
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 10;
      const offset = (page - 1) * limit;

      const limitQuery = limit === -1 ? {} : { limit };
      const whereFilter = await generateFilterAttributes(req);

      const requestsAndCount = await Requested.findAndCountAll({
        include: [
          Article,
          Department,
          { model: User, as: 'requester' },
          { model: User, as: 'approver' },
        ],
        where: {
          ...whereFilter,
          userApproved: { [Op.ne]: null },
        },
        ...limitQuery,
        offset,
        order: [
          ['createdAt', 'DESC'],
        ],
      });

      const requestsSize = requestsAndCount.count;
      const totalPages = Math.ceil(requestsSize / limit);

      return res.status(200).json({
        data: requestsAndCount.rows,
        lastPage: totalPages,
        currentPage: page,
        limit,
        total: requestsSize,
      });
    } catch (error) {
      return res.status(500).json(error);
    }
  },
  store: [
    checkSchema(requestValidators.storeSchema),
    async (req: Request, res: Response) => {
      try {
        if (handleExpressValidators(req, res)) {
          return null;
        }

        const request = await Requested.create({
          ...req.body,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          userRequest: (req as any).userId,
          departmentId: req.user?.departmentId,
        });
        return res.status(201).json(request);
      } catch (error) {
        return res.status(500).json(error);
      }
    },
  ],
  show: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const request = await Requested.findByPk(id);

      res.status(200).json(request);
    } catch (error) {
      res.status(500).json(error);
    }
  },
  update: [
    checkSchema(requestValidators.updateSchema),
    async (req: Request, res: Response) => {
      try {
        if (handleExpressValidators(req, res)) {
          return null;
        }

        const { id } = req.params;
        await Requested.update(
          req.body,
          {
            where: {
              id,
            },
            fields: Requested.fillable,
          },
        );

        const request = await Requested.findByPk(id);
        return res.status(200).json(request);
      } catch (error) {
        return res.status(500).json(error);
      }
    },
  ],

  updateReceivedQuantity: async (req:Request, res:Response) => {
    try {
      LogHelper.info(`Request | user (${userLogIdentifier(req)}) initiate update of quantity received`);
      const { id } = req.params;
      await Requested.update(
        req.body,
        {
          where: {
            id,
          },
          fields: Requested.fillable,
        },
      );
      await Article.update(
        {
          stockQuantity: literal(`stockQuantity - ${req.body.receivedQuantity}`),
        },
        {
          where: { id: req.body.articleId },
        },
      );
      const request = await Requested.findByPk(id);
      return res.status(200).json(request);
    } catch (error) {
      LogHelper.info(`Request | error occurred when update  quantity received  generated by user (${userLogIdentifier(req)}), error:(${error})`);
      return res.status(500).json(error);
    }
  },

  validateRequest: async (req: Request, res: Response) => {
    const request = await Requested.findByPk(req.params.id);
    if (!request) {
      return res.status(404).json({ message: 'request not found' });
    }

    if (request.userApproved) {
      return res.status(503).json({ message: 'this request has already been validated' });
    }

    try {
      LogHelper.info(`Request | user (${userLogIdentifier(req)}) initiate validation of a request, requestId: ${request.id}`);
      request.userApproved = (req as any).userId;

      if (request.userRequest && request.userRequest === request.userApproved) {
        LogHelper.info(`Request | error occurred when validating  request (${request.id}) the validator must be different of request`);
        return res.status(503).json({ message: 'the validator must be different of request' });
      }

      request.success = true;
      request.save();
      LogHelper.info(`Request | request (${request.id}) validated by user (${userLogIdentifier(req)})successfully`);
      return res.status(200).json(request);
    } catch (error) {
      LogHelper.info(`Request | error occurred when validating  request (${request.id}) generated by user (${userLogIdentifier(req)}), error:(${error})`);
      res.status(500).json(error);
    }
  },
  cancelRequest: async (req: Request, res: Response) => {
    const request = await Requested.findByPk(req.params.id);
    if (!request) {
      return res.status(404).json({ message: 'request not found' });
    }

    if (request.userApproved) {
      return res.status(503).json({ message: 'this request has already been validated' });
    }
    try {
      LogHelper.info(`Request | user (${userLogIdentifier(req)}) cancel a request, requestId: ${request.id}`);
      request.userApproved = (req as any).userId;

      if (request.userRequest && request.userRequest === request.userApproved) {
        LogHelper.info(`Request | error occurred when canceling  request (${request.id}) the validator must be different of request`);
        return res.status(503).json({ message: 'the validator must be different of request' });
      }

      request.success = false;
      request.error = 'la demande a été rejeté par le validateur';
      request.save();
      LogHelper.info(`Request | request (${request.id}) validated by user (${userLogIdentifier(req)})successfully`);
      return res.status(200).json(request);
    } catch (error) {
      LogHelper.info(`Request | error occurred when validating  request (${request.id}) generated by user (${userLogIdentifier(req)}), error:(${error})`);
      res.status(500).json(error);
    }
  },
  delete: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const request = await Requested.findByPk(id);
      if (request) {
        request.destroy();
      }

      res.status(204).json({});
    } catch (error) {
      res.status(500).json(error);
    }
  },
  getStats: async (req: Request, res: Response) => {
    const todayDate = getTodayDate();
    const yesterday = getYesterdayDate();
    const firstDayWeek = firstDayOfWeekDate();
    const lastDayWeek = lastDayOfWeekDate();
    const firstDayMonth = getFirstDayOfMonth();
    const lastDayMonth = getLastDayOfMonth();

    const userCanSeeAllRequests = await UserService
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .userHasOneOfPermissions((req as any).user as User, Permission.REQUEST.READ);

    const whereFilter: WhereOptions = {};

    if (!userCanSeeAllRequests) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      whereFilter.userId = (req as any).userId;
    }

    const nbToday = await Requested.count({
      include: [{ model: Department, attributes: ['id', 'branchId'] }],
      where: {
        ...whereFilter,
        success: true,
        [Op.and]: Sequelize.where(
          Sequelize.fn('DATE', Sequelize.col('Request.createdAt')),
          todayDate,
        ),
      },
    });

    const nbYesterday = await Requested.count({
      include: [{ model: Department, attributes: ['id', 'branchId'] }],
      where: {
        ...whereFilter,
        success: true,
        [Op.and]: Sequelize.where(
          Sequelize.fn('DATE', Sequelize.col('Request.createdAt')),
          yesterday,
        ),
      },
    });

    const nbWeek = await Requested.count({
      include: [{ model: Department, attributes: ['id', 'branchId'] }],
      where: {
        ...whereFilter,
        success: true,
        [Op.and]: [
          Sequelize.where(
            Sequelize.fn('DATE', Sequelize.col('Request.createdAt')),
            { [Op.gte]: firstDayWeek },
          ),
          Sequelize.where(
            Sequelize.fn('DATE', Sequelize.col('Request.createdAt')),
            { [Op.lte]: lastDayWeek },
          ),
        ],
      },
    });

    const nbMonth = await Requested.count({
      include: [{ model: Department, attributes: ['id', 'branchId'] }],
      where: {
        ...whereFilter,
        success: true,
        [Op.and]: [
          Sequelize.where(
            Sequelize.fn('DATE', Sequelize.col('Request.createdAt')),
            { [Op.gte]: firstDayMonth },
          ),
          Sequelize.where(
            Sequelize.fn('DATE', Sequelize.col('Request.createdAt')),
            { [Op.lte]: lastDayMonth },
          ),
        ],
      },
    });

    res.status(200).json({
      today: nbToday,
      yesterday: nbYesterday,
      currentWeek: nbWeek,
      currentMonth: nbMonth,
    });
  },

};
