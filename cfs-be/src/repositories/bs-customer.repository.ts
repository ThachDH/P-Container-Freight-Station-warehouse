import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {CfsmssqldbDataSource} from '../datasources';
import {BsCustomerRelations, BS_CUSTOMER} from '../models';

export class BS_CUSTOMERRepository extends DefaultCrudRepository<
  BS_CUSTOMER,
  typeof BS_CUSTOMER.prototype.ID,
  BsCustomerRelations
> {
  constructor(
    @inject('datasources.cfsmssqldb') dataSource: CfsmssqldbDataSource,
  ) {
    super(BS_CUSTOMER, dataSource);
  }
}
