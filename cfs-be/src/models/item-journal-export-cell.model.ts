import {Entity, model, property} from '@loopback/repository';

@model()
export class ItemJournalExportCell extends Entity {
  @property({
    type: 'number',
    required: true,
  })
  RowID: number;

  @property({
    type: 'string',
    id: true,
    generated: false,
    required: true,
  })
  No_: string;

  @property({
    type: 'string',
    required: true,
  })
  ItemNo: string;

  @property({
    type: 'string',
    required: true,
  })
  Name: string;

  @property({
    type: 'string',
    required: true,
  })
  Size: string;

  @property({
    type: 'string',
    required: true,
  })
  Unit: string;

  @property({
    type: 'number',
    required: true,
  })
  NetWeight: number;

  @property({
    type: 'string',
    required: true,
  })
  LotNo: string;

  @property({
    type: 'number',
    required: true,
  })
  Amount: number;

  @property({
    type: 'number',
    required: true,
  })
  Total: number;

  @property({
    type: 'string',
    required: true,
  })
  PalletNo: string;

  @property({
    type: 'number',
    required: true,
  })
  TypeCell: number;

  @property({
    type: 'string',
    required: true,
  })
  CellNo: string;

  @property({
    type: 'number',
    required: true,
  })
  CellNewStatus: number;

  @property({
    type: 'string',
    required: true,
  })
  Description: string;

  @property({
    type: 'string',
  })
  ExpiryDate?: string;

  @property({
    type: 'string',
    required: true,
  })
  DocumentDate: string;

  @property({
    type: 'string',
    required: true,
  })
  ReceiveNo: string;

  @property({
    type: 'string',
    required: true,
  })
  PostingDate: string;

  @property({
    type: 'string',
    required: true,
  })
  UserID: string;

  @property({
    type: 'number',
    required: true,
  })
  Status: number;

  constructor(data?: Partial<ItemJournalExportCell>) {
    super(data);
  }
}

export interface ItemJournalExportCellRelations {
  // describe navigational properties here
}

export type ItemJournalExportCellWithRelations = ItemJournalExportCell & ItemJournalExportCellRelations;
