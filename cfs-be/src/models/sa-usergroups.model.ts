import {Entity, model, property} from '@loopback/repository';

@model()
export class SA_USERGROUPS extends Entity {
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
  USER_GROUP_CODE?: string;

  @property({
    type: 'string',
  })
  USER_GROUP_NAME?: string;

  @property({
    type: 'number',
  })
  USER_GROUP_RANK?: number;

  @property({
    type: 'string',
  })
  APP_CODE?: string;

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


  constructor(data?: Partial<SA_USERGROUPS>) {
    super(data);
  }
}

export interface SA_USERGROUPSRelations {
  // describe navigational properties here
}

export type SA_USERGROUPSWithRelations = SA_USERGROUPS & SA_USERGROUPSRelations;
