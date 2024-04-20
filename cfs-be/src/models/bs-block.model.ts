import {Entity, hasOne, model, property} from '@loopback/repository';
import {BS_WAREHOUSE} from './bs-warehouse.model';
import {DT_PALLET_STOCK} from './dt-pallet-stock.model';
@model()
export class BS_BLOCK extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: false,
  })
  ID: string;

  @property({
    type: 'string',
  })
  ROWGUID?: string;

  @property({
    type: 'string',
    required: true,
  })
  WAREHOUSE_CODE?: string;

  @property({
    type: 'string',
  })
  BLOCK?: string;

  @property({
    type: 'number',
  })
  TIER_COUNT?: number;

  @property({
    type: 'number',
  })
  SLOT_COUNT?: number;

  @property({
    type: 'number',
  })
  STATUS?: number;

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

  @hasOne(() => DT_PALLET_STOCK, {
    keyFrom: 'BLOCK',
    keyTo: 'BLOCK',
  })
  palletStockInfo?: DT_PALLET_STOCK[];

  @hasOne(() => BS_WAREHOUSE)
  Warehouse: BS_WAREHOUSE;

  constructor(data?: Partial<BS_BLOCK>) {
    super(data);
  }
}

export interface BsBlockRelations {
  // describe navigational properties here
}

export type BS_BLOCKRelations = BS_BLOCK & BsBlockRelations;
