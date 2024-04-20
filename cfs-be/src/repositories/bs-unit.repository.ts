import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {CfsmssqldbDataSource} from '../datasources';
import {BsUnitRelations, BS_UNIT} from '../models';

export class BsUnitRepository extends DefaultCrudRepository<
  BS_UNIT,
  typeof BS_UNIT.prototype.ID,
  BsUnitRelations
> {
  constructor(
    @inject('datasources.cfsmssqldb') dataSource: CfsmssqldbDataSource,
  ) {
    super(BS_UNIT, dataSource);
  }
}
