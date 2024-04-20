import {Entity, hasOne, model, property} from '@loopback/repository';
import { BS_CUSTOMER } from './bs-customer.model';

@model()
export class CONFIG_DISCOUNT extends Entity {
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
  NAME?: string;

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
  AMT_RT?: number;

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
  ACC_TYPE?: string;

  @property({
    type: 'string',
  })
  CUSTOMER_CODE?: string;

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
    keyFrom: 'CUSTOMER_CODE',
    keyTo: 'CUSTOMER_CODE'
  })
  customerName: BS_CUSTOMER;

  constructor(data?: Partial<CONFIG_DISCOUNT>) {
    super(data);
  }
}

export interface CONFIG_DISCOUNTRelations {
  // describe navigational properties here
}

export type CONFIG_DISCOUNTWithRelations = CONFIG_DISCOUNT & CONFIG_DISCOUNTRelations;
