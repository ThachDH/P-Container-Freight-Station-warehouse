import {Entity, model, property} from '@loopback/repository';

@model()
export class BS_TRUCK extends Entity {
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
  TRUCK_NO?: string;

  @property({
    type: 'number',
  })
  WEIGHT_REGIS?: number;

  @property({
    type: 'number',
  })
  WEIGHT_REGIS_ALLOW?: number;

  @property({
    type: 'string',
  })
  TRUCK_DATE_EXP?: string;

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


  constructor(data?: Partial<BS_TRUCK>) {
    super(data);
  }
}

export interface BS_TRUCKRelations {
  // describe navigational properties here
}

export type BS_TRUCKWithRelations = BS_TRUCK & BS_TRUCKRelations;
