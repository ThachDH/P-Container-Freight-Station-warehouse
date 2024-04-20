import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {CfsmssqldbDataSource} from '../datasources';
import {TrfStdRelations, TRF_STD} from '../models/trf-std.model';

export class TrfStdRepository extends DefaultCrudRepository<
  TRF_STD,
  typeof TRF_STD.prototype.ID,
  TrfStdRelations
> {
  constructor(
    @inject('datasources.cfsmssqldb') dataSource: CfsmssqldbDataSource,
  ) {
    super(TRF_STD, dataSource);
  }
}
