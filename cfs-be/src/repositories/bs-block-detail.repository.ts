import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {CfsmssqldbDataSource} from '../datasources';
import {BsBlockDetailRelations, BS_BLOCK_DETAILS} from '../models/bs-block-detail.model';

export class BS_BLOCK_DETAILSRepository extends DefaultCrudRepository<
  BS_BLOCK_DETAILS,
  typeof BS_BLOCK_DETAILS.prototype.ID,
  BsBlockDetailRelations
> {
  constructor(
    @inject('datasources.cfsmssqldb') dataSource: CfsmssqldbDataSource,
  ) {
    super(BS_BLOCK_DETAILS, dataSource);
  }
}


