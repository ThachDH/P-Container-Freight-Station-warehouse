import {Getter, inject} from '@loopback/core';
import {DefaultCrudRepository, HasOneRepositoryFactory, repository} from '@loopback/repository';
import {CfsmssqldbDataSource} from '../datasources';
import {BS_CUSTOMER} from '../models';
import {INV_DFT, InvDftRelations} from '../models/inv-dft.model';
import { BS_CUSTOMERRepository } from './bs-customer.repository';

export class InvDftRepository extends DefaultCrudRepository<
  INV_DFT,
  typeof INV_DFT.prototype.ID,
  InvDftRelations
> {
  public readonly customerInfo: HasOneRepositoryFactory<BS_CUSTOMER, typeof INV_DFT.prototype.PAYER>
  constructor(
    @inject('datasources.cfsmssqldb') dataSource: CfsmssqldbDataSource,
    @repository.getter('BS_CUSTOMERRepository')
    getcustomerRepo: Getter<BS_CUSTOMERRepository>,
  ) {
    super(INV_DFT, dataSource);
    this.customerInfo = this.createHasOneRepositoryFactoryFor(
      'customerInfo',
      getcustomerRepo,
    );
    this.registerInclusionResolver('customerInfo', this.customerInfo.inclusionResolver);
  }
}
