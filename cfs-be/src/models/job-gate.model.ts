import {Entity, hasOne, model, property} from '@loopback/repository';
import {BS_ROMOOC} from './bs-romooc.model';
import {BS_TRUCK} from './bs-truck.model';
import {DT_VESSEL_VISIT} from './dt-vessel-visit.model';

@model()
export class JOB_GATE extends Entity {
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
    type: 'number',
  })
  CLASS_CODE?: number;

  @property({
    type: 'string',
  })
  METHOD_CODE?: string;

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
  GATE_CODE?: string;

  @property({
    type: 'string',
  })
  IS_IN_OUT?: string;

  @property({
    type: 'string',
  })
  DRIVER?: string;

  @property({
    type: 'string',
  })
  TEL?: string;

  @property({
    type: 'string',
  })
  TRUCK_NO?: string;

  @property({
    type: 'number',
  })
  WEIGHT_REGIS?: number;

  @property({
    type: 'number',
  })
  WEIGHT_REGIS_ALLOW?: number;

  @property({
    type: 'number',
  })
  REMOOC_WEIGHT?: number;

  @property({
    type: 'number',
  })
  REMOOC_WEIGHT_REGIS?: number;

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
  HOUSE_BILL?: string;

  @property({
    type: 'string',
  })
  BOOKING_NO?: string;

  @property({
    type: 'string',
  })
  NOTE?: string;

  @property({
    type: 'string',
  })
  CUSTOMER_CODE?: string;

  @property({
    type: 'string',
  })
  TIME_IN?: string;

  @property({
    type: 'string',
  })
  TIME_OUT?: string;

  @property({
    type: 'boolean',
  })
  IS_SUCCESS_IN?: boolean;

  @property({
    type: 'boolean',
  })
  IS_SUCCESS_OUT?: boolean;

  @property({
    type: 'boolean',
  })
  VGM?: boolean;

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
  REMOOC_NO?: string;

  @property({
    type: 'string',
  })
  BILLOFLADING?: string;

  @property({
    type: 'string',
  })
  BOOKING_FWD?: string;

  @property({
    type: 'number',
  })
  CARGO_PIECE?: number;

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
    type: 'number'
  })
  QUANTITY_CHK: number;

  @hasOne(() => BS_TRUCK, {
    keyFrom: 'TRUCK_NO',
    keyTo: 'TRUCK_NO',
  })
  bsTruck?: BS_TRUCK;

  @hasOne(() => BS_ROMOOC, {
    keyFrom: 'REMOOC_NO',
    keyTo: 'REMOOC_NO',
  })
  bsRemooc?: BS_ROMOOC;

  @hasOne(() => DT_VESSEL_VISIT, {
    keyFrom: 'VOYAGEKEY',
    keyTo: 'VOYAGEKEY',
  })
  vesselInfo?: DT_VESSEL_VISIT;

  constructor(data?: Partial<JOB_GATE>) {
    super(data);
  }
}

export interface JobGateRelations {
  // describe navigational properties here
}

export type JobGateWithRelations = JOB_GATE & JobGateRelations;
