import {Entity, hasMany, model, property} from '@loopback/repository';
import {CONFIG_ATTACH_SERVICE} from './config-attach-service.model';

@model()
export class BS_METHOD extends Entity {
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
  METHOD_CODE?: string;

  @property({
    type: 'string',
  })
  METHOD_NAME?: string;

  @property({
    type: 'string',
  })
  IS_IN_OUT?: string;

  @property({
    type: 'number',
  })
  CLASS_CODE?: number;

  @property({
    type: 'number',
    default: 0,
  })
  IS_SERVICE?: Number;

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

  @hasMany(() => CONFIG_ATTACH_SERVICE, {
    keyFrom: 'METHOD_CODE',
    keyTo: 'METHOD_CODE'
  })
  configService?: CONFIG_ATTACH_SERVICE[];

  constructor(data?: Partial<BS_METHOD>) {
    super(data);
  }
}

export interface BsMethodRelations {
  // describe navigational properties here
}

export type BsMethodWithRelations = BS_METHOD & BsMethodRelations;
