import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {CfsmssqldbDataSource} from '../datasources';
import {BsItemRelations, BS_ITEM} from '../models/bs-item.model';

export class BsItemRepository extends DefaultCrudRepository<
  BS_ITEM,
  typeof BS_ITEM.prototype.ID,
  BsItemRelations
> {
  constructor(
    @inject('datasources.cfsmssqldb') dataSource: CfsmssqldbDataSource,
  ) {
    super(BS_ITEM, dataSource);
  }
}
