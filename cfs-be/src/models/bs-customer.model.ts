import {Entity, model, property} from '@loopback/repository';

@model()
export class BS_CUSTOMER extends Entity {
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
  CUSTOMER_CODE?: string;

  @property({
    type: 'string',
  })
  CUSTOMER_NAME?: string;

  @property({
    type: 'string',
  })
  ACC_TYPE?: string;

  @property({
    type: 'string',
  })
  ADDRESS?: string;

  @property({
    type: 'string',
  })
  TAX_CODE?: string;

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


  constructor(data?: Partial<BS_CUSTOMER>) {
    super(data);
  }
}

export interface BsCustomerRelations {
  // describe navigational properties here
}

export type BsCustomerWithRelations = BS_CUSTOMER & BsCustomerRelations;
