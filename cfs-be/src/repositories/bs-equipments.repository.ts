import {Getter, inject} from '@loopback/core';
import {DefaultCrudRepository, HasOneRepositoryFactory, repository} from '@loopback/repository';
import {CfsmssqldbDataSource} from '../datasources';
import {BS_EQUIPMENTS_TYPE} from '../models/bs-equipments-type.model';
import {BS_EQUIPMENTS, BsEquipmentsRelations} from '../models/bs-equipments.model';
import {BsEquipmentsTypeRepository} from './bs-equipments-type.repository';
export class BsEquipmentsRepository extends DefaultCrudRepository<
  BS_EQUIPMENTS,
  typeof BS_EQUIPMENTS.prototype.ID,
  BsEquipmentsRelations
> {
  public readonly equimentTypeInfo: HasOneRepositoryFactory<BS_EQUIPMENTS_TYPE, typeof BS_EQUIPMENTS.prototype.EQU_TYPE>

  constructor(
    @inject('datasources.cfsmssqldb') dataSource: CfsmssqldbDataSource,
    @repository.getter('BsEquipmentsTypeRepository')
    getdtPalletStockRepo: Getter<BsEquipmentsTypeRepository>,
  ) {
    super(BS_EQUIPMENTS, dataSource);
    this.equimentTypeInfo = this.createHasOneRepositoryFactoryFor(
      'equimentTypeInfo',
      getdtPalletStockRepo,
    );
    this.registerInclusionResolver('equimentTypeInfo', this.equimentTypeInfo.inclusionResolver);
  }
}
