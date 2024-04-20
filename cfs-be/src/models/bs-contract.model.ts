import {Entity, model, property} from '@loopback/repository';

@model()
export class BS_CONTRACT extends Entity {
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
  CUSTOMER_CODE?: string;

  @property({
    type: 'string',
  })
  CONTRACT_CODE?: string;

  @property({
    type: 'string',
  })
  CONTRACT_NAME?: string;

  @property({
    type: 'string',
  })
  FROM_DATE?: string;

  @property({
    type: 'string',
  })
  TO_DATE?: string;

  @property({
    type: 'string',
  })
  NOTE?: string;

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


  constructor(data?: Partial<BS_CONTRACT>) {
    super(data);
  }
}

export interface BsContractRelations {
  // describe navigational properties here
}

export type BsContractWithRelations = BS_CONTRACT & BsContractRelations;
