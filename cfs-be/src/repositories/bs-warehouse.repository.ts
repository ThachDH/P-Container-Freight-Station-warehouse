import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {CfsmssqldbDataSource} from '../datasources';
import {BsWareHouseRelations, BS_WAREHOUSE} from '../models/bs-warehouse.model';

export class BS_WareHouseRepository extends DefaultCrudRepository<
  BS_WAREHOUSE,
  typeof BS_WAREHOUSE.prototype.ID,
  BsWareHouseRelations
> {
  constructor(
    @inject('datasources.cfsmssqldb') dataSource: CfsmssqldbDataSource,
  ) {
    super(BS_WAREHOUSE, dataSource);
  }
}
