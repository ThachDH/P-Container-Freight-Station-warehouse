import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {CfsmssqldbDataSource} from '../datasources';
import {SA_ACCESSRIGHT, SA_ACCESSRIGHTRelations} from '..//models/sa-accessright.model';

export class SA_ACCESSRIGHTRepository extends DefaultCrudRepository<
  SA_ACCESSRIGHT,
  typeof SA_ACCESSRIGHT.prototype.ID,
  SA_ACCESSRIGHTRelations
> {
  constructor(
    @inject('datasources.cfsmssqldb') dataSource: CfsmssqldbDataSource,
  ) {
    super(SA_ACCESSRIGHT, dataSource);

  }

}
