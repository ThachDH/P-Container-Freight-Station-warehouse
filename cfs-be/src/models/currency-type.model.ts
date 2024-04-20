import {Entity, model, property} from '@loopback/repository';

@model()
export class CURRENCY extends Entity {
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
  CURRENCY_CODE?: string;

  @property({
    type: 'string',
  })
  CURRENCY_NAME?: string;

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


  constructor(data?: Partial<CURRENCY>) {
    super(data);
  }
}

export interface CurrencyTypeRelations {
  // describe navigational properties here
}

export type CurrencyTypeWithRelations = CURRENCY & CurrencyTypeRelations;
