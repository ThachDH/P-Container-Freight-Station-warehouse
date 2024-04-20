import {Getter, inject} from '@loopback/core';
import {
  DefaultCrudRepository,
  HasManyRepositoryFactory,
  HasOneRepositoryFactory,
  repository,
} from '@loopback/repository';
import {CfsmssqldbDataSource} from '../datasources';
import {
  BS_CUSTOMER,
  DtOrderRelations,
  DT_ORDER,
  DT_VESSEL_VISIT,
  JOB_QUANTITY_CHECK,
} from '../models';
import {BS_CUSTOMERRepository} from './bs-customer.repository';
import {DtVesselVisitRepository} from './dt-vessel-visit.repository';
import {JOB_QUANTITY_CHECKRepository} from './job-quantity-check.repository';
export class DT_ORDERRepository extends DefaultCrudRepository<
  DT_ORDER,
  typeof DT_ORDER.prototype.ID,
  DtOrderRelations
> {
  public readonly stock_take: HasManyRepositoryFactory<
    JOB_QUANTITY_CHECK,
    typeof DT_ORDER.prototype.ID
  >;
  public readonly vesselInfo: HasOneRepositoryFactory<
    DT_VESSEL_VISIT,
    typeof DT_ORDER.prototype.ID
  >;
  // public readonly conInfo: HasOneRepositoryFactory<DT_CNTR_MNF_LD, typeof DT_ORDER.prototype.ID>
  public readonly customerInfo: HasOneRepositoryFactory<
    BS_CUSTOMER,
    typeof DT_ORDER.prototype.ID
  >;

  constructor(
    @inject('datasources.cfsmssqldb') dataSource: CfsmssqldbDataSource,
    @repository.getter('JOB_QUANTITY_CHECKRepository')
    jobRepoGetter: Getter<JOB_QUANTITY_CHECKRepository>,
    @repository.getter('DtVesselVisitRepository')
    getdtVesselVisitRepo: Getter<DtVesselVisitRepository>,
    // @repository.getter('DT_CNTR_MNF_LDRepository')
    // getdtCntrMnfLdRepo: Getter<DT_CNTR_MNF_LDRepository>,
    @repository.getter('BS_CUSTOMERRepository')
    getBSCustomerRepo: Getter<BS_CUSTOMERRepository>,
  ) {
    super(DT_ORDER, dataSource);
    this.stock_take = this.createHasManyRepositoryFactoryFor(
      'STOCK_TAKE',
      jobRepoGetter,
    );
    this.vesselInfo = this.createHasOneRepositoryFactoryFor(
      'vesselInfo',
      getdtVesselVisitRepo,
    );
    // this.conInfo = this.createHasOneRepositoryFactoryFor(
    //   'conInfo',
    //   getdtCntrMnfLdRepo,
    // );
    this.customerInfo = this.createHasOneRepositoryFactoryFor(
      'customerInfo',
      getBSCustomerRepo,
    );

    this.registerInclusionResolver(
      'STOCK_TAKE',
      this.stock_take.inclusionResolver,
    );
    this.registerInclusionResolver(
      'vesselInfo',
      this.vesselInfo.inclusionResolver,
    );
    // this.registerInclusionResolver('conInfo', this.conInfo.inclusionResolver);
    this.registerInclusionResolver(
      'customerInfo',
      this.customerInfo.inclusionResolver,
    );
  }
}
