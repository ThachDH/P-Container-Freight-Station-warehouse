import {Entity, model, property} from '@loopback/repository';

@model()
export class BS_WAREHOUSE extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: false,
  })
  ID?: string;

  @property({
    type: 'string',
  })
  ROWGUID?: string;

  @property({
    type: 'string',
    required: true,
  })
  WAREHOUSE_CODE: string;

  @property({
    type: 'string',
  })
  WAREHOUSE_NAME?: string;

  @property({
    type: 'number',
  })
  ACREAGE?: number;

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


  constructor(data?: Partial<BS_WAREHOUSE>) {
    super(data);
  }
}

export interface BsWareHouseRelations {
  // describe navigational properties here
}

export type BS_BLOCKRelations = BS_WAREHOUSE & BsWareHouseRelations;
