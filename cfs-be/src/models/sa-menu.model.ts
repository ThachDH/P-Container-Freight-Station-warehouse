import {Entity, hasMany, model, property} from '@loopback/repository';
import {SA_ACCESSRIGHT} from './sa-accessright.model';

@model()
export class SA_MENU extends Entity {
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
  GROUP_MENU_CODE?: string;

  @property({
    type: 'string',
  })
  GROUP_MENU_NAME?: string;

  @property({
    type: 'string',
  })
  PARENT_CODE?: string;

  @property({
    type: 'string',
  })
  MENU_CODE?: string;

  @property({
    type: 'string',
  })
  MENU_NAME?: string;

  @property({
    type: 'string',
  })
  MENU_ICON?: string;

  @property({
    type: 'string',
  })
  VIEW_CLASS?: string;

  @property({
    type: 'string',
  })
  VIEW_PAGE?: string;

  @property({
    type: 'boolean',
  })
  IS_VISIBLE?: boolean;

  @property({
    type: 'number',
  })
  ORDER_BY?: number;

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

  @hasMany(() => SA_ACCESSRIGHT, {
    keyFrom: 'PARENT_CODE',
    keyTo: 'GROUP_MENU_CODE'
  })
  lstMenu: SA_ACCESSRIGHT[];

  constructor(data?: Partial<SA_MENU>) {
    super(data);
  }
}

export interface SA_MENURelations {
  // describe navigational properties here
}

export type SA_MENUWithRelations = SA_MENU & SA_MENURelations;
