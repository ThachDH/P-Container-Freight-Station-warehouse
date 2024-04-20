import {Entity, model, property} from '@loopback/repository';

@model()
export class TRF_CODES extends Entity {
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
  TRF_CODE?: string;

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
  CREATE_BY?: string;

  @property({
    type: 'string',
  })
  REVENUE_ACC?: string;

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


  constructor(data?: Partial<TRF_CODES>) {
    super(data);
  }
}

export interface TrfCodesRelations {
  // describe navigational properties here
}

export type TrfCodesWithRelations = TRF_CODES & TrfCodesRelations;
