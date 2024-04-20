import {Getter, inject} from '@loopback/core';
import {DefaultCrudRepository, HasOneRepositoryFactory, repository} from '@loopback/repository';
import {CfsmssqldbDataSource} from '../datasources';
import {BS_CUSTOMER, CONFIG_DAY_LEVEL, ConfigDayLevelRelations} from '../models';
import {BS_CUSTOMERRepository} from './bs-customer.repository';

export class CONFIG_DAY_LEVELRepository extends DefaultCrudRepository<
  CONFIG_DAY_LEVEL,
  typeof CONFIG_DAY_LEVEL.prototype.ID,
  ConfigDayLevelRelations
> {
  public readonly customer: HasOneRepositoryFactory<BS_CUSTOMER, typeof CONFIG_DAY_LEVEL.prototype.CUSTOMER_CODE>
  constructor(
    @inject('datasources.cfsmssqldb') dataSource: CfsmssqldbDataSource,
    @repository.getter('BS_CUSTOMERRepository')
    getBSCustomerRepo: Getter<BS_CUSTOMERRepository>
  ) {
    super(CONFIG_DAY_LEVEL, dataSource);
    this.customer = this.createHasOneRepositoryFactoryFor(
      'customerName',
      getBSCustomerRepo,
    );
    this.registerInclusionResolver('customerName', this.customer.inclusionResolver);
  }
}
