import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {CfsmssqldbDataSource} from '../datasources';
import {TrfCodesRelations, TRF_CODES} from '../models';

export class TrfCodesRepository extends DefaultCrudRepository<
  TRF_CODES,
  typeof TRF_CODES.prototype.ID,
  TrfCodesRelations
> {
  constructor(
    @inject('datasources.cfsmssqldb') dataSource: CfsmssqldbDataSource,
  ) {
    super(TRF_CODES, dataSource);
  }
}
