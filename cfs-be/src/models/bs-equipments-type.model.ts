import {Entity, model, property} from '@loopback/repository';

@model()
export class BS_EQUIPMENTS_TYPE extends Entity {
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
  EQU_TYPE?: string;

  @property({
    type: 'string',
  })
  EQU_TYPE_NAME?: string;

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


  constructor(data?: Partial<BS_EQUIPMENTS_TYPE>) {
    super(data);
  }
}

export interface BsEquipmentsTypeRelations {
  // describe navigational properties here
}

export type BsEquipmentsTypeWithRelations = BS_EQUIPMENTS_TYPE & BsEquipmentsTypeRelations;
