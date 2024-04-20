import {Entity, model, property} from '@loopback/repository';

@model()
export class BS_GATE extends Entity {
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
  GATE_CODE?: string;

  @property({
    type: 'string',
  })
  GATE_NAME?: string;

  @property({
    type: 'string',
  })
  IS_IN_OUT?: string;

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


  constructor(data?: Partial<BS_GATE>) {
    super(data);
  }
}

export interface BsGateRelations {
  // describe navigational properties here
}

export type BsGateWithRelations = BS_GATE & BsGateRelations;
