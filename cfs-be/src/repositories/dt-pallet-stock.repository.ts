import {Getter, inject} from '@loopback/core';
import {DefaultCrudRepository, HasOneRepositoryFactory, repository} from '@loopback/repository';
import {CfsmssqldbDataSource} from '../datasources';
import {DtPalletStockRelations, DT_PACKAGE_STOCK, DT_PALLET_STOCK, JOB_STOCK} from '../models';
import {DtPackageStockRepository} from './dt-package-stock.repository';
import {JOB_STOCKRepository} from './job-stock.repository';

export class DtPalletStockRepository extends DefaultCrudRepository<
  DT_PALLET_STOCK,
  typeof DT_PALLET_STOCK.prototype.ID,
  DtPalletStockRelations
>{
  public readonly package: HasOneRepositoryFactory<DT_PACKAGE_STOCK, typeof DT_PALLET_STOCK.prototype.IDREF_STOCK>;
  public readonly jobStock: HasOneRepositoryFactory<JOB_STOCK, typeof DT_PALLET_STOCK.prototype.PALLET_NO>;
  constructor(
    @inject('datasources.cfsmssqldb') datasource: CfsmssqldbDataSource,
    @repository.getter('DtPackageStockRepository')
    getDtPackageStockRepository: Getter<DtPackageStockRepository>,
    @repository.getter('JOB_STOCKRepository')
    getJOB_STOCKRepository: Getter<JOB_STOCKRepository>
  ) {
    super(DT_PALLET_STOCK, datasource);
    this.package = this.createHasOneRepositoryFactoryFor(
      'packageStockInfo',
      getDtPackageStockRepository,
    );
    this.registerInclusionResolver('packageStockInfo', this.package.inclusionResolver);

    this.jobStock = this.createHasOneRepositoryFactoryFor(
      'jobStockInfo',
      getJOB_STOCKRepository,
    );
    this.registerInclusionResolver('jobStockInfo', this.jobStock.inclusionResolver);
  }
}
