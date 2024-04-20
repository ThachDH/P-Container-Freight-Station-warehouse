import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {CfsmssqldbDataSource} from '../datasources';
import {SA_USERGROUPS, SA_USERGROUPSRelations} from '../models/sa-usergroups.model';

export class SA_USERGROUPSRepository extends DefaultCrudRepository<
  SA_USERGROUPS,
  typeof SA_USERGROUPS.prototype.ID,
  SA_USERGROUPSRelations
> {
  constructor(
    @inject('datasources.cfsmssqldb') dataSource: CfsmssqldbDataSource,
  ) {
    super(SA_USERGROUPS, dataSource);
  }
}
