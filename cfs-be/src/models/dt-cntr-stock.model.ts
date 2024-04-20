import {Entity, model, property} from '@loopback/repository';

@model()
export class DT_CNTR_STOCK extends Entity {
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
    type: 'number',
  })
  CLASS_CODE?: number;

  @property({
    type: 'string',
  })
  VOYAGEKEY?: string;

  @property({
    type: 'string',
  })
  CNTRNO?: string;

  @property({
    type: 'string',
  })
  CNTRSZTP?: string;

  @property({
    type: 'string',
  })
  BILLOFLADING?: string;

  @property({
    type: 'string',
  })
  BOOKING_NO?: string;

  @property({
    type: 'string',
  })
  GET_IN?: string;

  @property({
    type: 'string',
  })
  GET_OUT?: string;

  @property({
    type: 'string',
  })
  GETOUT_TRUCK?: string;

  @property({
    type: 'string',
  })
  JOBMODE_IN?: string;

  @property({
    type: 'string',
  })
  JOBMODE_OUT?: string;

  @property({
    type: 'string',
  })
  NATUREOFTRANSPORT?: string;

  @property({
    type: 'string',
  })
  COMMODITYDESCRIPTION?: string;

  @property({
    type: 'string',
  })
  SEALNO?: string;

  @property({
    type: 'string',
  })
  CONTAINERLOCATION?: string;

  @property({
    type: 'number',
  })
  CARGO_WEIGHT?: number;

  @property({
    type: 'string',
  })
  REMARK?: string;

  @property({
    type: 'boolean',
  })
  CHK_FE?: boolean;

  @property({
    type: 'boolean',
  })
  CHK_LCL?: boolean;

  @property({
    type: 'string',
  })
  ISLOCALFOREIGN?: string;

  @property({
    type: 'string',
  })
  TLHQ?: string;

  @property({
    type: 'string',
  })
  ID_TOS?: string;

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


  constructor(data?: Partial<DT_CNTR_STOCK>) {
    super(data);
  }
}

export interface DtCntrStockRelations {
  // describe navigational properties here
}

export type DtCntrStockWithRelations = DT_CNTR_STOCK & DtCntrStockRelations;
