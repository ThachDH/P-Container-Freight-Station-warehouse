import {Entity, model, property} from '@loopback/repository';

@model()
export class JOB_STOCK extends Entity {
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
  VOYAGEKEY?: string;

  @property({
    type: 'string',
  })
  WAREHOUSE_CODE?: string;

  @property({
    type: 'number',
  })
  CLASS_CODE?: number;

  @property({
    type: 'string',
  })
  JOB_TYPE?: string;

  @property({
    type: 'string',
  })
  HOUSE_BILL?: string;

  @property({
    type: 'string',
  })
  BOOKING_FWD?: string;

  @property({
    type: 'string',
  })
  ORDER_NO?: string;

  @property({
    type: 'string',
  })
  PIN_CODE?: string;

  @property({
    type: 'string',
  })
  PALLET_NO?: string;

  @property({
    type: 'number',
  })
  SEQ?: number;

  @property({
    type: 'number',
  })
  ACTUAL_CARGO_PIECE?: number;

  @property({
    type: 'string',
  })
  ACTUAL_UNIT?: string;

  @property({
    type: 'number',
  })
  ACTUAL_CARGO_WEIGHT?: number;

  @property({
    type: 'string',
  })
  BLOCK?: string;

  @property({
    type: 'number',
  })
  SLOT?: number;

  @property({
    type: 'number',
  })
  TIER?: number;

  @property({
    type: 'string',
  })
  JOB_STATUS?: string;

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

  constructor(data?: Partial<JOB_STOCK>) {
    super(data);
  }
}

export interface JobStockRelations {
  // describe navigational properties here
}

export type JobStockWithRelations = JOB_STOCK & JobStockRelations;
