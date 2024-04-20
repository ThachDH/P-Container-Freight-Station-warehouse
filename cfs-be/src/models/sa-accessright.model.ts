import {Entity, model, property} from '@loopback/repository';

@model()
export class SA_ACCESSRIGHT extends Entity {
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
  GROUP_MENU_CODE?: string;

  @property({
    type: 'string',
  })
  GROUP_MENU_NAME?: string;

  @property({
    type: 'string',
  })
  MENU_CODE?: string;

  @property({
    type: 'string',
  })
  MENU_NAME?: string;

  @property({
    type: 'boolean',
  })
  IS_VIEW?: boolean;

  @property({
    type: 'boolean',
  })
  IS_ADD_NEW?: boolean;

  @property({
    type: 'boolean',
  })
  IS_MODIFY?: boolean;

  @property({
    type: 'boolean',
  })
  IS_DELETE?: boolean;

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

  constructor(data?: Partial<SA_ACCESSRIGHT>) {
    super(data);
  }
}

export interface SA_ACCESSRIGHTRelations {
  // describe navigational properties here
  // menu?: SA_MENURelations;
}

export type SA_ACCESSRIGHTWithRelations = SA_ACCESSRIGHT & SA_ACCESSRIGHTRelations;
