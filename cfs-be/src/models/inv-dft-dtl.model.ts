import {Entity, model, property} from '@loopback/repository';

@model()
export class INV_DFT_DTL extends Entity {
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
    type: 'number',
  })
  SEQ?: number;

  @property({
    type: 'string',
  })
  TRF_CODE?: string;

  @property({
    type: 'string',
  })
  IX_CD?: string;

  @property({
    type: 'string',
  })
  CARGO_TYPE?: string;

  @property({
    type: 'string',
  })
  SZ?: string;

  @property({
    type: 'number',
  })
  QTY?: number;

  @property({
    type: 'number',
  })
  UNIT_RATE?: number;

  @property({
    type: 'number',
  })
  AMOUNT?: number;

  @property({
    type: 'number',
  })
  DIS_RATE?: number;

  @property({
    type: 'number',
  })
  DIS_AMT?: number;

  @property({
    type: 'number',
  })
  VAT_RATE?: number;

  @property({
    type: 'number',
  })
  VAT?: number;

  @property({
    type: 'number',
  })
  TAMOUNT?: number;

  @property({
    type: 'string',
  })
  JOB_TYPE?: string;

  @property({
    type: 'string',
  })
  TRF_DESC?: string;

  @property({
    type: 'string',
  })
  INV_UNIT?: string;

  @property({
    type: 'boolean',
  })
  VAT_CHK?: boolean;

  @property({
    type: 'string',
  })
  REMARK?: string;

  @property({
    type: 'string',
  })
  CREATE_BY?: string;

  @property({
    type: 'string',
  })
  CREATE_TIME?: string;

  @property({
    type: 'string',
  })
  UPDATE_BY?: string;


  constructor(data?: Partial<INV_DFT_DTL>) {
    super(data);
  }
}

export interface InvDftDtlRelations {
  // describe navigational properties here
}

export type InvDftDtlWithRelations = INV_DFT_DTL & InvDftDtlRelations;
