import * as dotenv from 'dotenv';
import * as path from 'path';
import {
  getOsEnv,
  getOsEnvOptional,
  normalizePort,
  toBool,
  toNumber
} from './interceptors';
/**
 * Load .env file or for tests the .env.test file.
 */
dotenv.config({
  path: path.join(
    process.cwd(),
    `.env${process.env.NODE_ENV === 'test' ? '.test' : ''}`,
  ),
});

/**
 * Environment variables
 */
export const env = {
  node: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV === 'development',

  app: {
    name: getOsEnv('APP_NAME'),
    host: getOsEnv('APP_HOST'),
    schema: getOsEnv('APP_SCHEMA'),
    routePrefix: getOsEnv('APP_ROUTE_PREFIX'),
    port: normalizePort(process.env.PORT || getOsEnv('APP_PORT')),
    banner: toBool(getOsEnv('APP_BANNER')),
  },

  db1: {
    type: getOsEnvOptional('TYPEORM_NAME1'),
    connector: getOsEnvOptional('TYPEORM_CONNECTORS1'),
    host: getOsEnvOptional('TYPEORM_HOST1'),
    // connectors: getOsEnvOptional('TYPEORM_CONNECTORS'),
    port: toNumber(getOsEnvOptional('TYPEORM_PORT1') || '3000'),
    username: getOsEnvOptional('TYPEORM_USERNAME1'),
    password: getOsEnvOptional('TYPEORM_PASSWORD1'),
    database: getOsEnv('TYPEORM_DATABASE1'),
    url: getOsEnvOptional('TYPEORM_URL1'),
    synchronize: toBool(getOsEnvOptional('TYPEORM_SYNCHRONIZE1') || 'false')
  },
  security: {
    tokenExpires: getOsEnv('TOKEN_EXPIRES_IN_VALUE'),
    jwtSecret: getOsEnv('TOKEN_SECRET_VALUE'),
  },
};
