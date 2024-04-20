import {Entity, hasOne, model, property} from '@loopback/repository';
import {DT_PACKAGE_MNF_LD, DtPackageMnfLdRelations} from './dt-package-mnf-ld.model';
@model()
export class DT_CNTR_MNF_LD extends Entity {
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
  TRANSPORTIDENTITY?: string;

  @property({
    type: 'string',
  })
  NUMBEROFJOURNEY?: string;

  @property({
    type: 'string',
  })
  ARRIVALDEPARTURE?: string;

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
  SEALNO?: string;

  @property({
    type: 'string',
  })
  CNTRNO?: string;

  @property({
    type: 'string',
  })
  CNTRSZTP?: string;

  @property({
    type: 'boolean',
  })
  STATUSOFGOOD?: boolean;

  @property({
    type: 'string',
  })
  ITEM_TYPE_CODE?: string;

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

  @hasOne(() => DT_PACKAGE_MNF_LD, {
    keyFrom: 'CNTRNO',
    keyTo: 'CNTRNO'
  })
  contInfor?: DT_PACKAGE_MNF_LD;

  constructor(data?: Partial<DT_CNTR_MNF_LD>) {
    super(data);
  }
}

export interface DtCntrMnfLdRelations {
  // describe navigational properties here
  contInfor?: DtPackageMnfLdRelations
}

export type DtCntrMnfLdWithRelations = DT_CNTR_MNF_LD & DtCntrMnfLdRelations;
