import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';
import {env} from '../env';

const config = {
  name: env.db1.type,
  connector: env.db1.connector,
  url: env.db1.url,
  host: env.db1.host,
  port: env.db1.port,
  user: env.db1.username,
  password: env.db1.password,
  database: env.db1.database,
  synchronize: env.db1.synchronize,
  options: {
    cryptoCredentialsDetails: {
      minVersion: 'TLSv1',
    },
  },
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class CfsmssqldbDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'cfsmssqldb';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.cfsmssqldb', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
