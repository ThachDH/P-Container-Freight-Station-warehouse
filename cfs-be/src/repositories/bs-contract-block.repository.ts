import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {CfsmssqldbDataSource} from '../datasources';
import {BsContractBlockRelations, BS_CONTRACT_BLOCK} from '../models';

export class BsContractBlockRepository extends DefaultCrudRepository<
  BS_CONTRACT_BLOCK,
  typeof BS_CONTRACT_BLOCK.prototype.ID,
  BsContractBlockRelations
> {
  constructor(
    @inject('datasources.cfsmssqldb') dataSource: CfsmssqldbDataSource,
  ) {
    super(BS_CONTRACT_BLOCK, dataSource);
  }
}
