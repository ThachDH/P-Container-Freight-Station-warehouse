import {Entity, model, property} from '@loopback/repository';

@model()
export class DT_VESSEL_VISIT extends Entity {
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
  VESSEL_NAME?: string;

  @property({
    type: 'string',
  })
  INBOUND_VOYAGE?: string;

  @property({
    type: 'string',
  })
  OUTBOUND_VOYAGE?: string;

  @property({
    type: 'string',
  })
  ETA?: string;

  @property({
    type: 'string',
  })
  ETD?: string;

  @property({
    type: 'string',
  })
  CallSign?: string;

  @property({
    type: 'string',
  })
  IMO?: string;

  @property({
    type: 'string',
  })
  TOS_SHIPKEY?: string;

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


  constructor(data?: Partial<DT_VESSEL_VISIT>) {
    super(data);
  }
}

export interface DtVesselVisitRelations {
  // describe navigational properties here
}

export type DtVesselVisitWithRelations = DT_VESSEL_VISIT & DtVesselVisitRelations;
