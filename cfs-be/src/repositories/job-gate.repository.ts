import {Getter, inject} from '@loopback/core';
import {DefaultCrudRepository, HasOneRepositoryFactory, repository} from '@loopback/repository';
import {CfsmssqldbDataSource} from '../datasources';
import {BS_ROMOOC, BS_TRUCK, DT_VESSEL_VISIT, JobGateRelations, JOB_GATE} from '../models';
import {BS_ROMOOCRepository} from './bs-romooc.repository';
import {BS_TRUCKRepository} from './bs-truck.repository';
import {DtVesselVisitRepository} from './dt-vessel-visit.repository';

export class JOB_GATERepository extends DefaultCrudRepository<
  JOB_GATE,
  typeof JOB_GATE.prototype.ID,
  JobGateRelations
> {
  protected readonly bstruck: HasOneRepositoryFactory<BS_TRUCK, typeof JOB_GATE.prototype.TRUCK_NO>;
  protected readonly bsremooc: HasOneRepositoryFactory<BS_ROMOOC, typeof JOB_GATE.prototype.REMOOC_NO>;
  protected readonly dtvessel: HasOneRepositoryFactory<DT_VESSEL_VISIT, typeof JOB_GATE.prototype.VOYAGEKEY>;
  constructor(
    @inject('datasources.cfsmssqldb') dataSource: CfsmssqldbDataSource,
    @repository.getter('BS_TRUCKRepository')
    protected BS_TRUCKRepo: Getter<BS_TRUCKRepository>,
    @repository.getter('BS_ROMOOCRepository')
    protected BS_ROMOOCRepo: Getter<BS_ROMOOCRepository>,
    @repository.getter('DtVesselVisitRepository')
    protected getdtVesselVisitRepo: Getter<DtVesselVisitRepository>,
  ) {
    super(JOB_GATE, dataSource);
    this.bstruck = this.createHasOneRepositoryFactoryFor('bsTruck', BS_TRUCKRepo);
    this.bsremooc = this.createHasOneRepositoryFactoryFor('bsRemooc', BS_ROMOOCRepo);
    this.dtvessel = this.createHasOneRepositoryFactoryFor('vesselInfo', getdtVesselVisitRepo);

    this.registerInclusionResolver('bsTruck', this.bstruck.inclusionResolver);
    this.registerInclusionResolver('bsRemooc', this.bsremooc.inclusionResolver);
    this.registerInclusionResolver('vesselInfo', this.dtvessel.inclusionResolver);
  }
}
