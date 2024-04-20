import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {CfsmssqldbDataSource} from '../datasources';
import {RECEIPTS, RECEIPTSRelations} from '../models/receipts.model';

export class ReceiptsRepository extends DefaultCrudRepository<
  RECEIPTS,
  typeof RECEIPTS.prototype.ID,
  RECEIPTSRelations
> {
  constructor(
    @inject('datasources.cfsmssqldb') dataSource: CfsmssqldbDataSource,
  ) {
    super(RECEIPTS, dataSource);
  }
}
