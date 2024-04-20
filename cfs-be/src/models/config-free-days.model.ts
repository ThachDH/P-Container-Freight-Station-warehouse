import {Entity, hasOne, model, property} from '@loopback/repository';
import {BS_CUSTOMER} from './bs-customer.model';
@model()
export class CONFIG_FREE_DAYS extends Entity {
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
  CUSTOMER_CODE?: string;

  @property({
    type: 'string',
  })
  ITEM_TYPE_CODE?: string;

  @property({
    type: 'string',
  })
  APPLY_DATE?: string;

  @property({
    type: 'string',
  })
  EXPIRE_DATE?: string;

  @property({
    type: 'string',
  })
  CLASS_CODE?: string;

  @property({
    type: 'string',
  })
  START_TIME?: string;

  @property({
    type: 'number',
  })
  FREE_DAYS?: number;

  @property({
    type: 'string',
  })
  ACC_TYPE?: string;

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

  @property({
    type: 'string',
  })
  NAME?: string;

  @hasOne(() => BS_CUSTOMER, {
    keyFrom: 'CUSTOMER_CODE',
    keyTo: 'CUSTOMER_CODE'
  })
  customerName: BS_CUSTOMER;

  constructor(data?: Partial<CONFIG_FREE_DAYS>) {
    super(data);
  }
}

export interface ConfigFreeDaysRelations {
  // describe navigational properties here
}

export type ConfigFreeDaysWithRelations = CONFIG_FREE_DAYS & ConfigFreeDaysRelations;
