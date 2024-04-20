import {Getter, inject} from '@loopback/core';
import {DefaultCrudRepository, HasOneRepositoryFactory, repository} from '@loopback/repository';
import {CfsmssqldbDataSource} from '../datasources';
import {BsBlockRelations, BS_BLOCK, DT_PALLET_STOCK} from '../models';
import {DtPalletStockRepository} from './dt-pallet-stock.repository';
export class BS_BLOCKRepository extends DefaultCrudRepository<
  BS_BLOCK,
  typeof BS_BLOCK.prototype.ID,
  BsBlockRelations
> {
  public readonly pallet: HasOneRepositoryFactory<DT_PALLET_STOCK, typeof BS_BLOCK.prototype.BLOCK>
  constructor(
    @inject('datasources.cfsmssqldb') dataSource: CfsmssqldbDataSource,
    @repository.getter('DtPalletStockRepository')
    getdtPalletStockRepo: Getter<DtPalletStockRepository>,
  ) {
    super(BS_BLOCK, dataSource);
    this.pallet = this.createHasOneRepositoryFactoryFor(
      'palletStockInfo',
      getdtPalletStockRepo,
    );
    this.registerInclusionResolver('palletStockInfo', this.pallet.inclusionResolver);
  }
}
