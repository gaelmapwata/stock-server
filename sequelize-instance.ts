// Init sequilize

import path from 'path';
import { Sequelize } from 'sequelize-typescript';
import { env as _env } from 'process';
import { development, test, production } from './config/config';

const env = _env.NODE_ENV || 'development';

let config;
switch (env) {
  case 'development':
    config = development;
    break;

  case 'test':
    config = test;
    break;

  default:
    config = production;
    break;
}

const {
  database, username, password, host, dialect,
} = config;

export default new Sequelize(
  database || '',
  username || '',
  password,
  {
    host,
    dialect,
    models: [path.join(__dirname, 'models')],
    logging: false,
  },
);
