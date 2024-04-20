import {Getter, inject} from '@loopback/core';
import {DefaultCrudRepository, HasManyRepositoryFactory, HasOneRepositoryFactory, repository} from '@loopback/repository';
import {CfsmssqldbDataSource} from '../datasources';
import {BS_CUSTOMER, DT_ORDER, DT_PALLET_STOCK} from '../models';
import {DT_PACKAGE_MNF_LD} from '../models/dt-package-mnf-ld.model';
import {DT_PACKAGE_STOCK, DtPackageStockRelations} from '../models/dt-package-stock.model';
import {DT_VESSEL_VISIT} from '../models/dt-vessel-visit.model';
import {BS_CUSTOMERRepository} from './bs-customer.repository';
import {DT_ORDERRepository} from './dt-order.repository';
import {DT_PACKAGE_MNF_LDRepository} from './dt-package-mnf-ld.repository';
import {DtPalletStockRepository} from './dt-pallet-stock.repository';
import {DtVesselVisitRepository} from './dt-vessel-visit.repository';
export class DtPackageStockRepository extends DefaultCrudRepository<
  DT_PACKAGE_STOCK,
  typeof DT_PACKAGE_STOCK.prototype.ID,
  DtPackageStockRelations
> {
  public readonly customer: HasOneRepositoryFactory<BS_CUSTOMER, typeof DT_PACKAGE_STOCK.prototype.CUSTOMER_CODE>
  public readonly getItemTypeCodeCont: HasOneRepositoryFactory<DT_ORDER, typeof DT_PACKAGE_STOCK.prototype.ORDER_NO>;
  public readonly maniFest: HasOneRepositoryFactory<DT_PACKAGE_MNF_LD, typeof DT_PACKAGE_STOCK.prototype.VOYAGEKEY>;
  public readonly vesselVisit: HasManyRepositoryFactory<DT_VESSEL_VISIT, typeof DT_PACKAGE_STOCK.prototype.VOYAGEKEY>;
  public readonly pallet: HasManyRepositoryFactory<DT_PALLET_STOCK, typeof DT_PACKAGE_STOCK.prototype.ID>;
  constructor(
    @inject('datasources.cfsmssqldb') dataSource: CfsmssqldbDataSource,
    @repository.getter('BS_CUSTOMERRepository')
    getBSCustomerRepo: Getter<BS_CUSTOMERRepository>,
    @repository.getter('DT_PACKAGE_MNF_LDRepository')
    getDtManifestRepository: Getter<DT_PACKAGE_MNF_LDRepository>,
    @repository.getter('DtVesselVisitRepository')
    getDtVesselVisitRepository: Getter<DtVesselVisitRepository>,
    @repository.getter('DT_ORDERRepository')
    getItemTypeCodeCont: Getter<DT_ORDERRepository>,
    @repository.getter('DtPalletStockRepository')
    getData: Getter<DtPalletStockRepository>,

  ) {
    super(DT_PACKAGE_STOCK, dataSource);

    this.customer = this.createHasOneRepositoryFactoryFor(
      'customerName',
      getBSCustomerRepo,
    );
    this.maniFest = this.createHasOneRepositoryFactoryFor('package_MNF', getDtManifestRepository);
    this.vesselVisit = this.createHasManyRepositoryFactoryFor('vesselVisit', getDtVesselVisitRepository);
    this.pallet = this.createHasManyRepositoryFactoryFor('palletStockInfo', getData);
    this.getItemTypeCodeCont = this.createHasOneRepositoryFactoryFor(
      'getItemTypeCodeCont',
      getItemTypeCodeCont
    );

    this.registerInclusionResolver('palletStockInfo', this.pallet.inclusionResolver);
    this.registerInclusionResolver('customerName', this.customer.inclusionResolver);
    this.registerInclusionResolver('package_MNF', this.maniFest.inclusionResolver);
    this.registerInclusionResolver('vesselVisit', this.vesselVisit.inclusionResolver);
    this.registerInclusionResolver('getItemTypeCodeCont', this.getItemTypeCodeCont.inclusionResolver);
  }
}


