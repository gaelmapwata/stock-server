import { Response } from 'express';
import { Op } from 'sequelize';
import { Request } from '../types/expressOverride';
import User from '../models/User';
import Role from '../models/Role';
import Department from '../models/Department';
import Branch from '../models/Branch';
import Permission from '../models/Permission';
import BlacklistToken from '../models/BlacklistToken';
import Otp from '../models/Otp';
import { TokenTypeE } from '../types/Token';
import LogHelper from '../utils/logHelper';
import errorHandlerService from '../services/ErrorHandlerService';
import OtpService from '../services/OtpService';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const jwt = require('jsonwebtoken');

const JWT_TIME_VALIDITY = 60 * 5; // 5min
const JWT_PASSWORD_TOKEN_TIME_VALIDITY = 5 * 60;
const MAX_LOGIN_ATTEMPT = 3;

async function onLoginFailed(user:User) {
  // eslint-disable-next-line no-param-reassign
  user.totalLoginAttempt += 1;
  await user.save();

  if (user.totalLoginAttempt === MAX_LOGIN_ATTEMPT) {
    // eslint-disable-next-line no-param-reassign
    user.locked = true;
    await user.save();
  }
}

async function onLoginSuccess(user:User) {
  // eslint-disable-next-line no-param-reassign
  user.totalLoginAttempt = 0;
  await user.save();
}

export default {
  signin: async (req: Request, res: Response) => {
    try {
      const user = await User.findOne({
        include: [{ model: Department, include: [Branch] }],
        where: {
          email: req.body.email,
        },
      });

      if (!user) {
        return res.status(401).send({ msg: 'This account has not been found, please contact the administrator' });
      }

      if (user.locked) {
        return res.status(401).send({ msg: 'This account has been blocked, please contact the administrator' });
      }

      if (!user.department) {
        return res.status(401).send({ msg: 'This account is not linked to a department, please contact the administrator' });
      }

      if (!user.department.branch) {
        return res.status(401).send({ msg: 'Cannot retrieve department that is linked to the branch of this account, please contact the administrator' });
      }

      LogHelper.info(`Auth | user ${req.body.email} trying to login`);

      // const clearPassword = CryptoUtil.decrypt(req.body.password);
      // const canLogged = await activeDirectoryService.login(req.body.email, clearPassword);
      const canLogged = true;

      if (!canLogged) {
        await onLoginFailed(user);
        return res.status(401).send({
          msg: `Invalid Email or Password. Remaining attempts (${MAX_LOGIN_ATTEMPT - user.totalLoginAttempt})`,
        });
      }

      // Destroy expired OTP
      Otp.destroy({
        where: {
          email: req.body.email,
          expirationDate: {
            [Op.lt]: new Date(),
          },
        },
      });

      // create new OTP
      const { otp: userOTP } = await OtpService.createOtpForUser(req.body.email);

      // utilHelper.sendEmailNotification(
      //   req.body.email,
      //   req.body.email,
      //   UBA_MAIL_CONFIGS.EMAIL_SENDER.trim(),
      //   UBA_MAIL_CONFIGS.OTP_EMAIL_SUBJECT,
      //   UBA_MAIL_CONFIGS.OTP_EMAIL_MESSAGE.replace(/:otp/gi, userOTP),
      // );

      console.log(userOTP);

      LogHelper.info(`Auth | user ${req.body.email} successful logged with active directory, otp sended`);

      const token = jwt.sign(
        {
          id: user.id,
          type: TokenTypeE.PASSWORD_TOKEN,
        },
        process.env.JWT_SECRET,
        { expiresIn: JWT_PASSWORD_TOKEN_TIME_VALIDITY },
      );

      onLoginSuccess(user);
      return res.status(200).json({ msg: 'successful authentication', token });
    } catch (error) {
      return errorHandlerService.handleResponseError(res, error as Error);
    }
  },
  checkOtp: async (req: Request, res: Response) => {
    try {
      const user = req.passwordAuthData?.user as User;
      const otp = await OtpService.checkOtpFromUser(user.email, req.body.otp);

      // const otp = await EntrustService.sendEntrustToken(user.email, req.body.otp);

      if (!otp) {
        return res.status(401).send({ msg: 'Otp not recognized or expired' });
      }

      const token = jwt.sign({
        id: user.id,
        type: TokenTypeE.MAIN_TOKEN,
      }, process.env.JWT_SECRET, {
        expiresIn: JWT_TIME_VALIDITY,
      });

      otp.destroy();

      LogHelper.info(`Auth | user ${user.email} successful logged with otp verification`);

      await BlacklistToken.create({ token: req.body.token, type: TokenTypeE.PASSWORD_TOKEN });

      return res.status(200).json({
        token,
      });
    } catch (error) {
      return res.status(500).json(error);
    }
  },

  getCurrentUser: async (req: Request, res: Response) => {
    try {
      const loggedUser = await User.findByPk(req.userId as number, {
        include: [{ model: Role, include: [Permission] }],
      });
      if (!loggedUser) {
        return res.status(401).send({ msg: "Ce compte n'a pas été retrouvé" });
      }

      return res.status(200).json(loggedUser);
    } catch (error) {
      return res.status(500).json(error);
    }
  },

  logout: async (req: Request, res: Response) => {
    try {
      const authHeader = req.headers.authorization;
      const bearer = authHeader && authHeader.split(' ')[0];
      if (bearer !== 'Bearer') {
        return res.sendStatus(401);
      }
      const token = authHeader && authHeader.split(' ')[1];
      const blacklistToken = await BlacklistToken.create({ token, type: TokenTypeE.MAIN_TOKEN });
      res.status(201).json(blacklistToken);
    } catch (error) {
      res.status(500).json(error);
    }
  },
};
