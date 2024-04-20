import {Entity, hasMany, hasOne, model, property} from '@loopback/repository';
import {BS_CUSTOMER} from './bs-customer.model';
import {DT_VESSEL_VISIT} from './dt-vessel-visit.model';
import {JOB_QUANTITY_CHECK} from './job-quantity-check.model';
@model()
export class DT_ORDER extends Entity {
  @hasMany(() => JOB_QUANTITY_CHECK, {
    keyFrom: 'HOUSE_BILL',
    keyTo: 'HOUSE_BILL',
  })
  STOCK_TAKE?: any;

  @property({
    type: 'number',
    id: true,
    generated: false,
  })
  ID?: number;

  @property({
    type: 'number',
  })
  ROWGUID?: number;

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
  ORDER_NO?: string;

  @property({
    type: 'string',
  })
  PIN_CODE?: string;

  @property({
    type: 'string',
  })
  CUSTOMER_CODE?: string;

  @property({
    type: 'string',
  })
  ACC_TYPE?: string;

  @property({
    type: 'string',
  })
  ACC_CD?: string;

  @property({
    type: 'string',
  })
  DELIVERY_ORDER?: string;

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
  ITEM_TYPE_CODE?: string;

  @property({
    type: 'string',
  })
  ITEM_TYPE_CODE_CNTR?: string;

  @property({
    type: 'string',
  })
  METHOD_CODE?: string;

  @property({
    type: 'string',
  })
  ISSUE_DATE?: string;

  @property({
    type: 'string',
  })
  EXP_DATE?: string;

  @property({
    type: 'string',
  })
  HOUSE_BILL?: string;

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
    type: 'number',
  })
  RT?: number;

  @property({
    type: 'string',
  })
  LOT_NO?: string;

  @property({
    type: 'string',
  })
  NOTE?: string;

  @property({
    type: 'string',
  })
  BOOKING_NO?: string;

  @property({
    type: 'boolean',
  })
  GATE_CHK?: boolean;

  @property({
    type: 'boolean',
  })
  QUANTITY_CHK?: boolean;

  @property({
    type: 'boolean',
  })
  PAYMENT_CHK?: boolean;

  @property({
    type: 'string',
  })
  CREATE_BY?: string;

  @property({
    type: 'string',
  })
  DRAFT_NO?: string;

  @property({
    type: 'string',
  })
  INV_NO?: string;

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

  @property({
    type: 'string',
  })
  BILLOFLADING?: string;

  @property({
    type: 'string',
  })
  OWNER?: string;

  @property({
    type: 'string',
  })
  OWNER_REPRESENT?: string;

  @property({
    type: 'string',
  })
  OWNER_PHONE?: string;

  @property({
    type: 'string',
  })
  COMMODITYDESCRIPTION?: string;

  @property({
    type: 'string',
  })
  BOOKING_FWD?: string;
  @hasOne(() => DT_VESSEL_VISIT, {
    keyFrom: 'VOYAGEKEY',
    keyTo: 'VOYAGEKEY',
  })
  vesselInfo?: DT_VESSEL_VISIT;

  // @hasOne(() => DT_CNTR_MNF_LD, {
  //  keyFrom: 'CNTRNO',
  //  keyTo: 'CNTRNO',
  // })
  // conInfo?: DT_CNTR_MNF_LD;

  @hasOne(() => BS_CUSTOMER, {
    keyFrom: 'CUSTOMER_CODE',
    keyTo: 'CUSTOMER_CODE',
  })
  customerInfo?: BS_CUSTOMER;
  constructor(data?: Partial<DT_ORDER>) {
    super(data);
  }
}

export interface DtOrderRelations {
  // describe navigational properties here
}

export type DtOrderWithRelations = DT_ORDER & DtOrderRelations;
