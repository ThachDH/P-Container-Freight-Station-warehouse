import {Entity, hasMany, hasOne, model, property} from '@loopback/repository';
import {BS_CUSTOMER} from './bs-customer.model';
import {DT_ORDER} from './dt-order.model';
import {DT_PACKAGE_MNF_LD, DtPackageMnfLdWithRelations} from './dt-package-mnf-ld.model';
import {DT_PALLET_STOCK} from './dt-pallet-stock.model';
import {DT_VESSEL_VISIT} from './dt-vessel-visit.model';

@model()
export class DT_PACKAGE_STOCK extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  ID?: string;

  @property({
    type: 'string',
  })
  ROWGUID?: string;

  @property({
    type: 'string',
  })
  WAREHOUSE_CODE?: string;

  @property({
    type: 'number',
  })
  CLASS_CODE?: number;

  @property({
    type: 'string',
  })
  VOYAGEKEY?: string;

  @property({
    type: 'string',
  })
  METHOD_IN?: string;

  @property({
    type: 'string',
  })
  METHOD_OUT?: string;

  @property({
    type: 'string',
  })
  ORDER_NO?: string;

  @property({
    type: 'string',
  })
  PIN_CODE?: string;

  @property({
    type: 'string'
  })
  CUSTOMER_TYPE_CODE?: string;

  @property({
    type: 'string',
  })
  CUSTOMER_CODE?: string;

  @property({
    type: 'string',
  })
  HOUSE_BILL?: string;

  @property({
    type: 'string',
  })
  BOOKING_FWD?: string;

  @property({
    type: 'string',
  })
  CNTRNO?: string;

  @property({
    type: 'string',
  })
  LOT_NO?: string;

  @property({
    type: 'string',
  })
  STATUS?: string;

  @property({
    type: "string",
  })
  TIME_IN?: Date;

  @property({
    type: 'string',
  })
  TIME_OUT?: Date;

  @property({
    type: "number",
  })
  CARGO_PIECE?: number;

  @property({
    type: 'string',
  })
  UNIT_CODE?: string;

  @property({
    type: "number"
  })
  CARGO_WEIGHT?: number;

  @property({
    type: 'number',
  })
  CBM?: number;

  @property({
    type: 'number',
  })
  TLHQ?: number;

  @property({
    type: 'number',
  })
  GETIN_HQ?: number;

  @property({
    type: "number"
  })
  GETOUT_HQ?: number;

  @property({
    type: 'string',
  })
  TKHN_NO?: string;

  @property({
    type: 'string',
  })
  TKHX_NO?: string;

  @property({
    type: 'string',
  })
  CUSTOMER_CAS?: string;

  @property({
    type: 'string',
  })
  NOTE?: string;

  @hasOne(() => BS_CUSTOMER, {
    keyFrom: 'CUSTOMER_CODE',
    keyTo: 'CUSTOMER_CODE'
  })
  customerName: BS_CUSTOMER;

  @property({
    type: 'string',
  })
  ITEM_TYPE_CODE?: string;

  @property({
    type: 'string',
  })
  COMMODITYDESCRIPTION?: string;

  @property({
    type: 'string',
  })
  CREATE_BY?: string;

  @property({
    type: 'string',
  })
  CREATE_DATE?: Date;

  @property({
    type: 'string',
  })
  UPDATE_BY?: string;

  @property({
    type: 'string',
  })
  UPDATE_DATE?: string;

  @hasOne(() => DT_PACKAGE_MNF_LD, {
    keyFrom: 'VOYAGEKEY',
    keyTo: 'VOYAGEKEY',
  })
  package_MNF?: DT_PACKAGE_MNF_LD;

  @hasOne(() => DT_ORDER, {
    keyFrom: 'ORDER_NO',
    keyTo: 'ORDER_NO',
  })
  getItemTypeCodeCont?: DT_ORDER;

  @hasMany(() => DT_PALLET_STOCK, {
    keyFrom: 'ID',
    keyTo: 'IDREF_STOCK',
  })
  palletStockInfo?: DT_PALLET_STOCK

  @hasMany(() => DT_VESSEL_VISIT, {
    keyTo: 'VOYAGEKEY',
    keyFrom: 'VOYAGEKEY'
  })
  vesselVisit?: DT_VESSEL_VISIT[];

  constructor(data?: Partial<DT_PACKAGE_STOCK>) {
    super(data);
  }
}

export interface DtPackageStockRelations {
  package_MNF?: DtPackageMnfLdWithRelations,
}

export type DtPackageStockWithRelations = DT_PACKAGE_STOCK & DtPackageStockRelations;
