import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {CfsmssqldbDataSource} from '../datasources';
import {BsCustomerTypeRelations, BS_CUSTOMER_TYPE} from '../models';

export class BS_CUSTOMER_TYPERepository extends DefaultCrudRepository<
  BS_CUSTOMER_TYPE,
  typeof BS_CUSTOMER_TYPE.prototype.ID,
  BsCustomerTypeRelations
> {
  constructor(
    @inject('datasources.cfsmssqldb') dataSource: CfsmssqldbDataSource,
  ) {
    super(BS_CUSTOMER_TYPE, dataSource);
  }
}
