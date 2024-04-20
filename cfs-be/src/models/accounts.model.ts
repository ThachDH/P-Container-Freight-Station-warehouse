import {Entity, model, property} from '@loopback/repository';

@model()
export class ACCOUNTS extends Entity {
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
  ACC_CD?: string;

  @property({
    type: 'string',
  })
  ACC_NO?: string;

  @property({
    type: 'string',
  })
  ACC_NAME?: string;

  @property({
    type: 'string',
  })
  ACC_TYPE?: string;

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


  constructor(data?: Partial<ACCOUNTS>) {
    super(data);
  }
}

export interface AccountsRelations {
  // describe navigational properties here
}

export type AccountsWithRelations = ACCOUNTS & AccountsRelations;
