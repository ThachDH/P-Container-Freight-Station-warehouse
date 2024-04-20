import {Entity, model, property} from '@loopback/repository';

@model()
export class RECEIPTS extends Entity {
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
  WAREHOUSE_CODE?: string;

  @property({
    type: 'string',
  })
  ORDER_NO?: string;

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
  RECEIPT_NO?: string;

  @property({
    type: 'string',
  })
  RECEIPT_DATE?: string;

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
  CNTRNO?: string;

  @property({
    type: 'string',
  })
  CNTRSZTP?: string;

  @property({
    type: 'string',
  })
  ITEM_TYPE_CODE?: string;

  @property({
    type: 'string',
  })
  ITEM_TYPE_CODE_CNTR?: string;

  @property({
    type: 'string',
  })
  HOUSE_BILL?: string;

  @property({
    type: 'string',
  })
  BOOKING_FWD?: string;

  @property({
    type: 'number',
  })
  ACTUAL_CARGO_PIECE?: number;

  @property({
    type: 'string',
  })
  UNIT_CODE?: string;

  @property({
    type: 'number',
  })
  CARGO_WEIGHT?: number;

  @property({
    type: 'number',
  })
  CBM?: number;

  @property({
    type: 'string',
  })
  NOTE?: string;

  @property({
    type: 'string',
  })
  VESSEL_NAME?: string;

  @property({
    type: 'string',
  })
  OWNER?: string;

  @property({
    type: 'string',
  })
  ADDRESS?: string;

  @property({
    type: 'string',
  })
  OWNER_PHONE?: string;

  @property({
    type: 'string',
  })
  PAYER?: string;

  @property({
    type: 'string',
  })
  VESSEL_BOUND?: string;

  @property({
    type: 'string',
  })
  TRUCK_NO?: string;

  @property({
    type: 'string',
  })
  COMMODITYDESCRIPTION?: string;

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

  constructor(data?: Partial<RECEIPTS>) {
    super(data);
  }
}

export interface RECEIPTSRelations {
  // describe navigational properties here
}

export type RECEIPTSWithRelations = RECEIPTS & RECEIPTSRelations;
