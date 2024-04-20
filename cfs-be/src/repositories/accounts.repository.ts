import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {CfsmssqldbDataSource} from '../datasources';
import {ACCOUNTS, AccountsRelations} from '../models';

export class ACCOUNTSRepository extends DefaultCrudRepository<
  ACCOUNTS,
  typeof ACCOUNTS.prototype.ID,
  AccountsRelations
> {
  constructor(
    @inject('datasources.cfsmssqldb') dataSource: CfsmssqldbDataSource,
  ) {
    super(ACCOUNTS, dataSource);
  }
}
