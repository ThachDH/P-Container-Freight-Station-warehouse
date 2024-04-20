import {Entity, model, property} from '@loopback/repository';

@model()
export class CONFIG_MIN_VALUE extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: false,
  })
  ID?: number;

  @property({
    type: 'string',
  })
  ROWGUID?: string;

  @property({
    type: 'string',
  })
  CNTRSZTP?: string;

  @property({
    type: 'string',
  })
  UNIT_INVOICE?: string;

  @property({
    type: 'number',
  })
  MIN_VALUE?: number;

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


  constructor(data?: Partial<CONFIG_MIN_VALUE>) {
    super(data);
  }
}

export interface ConfigMinValueRelations {
  // describe navigational properties here
}

export type ConfigMinValueWithRelations = CONFIG_MIN_VALUE & ConfigMinValueRelations;
