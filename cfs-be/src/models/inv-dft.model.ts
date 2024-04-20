import {Entity, hasOne, model, property} from '@loopback/repository';
import { BS_CUSTOMER } from './bs-customer.model';

@model()
export class INV_DFT extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  ID?: number;

  @property({
    type: 'string',
  })
  ROWGUID?: string;

  @property({
    type: 'string',
  })
  DRAFT_INV_NO?: string;

  @property({
    type: 'string',
  })
  INV_NO?: string;

  @property({
    type: 'string',
  })
  DRAFT_INV_DATE?: string;

  @property({
    type: 'string',
  })
  REF_NO?: string;

  @property({
    type: 'string',
  })
  PAYER_TYPE?: string;

  @property({
    type: 'string',
  })
  PAYER?: string;

  @property({
    type: 'number',
  })
  AMOUNT?: number;

  @property({
    type: 'number',
  })
  VAT?: number;

  @property({
    type: 'number',
  })
  DIS_AMT?: number;

  @property({
    type: 'string',
  })
  REMARK?: string;

  @property({
    type: 'string',
  })
  PAYMENT_STATUS?: string;

  @property({
    type: 'string',
  })
  CURRENCYID?: string;

  @property({
    type: 'number',
  })
  RATE?: number;

  @property({
    type: 'string',
  })
  INV_TYPE?: string;

  @property({
    type: 'string',
  })
  TPLT_NM?: string;

  @property({
    type: 'string',
  })
  IS_MANUAL_INV?: string;

  @property({
    type: 'number',
  })
  TAMOUNT?: number;

  @property({
    type: 'string',
  })
  CREATE_BY?: string;

  @property({
    type: 'string',
  })
  CREATE_TIME?: string;

  @hasOne(() => BS_CUSTOMER, {
    keyFrom: 'PAYER',
    keyTo: 'CUSTOMER_CODE',
  })
  customerInfo?: BS_CUSTOMER;

  @property({
    type: 'string',
  })
  UPDATE_BY?: string;


  constructor(data?: Partial<INV_DFT>) {
    super(data);
  }
}

export interface InvDftRelations {
  // describe navigational properties here
}

export type InvDftWithRelations = INV_DFT & InvDftRelations;
