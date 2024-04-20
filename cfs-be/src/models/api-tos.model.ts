import {Entity, model, property} from '@loopback/repository';

@model()
export class API_TOS extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: false,
  })
  ID?: number;

  @property({
    type: 'string',
  })
  TOS_ROWGUID?: string;

  @property({
    type: 'string',
  })
  ROWGUID?: string;

  @property({
    type: 'string',
  })
  FUNCTION_PATCH?: string;

  @property({
    type: 'string',
  })
  FUNCTION_NAME?: string;

  @property({
    type: 'string',
  })
  POST_DATA?: string;

  @property({
    type: 'string',
  })
  GET_DATA?: string;

  @property({
    type: 'boolean',
  })
  MES_STATUS?: boolean;

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

  constructor(data?: Partial<API_TOS>) {
    super(data);
  }
}

export interface ApiTosRelations {
  // describe navigational properties here
}

export type ApiTosWithRelations = API_TOS & ApiTosRelations;
