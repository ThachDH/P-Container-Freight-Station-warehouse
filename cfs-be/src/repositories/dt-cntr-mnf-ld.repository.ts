import {Getter, inject} from '@loopback/core';
import {DefaultCrudRepository, HasOneRepositoryFactory, repository} from '@loopback/repository';
import {CfsmssqldbDataSource} from '../datasources';
import {DT_CNTR_MNF_LD, DtCntrMnfLdRelations} from '../models';
import {DT_PACKAGE_MNF_LD} from '../models/dt-package-mnf-ld.model';
import {DT_PACKAGE_MNF_LDRepository} from './dt-package-mnf-ld.repository';
export class DT_CNTR_MNF_LDRepository extends DefaultCrudRepository<
  DT_CNTR_MNF_LD,
  typeof DT_CNTR_MNF_LD.prototype.ID,
  DtCntrMnfLdRelations
> {
  protected readonly dt_package_MNF: HasOneRepositoryFactory<DT_PACKAGE_MNF_LD, typeof DT_CNTR_MNF_LD.prototype.CNTRNO>;
  constructor(
    @inject('datasources.cfsmssqldb') dataSource: CfsmssqldbDataSource,
    @repository.getter('DT_PACKAGE_MNF_LDRepository')
    protected getDT_PACKAGE_MNF_LDRepository: Getter<DT_PACKAGE_MNF_LDRepository>,
  ) {
    super(DT_CNTR_MNF_LD, dataSource);
    this.dt_package_MNF = this.createHasOneRepositoryFactoryFor('contInfor', getDT_PACKAGE_MNF_LDRepository);

    this.registerInclusionResolver('contInfor', this.dt_package_MNF.inclusionResolver);
  }
}
