import {Entity, model, property} from '@loopback/repository';

@model()
export class BS_ITEM extends Entity {
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
  WAREHOUSE_CODE?: string;

  @property({
    type: 'string',
  })
  CUSTOMER_CODE?: string;

  @property({
    type: 'string',
  })
  ITEM_CODE?: string;

  @property({
    type: 'string',
  })
  ITEM_NAME?: string;

  @property({
    type: 'number',
  })
  WEIGHT?: number;

  @property({
    type: 'number',
  })
  L?: number;

  @property({
    type: 'number',
  })
  W?: number;

  @property({
    type: 'number',
  })
  H?: number;

  @property({
    type: 'string',
  })
  UNIT?: string;

  @property({
    type: 'number',
  })
  STOCK_DAYS?: number;

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


  constructor(data?: Partial<BS_ITEM>) {
    super(data);
  }
}

export interface BsItemRelations {
  // describe navigational properties here
}

export type BsItemWithRelations = BS_ITEM & BsItemRelations;
