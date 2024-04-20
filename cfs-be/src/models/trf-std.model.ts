import {Entity, model, property} from '@loopback/repository';

@model()
export class TRF_STD extends Entity {
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
  CLASS_CODE?: string;

  @property({
    type: 'string',
  })
  METHOD_CODE?: string;

  @property({
    type: 'string',
  })
  ITEM_TYPE_CODE?: string;

  @property({
    type: 'string',
  })
  CURRENCY_CODE?: string;

  @property({
    type: 'number',
  })
  AMT_MIN20?: number;

  @property({
    type: 'number',
  })
  AMT_MIN40?: number;

  @property({
    type: 'number',
  })
  AMT_MIN45?: number;

  @property({
    type: 'number',
  })
  AMT_RT?: number;

  @property({
    type: 'number',
  })
  AMT_NON?: number;

  @property({
    type: 'number',
  })
  VAT?: number;

  @property({
    type: 'number',
  })
  INCLUDE_VAT?: number;

  @property({
    type: 'string',
  })
  FROM_DATE?: string;

  @property({
    type: 'string',
  })
  TO_DATE?: string;

  @property({
    type: 'string',
  })
  TRF_NAME?: string;

  @property({
    type: 'string',
  })
  TRF_TEMP?: string;

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


  constructor(data?: Partial<TRF_STD>) {
    super(data);
  }
}

export interface TrfStdRelations {
  // describe navigational properties here
}

export type TrfStdWithRelations = TRF_STD & TrfStdRelations;
