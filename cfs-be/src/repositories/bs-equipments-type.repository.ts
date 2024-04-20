import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {CfsmssqldbDataSource} from '../datasources';
import { } from '../models';
import {BsEquipmentsTypeRelations, BS_EQUIPMENTS_TYPE} from '../models/bs-equipments-type.model';

export class BsEquipmentsTypeRepository extends DefaultCrudRepository<
  BS_EQUIPMENTS_TYPE,
  typeof BS_EQUIPMENTS_TYPE.prototype.ID,
  BsEquipmentsTypeRelations
> {
  constructor(
    @inject('datasources.cfsmssqldb') dataSource: CfsmssqldbDataSource,
  ) {
    super(BS_EQUIPMENTS_TYPE, dataSource);
  }
}
