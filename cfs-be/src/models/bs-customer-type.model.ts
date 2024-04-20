import {Entity, model, property} from '@loopback/repository';

@model()
export class BS_CUSTOMER_TYPE extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: false,
  })
  ID: number;

  @property({
    type: 'string',
  })
  ROWGUID?: string;

  @property({
    type: 'string',
  })
  CUSTOMER_TYPE_CODE?: string;

  @property({
    type: 'string',
  })
  CUSTOMER_TYPE_NAME?: string;

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


  constructor(data?: Partial<BS_CUSTOMER_TYPE>) {
    super(data);
  }
}

export interface BsCustomerTypeRelations {
  // describe navigational properties here
}

export type BsCustomerTypeWithRelations = BS_CUSTOMER_TYPE & BsCustomerTypeRelations;
