import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {CfsmssqldbDataSource} from '../datasources';
import {DtCntrStockRelations, DT_CNTR_STOCK} from '../models';

export class DT_CNTR_STOCKRepository extends DefaultCrudRepository<
  DT_CNTR_STOCK,
  typeof DT_CNTR_STOCK.prototype.ID,
  DtCntrStockRelations
> {
  constructor(
    @inject('datasources.cfsmssqldb') dataSource: CfsmssqldbDataSource,
  ) {
    super(DT_CNTR_STOCK, dataSource);
  }
}
