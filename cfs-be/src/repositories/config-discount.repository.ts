import {Getter, inject} from '@loopback/core';
import {DefaultCrudRepository, HasOneRepositoryFactory, repository} from '@loopback/repository';
import {CfsmssqldbDataSource} from '../datasources';
import {BS_CUSTOMER} from '../models/bs-customer.model';
import {CONFIG_DISCOUNT, CONFIG_DISCOUNTRelations} from '../models/config-discount.model';
import { BS_CUSTOMERRepository } from './bs-customer.repository';

export class CONFIG_DISCOUNTRepository extends DefaultCrudRepository<
  CONFIG_DISCOUNT,
  typeof CONFIG_DISCOUNT.prototype.ID,
  CONFIG_DISCOUNTRelations
> {
  public readonly customer: HasOneRepositoryFactory<BS_CUSTOMER, typeof CONFIG_DISCOUNT.prototype.CUSTOMER_CODE>
  constructor(
    @inject('datasources.cfsmssqldb') dataSource: CfsmssqldbDataSource,
    @repository.getter('BS_CUSTOMERRepository')
    getBSCustomerRepo: Getter<BS_CUSTOMERRepository>,
  ) {
    super(CONFIG_DISCOUNT, dataSource);
    this.customer = this.createHasOneRepositoryFactoryFor(
      'customerName',
      getBSCustomerRepo,
    );
    this.registerInclusionResolver('customerName', this.customer.inclusionResolver);
  }
}
