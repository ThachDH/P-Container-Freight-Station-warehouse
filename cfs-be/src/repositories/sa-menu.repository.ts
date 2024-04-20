import {Getter, inject} from '@loopback/core';
import {DefaultCrudRepository, HasManyRepositoryFactory, repository} from '@loopback/repository';
import {CfsmssqldbDataSource} from '../datasources';
import {SA_ACCESSRIGHT} from '../models';
import {SA_MENU, SA_MENURelations} from '../models/sa-menu.model';
import {SA_ACCESSRIGHTRepository} from './sa-accessright.repository';

export class SA_MENURepository extends DefaultCrudRepository<
  SA_MENU,
  typeof SA_MENU.prototype.ID,
  SA_MENURelations
> {
  public readonly menus: HasManyRepositoryFactory<SA_ACCESSRIGHT, typeof SA_MENU.prototype.PARENT_CODE>;
  constructor(
    @inject('datasources.cfsmssqldb') dataSource: CfsmssqldbDataSource,
    @repository.getter('SA_ACCESSRIGHTRepository')
    protected getMenuR: Getter<SA_ACCESSRIGHTRepository>
  ) {
    super(SA_MENU, dataSource);
    this.menus = this.createHasManyRepositoryFactoryFor('lstMenu', getMenuR);

    this.registerInclusionResolver('lstMenu', this.menus.inclusionResolver);
  }
}
