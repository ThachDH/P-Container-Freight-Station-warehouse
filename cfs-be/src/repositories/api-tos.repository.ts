import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {CfsmssqldbDataSource} from '../datasources';
import {API_TOS, ApiTosRelations} from '../models';

export class API_TOSRepository extends DefaultCrudRepository<
  API_TOS,
  typeof API_TOS.prototype.ID,
  ApiTosRelations
> {
  constructor(
    @inject('datasources.cfsmssqldb') dataSource: CfsmssqldbDataSource,
  ) {
    super(API_TOS, dataSource);
  }
}
