import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {CfsmssqldbDataSource} from '../datasources';
import {CONFIG_ATTACH_SERVICE, CONFIG_ATTACH_SERVICERelations} from '../models';

export class CONFIG_ATTACH_SERVICERepository extends DefaultCrudRepository<
  CONFIG_ATTACH_SERVICE,
  typeof CONFIG_ATTACH_SERVICE.prototype.ID,
  CONFIG_ATTACH_SERVICERelations
> {
  constructor(
    @inject('datasources.cfsmssqldb') dataSource: CfsmssqldbDataSource,
  ) {
    super(CONFIG_ATTACH_SERVICE, dataSource);
  }
}
