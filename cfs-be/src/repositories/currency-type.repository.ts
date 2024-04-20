import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {CfsmssqldbDataSource} from '../datasources';
import {CURRENCY, CurrencyTypeRelations} from '../models';

export class CURRENCY_TYPERepository extends DefaultCrudRepository<
  CURRENCY,
  typeof CURRENCY.prototype.ID,
  CurrencyTypeRelations
> {
  constructor(
    @inject('datasources.cfsmssqldb') dataSource: CfsmssqldbDataSource,
  ) {
    super(CURRENCY, dataSource);
  }
}
