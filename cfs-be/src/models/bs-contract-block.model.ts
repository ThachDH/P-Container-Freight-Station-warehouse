import {Entity, model, property} from '@loopback/repository';

@model()
export class BS_CONTRACT_BLOCK extends Entity {
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
  CONTRACT_CODE?: string;

  @property({
    type: 'string',
  })
  WAREHOUSE_CODE?: string;

  @property({
    type: 'string',
  })
  BLOCK?: string;

  @property({
    type: 'number',
  })
  ACREAGE?: number;

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


  constructor(data?: Partial<BS_CONTRACT_BLOCK>) {
    super(data);
  }
}

export interface BsContractBlockRelations {
  // describe navigational properties here
}

export type BsContractBlockWithRelations = BS_CONTRACT_BLOCK & BsContractBlockRelations;
