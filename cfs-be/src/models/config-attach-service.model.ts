import {Entity, model, property} from '@loopback/repository';

@model()
export class CONFIG_ATTACH_SERVICE extends Entity {
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
  VOYAGEKEY?: string;

  @property({
    type: 'string',
  })
  CUSTOMER_CODE?: string;

  @property({
    type: 'string',
  })
  METHOD_CODE?: string;

  @property({
    type: 'string',
  })
  ATTACH_SERVICE_CODE?: string;

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


  constructor(data?: Partial<CONFIG_ATTACH_SERVICE>) {
    super(data);
  }
}

export interface CONFIG_ATTACH_SERVICERelations {
  // describe navigational properties here
}

export type CONFIG_ATTACH_SERVICEWithRelations = CONFIG_ATTACH_SERVICE & CONFIG_ATTACH_SERVICERelations;
