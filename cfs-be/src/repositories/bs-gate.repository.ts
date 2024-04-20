import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {CfsmssqldbDataSource} from '../datasources';
import {BsGateRelations, BS_GATE} from '../models/bs-gate.model';

export class BsGateRepository extends DefaultCrudRepository<
  BS_GATE,
  typeof BS_GATE.prototype.ID,
  BsGateRelations
> {
  constructor(
    @inject('datasources.cfsmssqldb') dataSource: CfsmssqldbDataSource,
  ) {
    super(BS_GATE, dataSource);
  }
}
