import {Entity, model, property} from '@loopback/repository';

@model()
export class BS_ITEM_TYPE extends Entity {

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
  ITEM_TYPE_CODE?: string;

  @property({
    type: 'string',
  })
  ITEM_TYPE_NAME?: string;

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


  constructor(data?: Partial<BS_ITEM_TYPE>) {
    super(data);
  }
}

export interface BsItemTypeRelations {
  // describe navigational properties here
}

export type BsItemTypeWithRelations = BS_ITEM_TYPE & BsItemTypeRelations;
