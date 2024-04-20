import {Entity, model, property} from '@loopback/repository';

@model()
export class BS_UNIT extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  ID?: number;

  @property({
    type: 'string',
  })
  UNIT_CODE?: string;

  @property({
    type: 'string',
  })
  ROWGUID?: string;

  @property({
    type: 'string',
  })
  UNIT_NAME?: string;

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


  constructor(data?: Partial<BS_UNIT>) {
    super(data);
  }
}

export interface BsUnitRelations {
  // describe navigational properties here
}

export type BsUnitWithRelations = BS_UNIT & BsUnitRelations;
