import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {CfsmssqldbDataSource} from '../datasources';
import {DtVesselVisitRelations, DT_VESSEL_VISIT} from '../models/dt-vessel-visit.model';

export class DtVesselVisitRepository extends DefaultCrudRepository<
  DT_VESSEL_VISIT,
  typeof DT_VESSEL_VISIT.prototype.ID,
  DtVesselVisitRelations
> {
  constructor(
    @inject('datasources.cfsmssqldb') dataSource: CfsmssqldbDataSource,
  ) {
    super(DT_VESSEL_VISIT, dataSource);
  }
}
