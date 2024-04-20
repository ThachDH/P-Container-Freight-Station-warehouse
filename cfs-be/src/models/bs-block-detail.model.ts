import {Entity, model, property} from '@loopback/repository';

@model()
export class BS_BLOCK_DETAILS extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: false,
    required: true,
  })
  ID: string;

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
  BLOCK?: string;

  @property({
    type: 'number',
  })
  TIER_COUNT?: number;

  @property({
    type: 'number',
  })
  SLOT_COUNT?: number;

  @property({
    type: 'number',
  })
  STATUS?: number;

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


  constructor(data?: Partial<BS_BLOCK_DETAILS>) {
    super(data);
  }
}

export interface BsBlockDetailRelations {
  // describe navigational properties here
}

export type BS_BLOCKDetailsRelations = BS_BLOCK_DETAILS & BsBlockDetailRelations;
