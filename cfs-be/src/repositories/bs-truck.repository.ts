import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {CfsmssqldbDataSource} from '../datasources';
import { } from '../models';
import {BS_TRUCK, BS_TRUCKRelations} from '../models/bs-truck.model';

export class BS_TRUCKRepository extends DefaultCrudRepository<
  BS_TRUCK,
  typeof BS_TRUCK.prototype.ID,
  BS_TRUCKRelations
> {
  constructor(
    @inject('datasources.cfsmssqldb') dataSource: CfsmssqldbDataSource,
  ) {
    super(BS_TRUCK, dataSource);
  }
}
