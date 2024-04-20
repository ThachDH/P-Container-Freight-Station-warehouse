import {Entity, model, property} from '@loopback/repository';

@model()
export class BS_ROMOOC extends Entity {
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
  REMOOC_NO?: string;

  @property({
    type: 'number',
  })
  REMOOC_WEIGHT?: number;

  @property({
    type: 'number',
  })
  REMOOC_WEIGHT_REGIS?: number;

  @property({
    type: 'string',
  })
  REMOOC_DATE_EXP?: string;

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


  constructor(data?: Partial<BS_ROMOOC>) {
    super(data);
  }
}

export interface BS_ROMOOCRelations {
  // describe navigational properties here
}

export type BS_ROMOOCWithRelations = BS_ROMOOC & BS_ROMOOCRelations;
