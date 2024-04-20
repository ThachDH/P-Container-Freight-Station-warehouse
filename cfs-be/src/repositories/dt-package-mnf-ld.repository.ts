import {Getter, inject} from '@loopback/core';
import {DefaultCrudRepository, HasOneRepositoryFactory, repository} from '@loopback/repository';
import {CfsmssqldbDataSource} from '../datasources';
import {BS_CUSTOMER, DT_CNTR_MNF_LD, DT_VESSEL_VISIT} from '../models';
import {DtPackageMnfLdRelations, DT_PACKAGE_MNF_LD} from '../models/dt-package-mnf-ld.model';
import {BS_CUSTOMERRepository} from './bs-customer.repository';
import {DT_CNTR_MNF_LDRepository} from './dt-cntr-mnf-ld.repository';
import { DtVesselVisitRepository } from './dt-vessel-visit.repository';
export class DT_PACKAGE_MNF_LDRepository extends DefaultCrudRepository<
  DT_PACKAGE_MNF_LD,
  typeof DT_PACKAGE_MNF_LD.prototype.ID,
  DtPackageMnfLdRelations
> {
  public readonly consigneeInfo: HasOneRepositoryFactory<BS_CUSTOMER, typeof DT_PACKAGE_MNF_LD.prototype.CONSIGNEE>;
  protected readonly dt_package_MNF: HasOneRepositoryFactory<DT_CNTR_MNF_LD, typeof DT_PACKAGE_MNF_LD.prototype.CNTRNO>;
  protected readonly vesselName: HasOneRepositoryFactory<DT_VESSEL_VISIT, typeof DT_PACKAGE_MNF_LD.prototype.VOYAGEKEY>;

  constructor(
    @inject('datasources.cfsmssqldb') dataSource: CfsmssqldbDataSource,
    @repository.getter('BS_CUSTOMERRepository')
    getCustomerRepo: Getter<BS_CUSTOMERRepository>,
    @repository.getter('DT_CNTR_MNF_LDRepository')
    protected getDT_CNTR_MNF_LDRepository: Getter<DT_CNTR_MNF_LDRepository>,
    @repository.getter('DtVesselVisitRepository')
    getVesselNamerepo: Getter<DtVesselVisitRepository>,
  ) {
    super(DT_PACKAGE_MNF_LD, dataSource);
    this.consigneeInfo = this.createHasOneRepositoryFactoryFor('consigneeInfo', getCustomerRepo);
    this.dt_package_MNF = this.createHasOneRepositoryFactoryFor('contInfor', getDT_CNTR_MNF_LDRepository);
    this.vesselName = this.createHasOneRepositoryFactoryFor('vesselName', getVesselNamerepo);

    this.registerInclusionResolver('contInfor', this.dt_package_MNF.inclusionResolver);
    this.registerInclusionResolver('consigneeInfo', this.consigneeInfo.inclusionResolver);
    this.registerInclusionResolver('vesselName', this.vesselName.inclusionResolver);

  }
}
