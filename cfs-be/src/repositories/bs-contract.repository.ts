import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {CfsmssqldbDataSource} from '../datasources';
import {BsContractRelations, BS_CONTRACT} from '../models';

export class BsContractRepository extends DefaultCrudRepository<
  BS_CONTRACT,
  typeof BS_CONTRACT.prototype.ID,
  BsContractRelations
> {
  constructor(
    @inject('datasources.cfsmssqldb') dataSource: CfsmssqldbDataSource,
  ) {
    super(BS_CONTRACT, dataSource);
  }
}
