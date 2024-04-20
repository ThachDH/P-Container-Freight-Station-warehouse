import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {CfsmssqldbDataSource} from '../datasources';
import {INV_VAT, IntVatRelations} from '../models';

export class INV_VATRepository extends DefaultCrudRepository<
  INV_VAT,
  typeof INV_VAT.prototype.ID,
  IntVatRelations
> {
  constructor(
    @inject('datasources.cfsmssqldb') dataSource: CfsmssqldbDataSource,
  ) {
    super(INV_VAT, dataSource);
  }
}


