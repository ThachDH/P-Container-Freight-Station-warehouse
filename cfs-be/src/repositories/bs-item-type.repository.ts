import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {CfsmssqldbDataSource} from '../datasources';
import {BsItemTypeRelations, BS_ITEM_TYPE} from '../models';

export class BsItemTypeRepository extends DefaultCrudRepository<
  BS_ITEM_TYPE,
  typeof BS_ITEM_TYPE.prototype.ID,
  BsItemTypeRelations
> {
  constructor(
    @inject('datasources.cfsmssqldb') dataSource: CfsmssqldbDataSource,
  ) {
    super(BS_ITEM_TYPE, dataSource);
  }
}
