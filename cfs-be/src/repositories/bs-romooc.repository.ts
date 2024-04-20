import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {CfsmssqldbDataSource} from '../datasources';
import { } from '../models';
import {BS_ROMOOC, BS_ROMOOCRelations} from '../models/bs-romooc.model';

export class BS_ROMOOCRepository extends DefaultCrudRepository<
  BS_ROMOOC,
  typeof BS_ROMOOC.prototype.ID,
  BS_ROMOOCRelations
> {
  constructor(
    @inject('datasources.cfsmssqldb') dataSource: CfsmssqldbDataSource,
  ) {
    super(BS_ROMOOC, dataSource);
  }
}
