import {Entity, model, property} from '@loopback/repository';

@model()
export class INV_VAT extends Entity {
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
  INV_NO?: string;

  @property({
    type: 'string',
  })
  INV_DATE?: string;

  @property({
    type: 'string',
  })
  VOYAGEKEY?: string;

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
  LOCAL_INV?: string;

  @property({
    type: 'number',
  })
  TAMOUNT?: number;

  @property({
    type: 'string',
  })
  ACC_CD?: string;

  @property({
    type: 'string',
  })
  IS_POSTED?: string;

  @property({
    type: 'string',
  })
  INV_PREFIX?: string;

  @property({
    type: 'string',
  })
  INV_NO_PRE?: string;

  @property({
    type: 'string',
  })
  CANCEL_DATE?: string;

  @property({
    type: 'string',
  })
  CANCLE_REMARK?: string;

  @property({
    type: 'string',
  })
  CANCLE_BY?: string;

  @property({
    type: 'string',
  })
  ISDFT_TO_INV?: string;

  @property({
    type: 'string',
  })
  PIN_CODE?: string;

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


  constructor(data?: Partial<INV_VAT>) {
    super(data);
  }
}

export interface IntVatRelations {
  // describe navigational properties here
}

export type IntVatWithRelations = INV_VAT & IntVatRelations;
