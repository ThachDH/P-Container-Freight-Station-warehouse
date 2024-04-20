import {Entity, hasOne, model, property} from '@loopback/repository';
import {BS_EQUIPMENTS_TYPE} from './bs-equipments-type.model';
@model()
export class BS_EQUIPMENTS extends Entity {
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
  EQU_CODE?: string;

  @property({
    type: 'string',
  })
  EQU_CODE_NAME?: string;

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
  WAREHOUSE_CODE?: string;

  @property({
    type: 'string',
  })
  BLOCK?: string;

  @hasOne(() => BS_EQUIPMENTS_TYPE, {
    keyFrom: 'EQU_TYPE',
    keyTo: 'EQU_TYPE',
  })
  equimentTypeInfo?: BS_EQUIPMENTS_TYPE;

  constructor(data?: Partial<BS_EQUIPMENTS>) {
    super(data);
  }
}

export interface BsEquipmentsRelations {
  // describe navigational properties here
}

export type BsEquipmentsWithRelations = BS_EQUIPMENTS & BsEquipmentsRelations;
