import {Getter, inject} from '@loopback/core';
import {DefaultCrudRepository, HasOneRepositoryFactory, repository} from '@loopback/repository';
import {CfsmssqldbDataSource} from '../datasources';
import {BS_CUSTOMER, ConfigFreeDaysRelations, CONFIG_FREE_DAYS} from '../models';
import {BS_CUSTOMERRepository} from './bs-customer.repository';
export class CONFIG_FREE_DAYSRepository extends DefaultCrudRepository<
  CONFIG_FREE_DAYS,
  typeof CONFIG_FREE_DAYS.prototype.ID,
  ConfigFreeDaysRelations
> {
  public readonly customer: HasOneRepositoryFactory<BS_CUSTOMER, typeof CONFIG_FREE_DAYS.prototype.CUSTOMER_CODE>
  constructor(
    @inject('datasources.cfsmssqldb') dataSource: CfsmssqldbDataSource,
    @repository.getter('BS_CUSTOMERRepository')
    getBSCustomerRepo: Getter<BS_CUSTOMERRepository>,
  ) {
    super(CONFIG_FREE_DAYS, dataSource);
    this.customer = this.createHasOneRepositoryFactoryFor(
      'customerName',
      getBSCustomerRepo,
    );
    this.registerInclusionResolver('customerName', this.customer.inclusionResolver);
  }
}
