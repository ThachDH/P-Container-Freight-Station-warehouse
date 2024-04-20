import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {CfsmssqldbDataSource} from '../datasources';
import {CONFIG_MIN_VALUE, ConfigMinValueRelations} from '../models';

export class CONFIG_MIN_VALUERepository extends DefaultCrudRepository<
  CONFIG_MIN_VALUE,
  typeof CONFIG_MIN_VALUE.prototype.ID,
  ConfigMinValueRelations
> {
  constructor(
    @inject('datasources.cfsmssqldb') dataSource: CfsmssqldbDataSource,
  ) {
    super(CONFIG_MIN_VALUE, dataSource);
  }
}
