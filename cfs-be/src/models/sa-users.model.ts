import {Entity, model, property} from '@loopback/repository';
@model()
export class SA_USERS extends Entity {
  role(role: any) {
    throw new Error('Method not implemented.');
  }
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
    required: true,
    mssql: {
      columnName: 'USER_ID',
    }
  })
  Name: string;

  @property({
    type: 'string',
    required: true,
    mssql: {
      columnName: 'PASSWORD',
    }
  })
  Pass: string;

  @property({
    type: 'string',
  })
  USER_GROUP_CODE?: string;

  @property({
    type: 'string',
  })
  USER_GROUP_NAME?: string;

  @property({
    type: 'string',
  })
  USER_NUMBER?: string;

  @property({
    type: 'string',
  })
  USER_NAME?: string;

  @property({
    type: 'string',
  })
  BIRTHDAY?: string;

  @property({
    type: 'string',
  })
  ADDRESS?: string;

  @property({
    type: 'string',
  })
  TELPHONE?: string;

  @property({
    type: 'string',
  })
  EMAIL?: string;

  @property({
    type: 'boolean',
  })
  IS_ACTIVE?: boolean;

  @property({
    type: 'string',
  })
  REMARK?: string;

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

  constructor(data?: Partial<SA_USERS>) {
    super(data);
  }
}

export interface SA_USERSRelations {
  // describe navigational properties here
}

export type SA_USERSWithRelations = SA_USERS & SA_USERSRelations;
