import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {CfsmssqldbDataSource} from '../datasources';
import {InvDftDtlRelations, INV_DFT_DTL} from '../models/inv-dft-dtl.model';

export class InvDftDtlRepository extends DefaultCrudRepository<
  INV_DFT_DTL,
  typeof INV_DFT_DTL.prototype.ID,
  InvDftDtlRelations
> {
  constructor(
    @inject('datasources.cfsmssqldb') dataSource: CfsmssqldbDataSource,
  ) {
    super(INV_DFT_DTL, dataSource);
  }
}
