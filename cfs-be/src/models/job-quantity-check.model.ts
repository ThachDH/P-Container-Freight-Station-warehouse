import {Entity, hasOne, model, property} from '@loopback/repository';
import {DT_VESSEL_VISIT} from './dt-vessel-visit.model';

@model()
export class JOB_QUANTITY_CHECK extends Entity {
  // @belongsTo(() => DT_ORDER,
  //   {
  //     keyFrom: "HOUSE_BILL",
  //     keyTo: "STOCK_TAKE"
  //   }
  // )
  // STOCK_TAKE_TO_ORDER?: any;

  @property({
    type: 'number',
    id: true,
    generated: false,
  })
  ID?: number;

  @property({
    type: 'number',
  })
  ROWGUID?: number;

  @property({
    type: 'string',
  })
  WAREHOUSE_CODE?: string;

  @property({
    type: 'string',
  })
  NOTE?: string;

  @property({
    type: 'number',
  })
  CLASS_CODE?: number;

  @property({
    type: 'string',
  })
  ORDER_NO?: string;

  @property({
    type: 'string',
  })
  CNTRNO?: string;

  @property({
    type: 'string',
  })
  HOUSE_BILL?: string;

  @property({
    type: 'string',
  })
  BOOKING_NO?: string;

  @property({
    type: 'number',
    description: 'Số lượng dự kiến',
  })
  ESTIMATED_CARGO_PIECE?: number;

  // @property({
  //   type: 'string',
  //   description: "Đơn vị tính dự kiến"
  // })
  // ESTIMATED_UNIT?: string;

  // @property({
  //   type: 'number',
  //   description: "Trọng lượng dự kiến"
  // })
  // ESTIMATED_CARGO_WEIGHT?: number;

  @property({
    type: 'number',
    description: 'Số lượng thực tế',
  })
  ACTUAL_CARGO_PIECE?: number;

  @property({
    type: 'string',
    description: 'Đơn vị tính thực tế',
  })
  ACTUAL_UNIT?: string;

  @property({
    type: 'number',
    description: 'Trọng lượng thực tế',
  })
  ACTUAL_CARGO_WEIGHT?: number;

  @property({
    type: 'number',
    description: 'thứ tự kiểm đếm - theo housebill',
  })
  SEQ?: number;

  @property({
    type: 'string',
    description: 'Số pallet',
  })
  PALLET_NO?: string;

  @property({
    type: 'string',
  })
  START_DATE?: string;

  @property({
    type: 'string',
  })
  FINISH_DATE?: string;

  @property({
    type: 'boolean',
  })
  IS_FINAL?: boolean;

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

  @property({
    type: 'string',
  })
  PIN_CODE?: string;

  @property({
    type: 'string',
  })
  BOOKING_FWD?: string;

  @property({
    type: 'string',
  })
  JOB_STATUS?: string;

  @property({
    type: 'string',
  })
  VOYAGEKEY?: string;

  @property({
    type: 'string',
  })
  METHOD_CODE?: string;

  @property({
    type: 'string',
  })
  TRUCK_NO?: string;

  @property({
    type: 'string',
  })
  ITEM_TYPE_CODE?: string;

  @hasOne(() => DT_VESSEL_VISIT, {
    keyFrom: 'VOYAGEKEY',
    keyTo: 'VOYAGEKEY',
  })
  vesselInfo?: DT_VESSEL_VISIT;

  constructor(data?: Partial<JOB_QUANTITY_CHECK>) {
    super(data);
  }
}

export interface QuantityCheckRelations {
  // describe navigational properties here
}

export type QuantityCheckWithRelations = JOB_QUANTITY_CHECK &
  QuantityCheckRelations;
