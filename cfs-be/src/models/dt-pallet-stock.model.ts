import {Entity, hasOne, model, property} from '@loopback/repository';
import {DT_PACKAGE_STOCK} from './dt-package-stock.model';
import {JOB_STOCK} from './job-stock.model';

@model()
export class DT_PALLET_STOCK extends Entity {
  @property({
    type: 'number',
    id: true,
  })
  ID?: number;

  @property({
    type: 'string',
  })
  ROWGUID?: string;

  @property({
    type: 'number',
  })
  IDREF_STOCK?: number;

  @property({
    type: 'string'
  })
  HOUSE_BILL?: string;

  @property({
    type: 'string',
  })
  BOOKING_FWD?: string;

  @property({
    type: 'string',
  })
  PALLET_NO?: string;

  @property({
    type: 'number',
  })
  CARGO_PIECE?: number;

  @property({
    type: 'string',
  })
  UNIT_CODE?: string;

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
  SLOT?: number;

  @property({
    type: 'number',
  })
  TIER?: number;

  @property({
    type: 'string',
  })
  STATUS?: string;

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
  UPDATE_BY: string;

  @property({
    type: 'string',
  })
  UPDATE_DATE?: string;

  @hasOne(() => DT_PACKAGE_STOCK, {
    keyFrom: 'IDREF_STOCK',
    keyTo: 'ID',
  })
  packageStockInfo?: DT_PACKAGE_STOCK;

  @hasOne(() => JOB_STOCK, {
    keyFrom: 'PALLET_NO',
    keyTo: 'PALLET_NO',
  })
  jobStockInfo?: JOB_STOCK;


  constructor(data?: Partial<DT_PALLET_STOCK>) {
    super(data);
  }
}
export interface DtPalletStockRelations {

}
export type DtPalletStockWithRelations = DT_PALLET_STOCK & DtPalletStockRelations;
