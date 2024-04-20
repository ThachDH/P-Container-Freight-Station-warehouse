import { JSONObject } from '@loopback/core';
import { repository } from '@loopback/repository';
import {
  post, requestBody
} from '@loopback/rest';
import moment from 'moment';
import { BS_BLOCKRepository, BS_TRUCKRepository, BS_WareHouseRepository, JOB_GATERepository, JOB_STOCKRepository } from '../repositories';
import { BsEquipmentsRepository } from '../repositories/bs-equipments.repository';
import { BsGateRepository } from '../repositories/bs-gate.repository';
import { BS_METHODRepository } from '../repositories/bs-method.repository';
import { JOB_QUANTITY_CHECKRepository } from '../repositories/job-quantity-check.repository';
const spec = {
  responses: {
    '200': {
      description: 'EXECUTIVESUPERVISION list with filter',
      content: {
        'application/json': {
          schema: {},
        },
      },
    }
  }
}

export class EXECUTIVESUPERVISIONController {
  constructor(
    @repository(BS_METHODRepository)
    public BS_METHODRepo: BS_METHODRepository,
    @repository(BsGateRepository)
    public BsGateRepo: BsGateRepository,
    @repository(JOB_GATERepository)
    public jobGateRepo: JOB_GATERepository,
    @repository(BS_TRUCKRepository)
    public BS_TRUCKRepo: BS_TRUCKRepository,
    @repository(JOB_QUANTITY_CHECKRepository)
    public jobQuantityCheck: JOB_QUANTITY_CHECKRepository,
    @repository(JOB_STOCKRepository)
    public stockRepo: JOB_STOCKRepository,
    @repository(BS_WareHouseRepository)
    public BS_WareHouseRepo: BS_WareHouseRepository,
    @repository(BS_BLOCKRepository)
    public BS_BLOCKRepo: BS_BLOCKRepository,
    @repository(BsEquipmentsRepository)
    public bsEquipmentsRepository: BsEquipmentsRepository,
    @repository(BsGateRepository)
    public bsGateRepository: BsGateRepository,
  ) { }

  public response: any = {
    Status: false,
    Payload: [],
    Message: ""
  };

  //Thoilc(*Note)-Lọc dữ liệu giám sát cổng
  @post('/executive-supervision/filterportControl', spec)
  async filterportControl(
    @requestBody() jobGate: JSONObject
  ): Promise<any> {
    let whereObj: any = {
      // [jobGate.CLASS_CODE === 1 ? 'HOUSE_BILL' : 'BOOKING_FWD']: jobGate.CLASS_CODE === 1 ? jobGate.HOUSE_BILL : jobGate.BOOKING_FWD,
    };
    jobGate.ORDER_NO ? whereObj['ORDER_NO'] = jobGate.ORDER_NO : '';
    jobGate.CNTRNO ? whereObj['CNTRNO'] = jobGate.CNTRNO : '';
    jobGate.TRUCK_NO ? whereObj['TRUCK_NO'] = jobGate.TRUCK_NO : '';
    jobGate.METHOD_CODE ? whereObj['METHOD_CODE'] = jobGate.METHOD_CODE : '';
    jobGate.IS_IN_OUT ? whereObj['IS_IN_OUT'] = jobGate.IS_IN_OUT : '';
    jobGate.CLASS_CODE ? whereObj['CLASS_CODE'] = jobGate.CLASS_CODE : '';
    jobGate.HOUSE_BILL ? whereObj['HOUSE_BILL'] = jobGate.HOUSE_BILL : '';
    jobGate.BOOKING_FWD ? whereObj['BOOKING_FWD'] = jobGate.BOOKING_FWD : '';
    return await this.jobGateRepo.find({
      include: [
        {
          relation: 'vesselInfo',
          scope: {
            fields: ['INBOUND_VOYAGE', 'OUTBOUND_VOYAGE', 'ETA', 'ETD', 'VESSEL_NAME']
          }
        },
      ],
      fields: ['ORDER_NO', 'CNTRNO', 'HOUSE_BILL', 'BOOKING_FWD', 'METHOD_CODE', 'VOYAGEKEY', 'CLASS_CODE', 'TIME_IN', 'TIME_OUT', 'IS_IN_OUT', 'QUANTITY_CHK'],
      where: {
        and: [
          { IS_SUCCESS_OUT: true },
          whereObj
        ]
      }
    })
      .then((data: any) => {
        if (data.length) {
          let dataAll: any = data.map((item: any) => {
            return {
              ORDER_NO: item.ORDER_NO,
              CNTRNO: item.CNTRNO,
              [item.CLASS_CODE === 1 ? 'HOUSE_BILL' : 'BOOKING_FWD']: item.CLASS_CODE === 1 ? item.HOUSE_BILL : item.BOOKING_FWD,
              METHOD_CODE: item.METHOD_CODE,
              VOYAGEKEY: item.VOYAGEKEY,
              [item.CLASS_CODE === 1 ? 'INBOUND_VOYAGE' : 'OUTBOUND_VOYAGE']: item.CLASS_CODE === 1 ? item.vesselInfo?.INBOUND_VOYAGE : item.vesselInfo?.OUTBOUND_VOYAGE,
              [item.CLASS_CODE === 1 ? 'ETA' : 'ETD']: item.CLASS_CODE === 1 ? moment(item.vesselInfo?.ETA).format("DD/MM/YYYY HH:mm:ss") : moment(item.vesselInfo?.ETD).format("DD/MM/YYYY HH:mm:ss"),
              CLASS_CODE: item.CLASS_CODE,
              TIME_IN: moment(item.TIME_IN).format("DD/MM/YYYY HH:mm:ss"),
              IS_IN_OUT: item.IS_IN_OUT,
              QUANTITY_CHK: item.QUANTITY_CHK,
              NOTE: item.NOTE,
              VESSEL_NAME: item.vesselInfo?.VESSEL_NAME
            };
          });
          this.response['Status'] = true;
          this.response['Payload'] = dataAll;
          this.response['Message'] = 'Load dữ liệu thành công!';
          return this.response;
        } else {
          this.response['Status'] = false;
          this.response['Payload'] = [];
          this.response['Message'] = 'Không tìm thấy dữ liệu!';
          return this.response;
        }
      });
  }

  //Thoilc(*Note)-View dữ liệu điều kiện lọc
  @post('/executive-supervision/viewData', spec)
  async viewData(): Promise<any> {
    let bsWarehouse: any = await this.BS_WareHouseRepo.find({
      fields: ['WAREHOUSE_CODE', 'WAREHOUSE_NAME']
    });
    let bsMethod: any = await this.BS_METHODRepo.find({
      fields: ['METHOD_CODE', 'METHOD_NAME'],
      where: { IS_SERVICE: 0 }
    });
    let bsGate: any = await this.BsGateRepo.find({
      fields: ['GATE_CODE', 'GATE_NAME']
    });

    this.response['Status'] = true;
    this.response['Payload'] = { bsWarehouse: bsWarehouse, bsMethod: bsMethod, bsGate: bsGate };
    this.response['Message'] = 'Load dữ liệu thành công!';
    return this.response;
  }

  //Thoilc(*Note)-Lọc dữ liệu kiểm đếm
  @post('/executive-supervision/filterCheck', spec)
  async filterCheck(
    @requestBody() checkQuantity: any,
  ): Promise<any> {
    if (!checkQuantity.WAREHOUSE_CODE) {
      this.response['Status'] = false;
      this.response['Message'] = `Vui lòng cung cấp mã kho!`;
      return this.response;
    }

    let whereObj: any = {
      WAREHOUSE_CODE: checkQuantity.WAREHOUSE_CODE
    };
    checkQuantity.WAREHOUSE_CODE ? whereObj['WAREHOUSE_CODE'] = checkQuantity.WAREHOUSE_CODE : '';
    checkQuantity.CNTRNO ? whereObj['CNTRNO'] = checkQuantity.CNTRNO : '';
    checkQuantity.TRUCK_NO ? whereObj['TRUCK_NO'] = checkQuantity.TRUCK_NO : '';
    checkQuantity.CLASS_CODE ? whereObj['CLASS_CODE'] = checkQuantity.CLASS_CODE : '';
    checkQuantity.METHOD_CODE ? whereObj['METHOD_CODE'] = checkQuantity.METHOD_CODE : '';
    checkQuantity.PALLET_NO ? whereObj['PALLET_NO'] = checkQuantity.PALLET_NO : '';
    checkQuantity.HOUSE_BILL ? whereObj['HOUSE_BILL'] = checkQuantity.HOUSE_BILL : '';
    checkQuantity.BOOKING_FWD ? whereObj['BOOKING_FWD'] = checkQuantity.BOOKING_FWD : '';
    return await this.jobQuantityCheck.find({
      include: [
        {
          relation: 'vesselInfo',
          scope: {
            fields: ['INBOUND_VOYAGE', 'OUTBOUND_VOYAGE', 'ETA', 'ETD', 'VESSEL_NAME']
          }
        },
      ],
      fields: ['WAREHOUSE_CODE', 'TRUCK_NO', 'CNTRNO', 'HOUSE_BILL', 'BOOKING_FWD', 'CLASS_CODE', 'METHOD_CODE', 'ESTIMATED_CARGO_PIECE', 'ACTUAL_CARGO_PIECE', 'VOYAGEKEY', 'SEQ', 'ID'],
      where: {
        and: [
          whereObj,
          { JOB_STATUS: 'A' }
        ]
      },
      order: ['HOUSE_BILL', 'BOOKING_FWD', 'SEQ']
    })
      .then((data: any) => {
        if (data.length) {
          let dataAll: any = data.map((item: any) => {
            return {
              ID : item.ID,
              WAREHOUSE_CODE: item.WAREHOUSE_CODE,
              TRUCK_NO: item.TRUCK_NO,
              CNTRNO: item.CNTRNO,
              [item.CLASS_CODE === 1 ? 'HOUSE_BILL' : 'BOOKING_FWD']: item.CLASS_CODE === 1 ? item.HOUSE_BILL : item.BOOKING_FWD,
              ESTIMATED_CARGO_PIECE: item.ESTIMATED_CARGO_PIECE,
              ACTUAL_CARGO_PIECE: item.ACTUAL_CARGO_PIECE,
              SEQ: item.SEQ,
              METHOD_CODE: item.METHOD_CODE,
              VOYAGEKEY: item.VOYAGEKEY,
              VESSEL_NAME: item.vesselInfo?.VESSEL_NAME,
              CLASS_CODE: item.CLASS_CODE,
              [item.CLASS_CODE === 1 ? 'INBOUND_VOYAGE' : 'OUTBOUND_VOYAGE']: item.CLASS_CODE === 1 ? item.vesselInfo?.INBOUND_VOYAGE : item.vesselInfo?.OUTBOUND_VOYAGE,
              [item.CLASS_CODE === 1 ? 'ETA' : 'ETD']: item.CLASS_CODE === 1 ? moment(item.vesselInfo?.ETA).format("DD/MM/YYYY HH:mm:ss") : moment(item.vesselInfo?.ETD).format("DD/MM/YYYY HH:mm:ss"),
            };
          });
          this.response['Status'] = true;
          this.response['Payload'] = dataAll;
          this.response['Message'] = 'Load dữ liệu thành công!';
          return this.response;
        } else {
          this.response['Status'] = false;
          this.response['Payload'] = [];
          this.response['Message'] = 'Không tìm thấy dữ liệu!';
          return this.response;
        }
      });
  }

  @post('/executive-supervision/viewAllDevice', spec)
  async view(): Promise<any> {
    let deviceList = await this.bsEquipmentsRepository.find()
    let gateList = await this.bsGateRepository.find()
    return {
      device: deviceList,
      gate: gateList,
    }
  }


  //Thoilc(*Note)-Lọc dữ liệu xe nâng
  @post('/executive-supervision/filterJobStock', spec)
  async filterJobStock(
    @requestBody() jobStock: any,
  ): Promise<any> {
    let whereObj: any = {
      // [jobStock.CLASS_CODE === 1 ? 'HOUSE_BILL' : 'BOOKING_FWD']: jobStock.CLASS_CODE === 1 ? jobStock.HOUSE_BILL : jobStock.BOOKING_FWD,
    };
    jobStock.WAREHOUSE_CODE ? whereObj['WAREHOUSE_CODE'] = jobStock.WAREHOUSE_CODE : '';
    jobStock.BLOCK ? whereObj['BLOCK'] = jobStock.BLOCK : '';
    jobStock.PALLET_NO ? whereObj['PALLET_NO'] = jobStock.PALLET_NO : '';
    jobStock.JOB_TYPE ? whereObj['JOB_TYPE'] = jobStock.JOB_TYPE : '';
    jobStock.JOB_STATUS ? whereObj['JOB_STATUS'] = jobStock.JOB_STATUS : '';
    jobStock.HOUSE_BILL ? whereObj['HOUSE_BILL'] = jobStock.HOUSE_BILL : '';
    jobStock.BOOKING_FWD ? whereObj['BOOKING_FWD'] = jobStock.BOOKING_FWD : '';
    return await this.stockRepo.find({
      fields: ['WAREHOUSE_CODE', 'BLOCK', 'PALLET_NO', 'JOB_TYPE', 'JOB_STATUS', 'CREATE_DATE', 'CLASS_CODE', 'HOUSE_BILL', 'BOOKING_FWD','ID'],
      where: {
        and: [
          whereObj,
          { JOB_STATUS: 'A' }
        ]
      },

    })
      .then((data: any) => {
        if (data.length) {
          let dataAll: any = data.map((item: any) => {
            return {
              ID : item.ID,
              WAREHOUSE_CODE: item.WAREHOUSE_CODE,
              CLASS_CODE: item.CLASS_CODE,
              BLOCK: item.BLOCK,
              [item.CLASS_CODE === 1 ? 'HOUSE_BILL' : 'BOOKING_FWD']: item.CLASS_CODE === 1 ? item.HOUSE_BILL : item.BOOKING_FWD,
              PALLET_NO: item.PALLET_NO,
              JOB_TYPE: item.JOB_TYPE,
              CREATE_DATE: item.CREATE_DATE,
            };
          });
          this.response['Status'] = true;
          this.response['Payload'] = dataAll;
          this.response['Message'] = 'Load dữ liệu thành công!';
          return this.response;
        } else {
          this.response['Status'] = false;
          this.response['Payload'] = [];
          this.response['Message'] = 'Không tìm thấy dữ liệu!';
          return this.response;
        }
      });
  }

  //Thoilc(*Note)-Gom nhóm các ô lại
  @post('/executive-supervision/filterBlock', spec)
  async filterBlock(
    @requestBody() bsBlock: any,
  ): Promise<any> {
    let dataFind: any = await this.BS_BLOCKRepo.find({
      fields: ["BLOCK"],
      where: { WAREHOUSE_CODE: bsBlock.WAREHOUSE_CODE }
    });
    if (dataFind.length) {
      let grpData: any = dataFind.map((p: any) => p.BLOCK);
      this.response['Status'] = true;
      this.response['Payload'] = [...new Set(grpData)];
      this.response['Message'] = "Load dữ liệu thành công!";
      return this.response;
    } else {
      this.response['Status'] = false;
      this.response['Payload'] = [];
      this.response['Message'] = 'Không tìm thấy dữ liệu!';
      return this.response;
    }
  }
}
