import {Getter, inject} from '@loopback/core';
import {DefaultCrudRepository, HasManyRepositoryFactory, repository} from '@loopback/repository';
import {CfsmssqldbDataSource} from '../datasources';
import {BsMethodRelations, BS_METHOD, CONFIG_ATTACH_SERVICE} from '../models';
import {CONFIG_ATTACH_SERVICERepository} from './config-attach-service.repository';

export class BS_METHODRepository extends DefaultCrudRepository<
  BS_METHOD,
  typeof BS_METHOD.prototype.ID,
  BsMethodRelations
> {
  public readonly service: HasManyRepositoryFactory<CONFIG_ATTACH_SERVICE, typeof BS_METHOD.prototype.METHOD_CODE>
  constructor(
    @inject('datasources.cfsmssqldb') dataSource: CfsmssqldbDataSource,
    @repository.getter('CONFIG_ATTACH_SERVICERepository')
    configService: Getter<CONFIG_ATTACH_SERVICERepository>,
  ) {
    super(BS_METHOD, dataSource);
    this.service = this.createHasManyRepositoryFactoryFor(
      'configService',
      configService,
    );
    this.registerInclusionResolver(
      'configService',
      this.service.inclusionResolver);
  }
}
