import {Getter, inject} from '@loopback/core';
import {DefaultCrudRepository, HasOneRepositoryFactory, repository} from '@loopback/repository';
import {CfsmssqldbDataSource} from '../datasources';
import {DT_VESSEL_VISIT, JOB_QUANTITY_CHECK, QuantityCheckRelations} from '../models';
import {DT_ORDERRepository} from './dt-order.repository';
import {DtVesselVisitRepository} from './dt-vessel-visit.repository';

export class JOB_QUANTITY_CHECKRepository extends DefaultCrudRepository<
  JOB_QUANTITY_CHECK,
  typeof JOB_QUANTITY_CHECK.prototype.ID,
  QuantityCheckRelations
> {
  protected readonly dtvessel: HasOneRepositoryFactory<DT_VESSEL_VISIT, typeof JOB_QUANTITY_CHECK.prototype.VOYAGEKEY>;
  // readonly order: BelongsToAccessor<DT_ORDER, typeof JOB_QUANTITY_CHECK.prototype.ID>;

  constructor(
    @inject('datasources.cfsmssqldb') dataSource: CfsmssqldbDataSource,
    @repository.getter('DT_ORDERRepository')
    orderRepoGetter: Getter<DT_ORDERRepository>,
    @repository.getter('DtVesselVisitRepository')
    protected getdtVesselVisitRepo: Getter<DtVesselVisitRepository>,
  ) {
    super(JOB_QUANTITY_CHECK, dataSource);
    this.dtvessel = this.createHasOneRepositoryFactoryFor('vesselInfo', getdtVesselVisitRepo);
    // this.order = this.createBelongsToAccessorFor('ToOrder', orderRepoGetter);

    this.registerInclusionResolver('vesselInfo', this.dtvessel.inclusionResolver);
    // this.registerInclusionResolver("ToOrder", this.order.inclusionResolver);
  }
}
