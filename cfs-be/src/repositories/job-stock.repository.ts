import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {CfsmssqldbDataSource} from '../datasources';
import {JobStockRelations, JOB_STOCK} from '../models';


export class JOB_STOCKRepository extends DefaultCrudRepository<
  JOB_STOCK,
  typeof JOB_STOCK.prototype.ID,
  JobStockRelations
> {
  constructor(
    @inject('datasources.cfsmssqldb') dataSource: CfsmssqldbDataSource,
  ) {
    super(JOB_STOCK, dataSource);
  }
}
