import {Entity, hasOne, model, property} from '@loopback/repository';
import {BS_CUSTOMER} from './bs-customer.model';
import {DT_CNTR_MNF_LD} from './dt-cntr-mnf-ld.model';
import { DT_VESSEL_VISIT } from './dt-vessel-visit.model';
@model()
export class DT_PACKAGE_MNF_LD extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: false,
  })
  ID?: number;

  @property({
    type: 'string',
  })
  ROWGUID?: string;

  @property({
    type: 'string',
  })
  VOYAGEKEY?: string;

  @property({
    type: 'number',
  })
  CLASS_CODE?: number;

  @property({
    type: 'string',
  })
  CONSIGNEE?: string;

  @property({
    type: 'string',
  })
  TRANSPORTIDENTITY?: string;

  @property({
    type: 'string',
  })
  NUMBEROFJOURNEY?: string;

  @property({
    type: 'string',
  })
  ARRIVALDEPARTURE?: string;

  @property({
    type: 'string',
  })
  CUSTOMER_NAME?: string;

  @property({
    type: 'string',
  })
  BILLOFLADING?: string;

  @property({
    type: 'string',
  })
  BOOKING_NO?: string;

  @property({
    type: 'string',
  })
  CNTRNO?: string;

  @property({
    type: 'string',
  })
  CNTRSZTP?: string;

  @property({
    type: 'string',
  })
  ITEM_TYPE_CODE_CNTR?: string;

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
  LOT_NO?: string;

  @property({
    type: 'string',
  })
  SHIPMARKS?: string;

  @property({
    type: 'string',
  })
  ITEM_TYPE_CODE?: string;

  @property({
    type: 'string',
  })
  COMMODITYDESCRIPTION?: string;

  @property({
    type: 'number',
  })
  CARGO_PIECE?: number;

  @property({
    type: 'string',
  })
  UNIT_CODE?: string;

  @property({
    type: 'number',
  })
  CARGO_WEIGHT?: number;

  @property({
    type: 'number',
  })
  CBM?: number;

  @property({
    type: 'string',
  })
  DECLARE_NO?: string;

  @property({
    type: 'string',
  })
  NOTE?: string;

  @property({
    type: 'string',
  })
  CREATE_BY?: string;

  @property({
    type: 'string',
  })
  CREATE_DATE?: string;

  @property({
    type: 'string',
  })
  UPDATE_BY?: string;

  @property({
    type: 'string',
  })
  UPDATE_DATE?: string;

  @hasOne(() => BS_CUSTOMER, {
    keyFrom: 'CONSIGNEE',
    keyTo: 'CUSTOMER_CODE',
  })
  consigneeInfo?: BS_CUSTOMER;

  @hasOne(() => DT_CNTR_MNF_LD, {
    keyFrom: 'CNTRNO',
    keyTo: 'CNTRNO'
  })
  contInfor?: DT_CNTR_MNF_LD;

  @hasOne(() => DT_VESSEL_VISIT, {
    keyFrom: 'VOYAGEKEY',
    keyTo: 'VOYAGEKEY'
  })
  vesselName?: DT_VESSEL_VISIT;

  constructor(data?: Partial<DT_PACKAGE_MNF_LD>) {
    super(data);
  }
}

export interface DtPackageMnfLdRelations {
  // describe navigational properties here
}

export type DtPackageMnfLdWithRelations = DT_PACKAGE_MNF_LD & DtPackageMnfLdRelations;
