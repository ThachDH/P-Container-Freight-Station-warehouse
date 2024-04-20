import {JSONObject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {post, requestBody} from '@loopback/rest';
import moment from 'moment';
import {mapDataWithKey} from '../general';
import {DT_PACKAGE_STOCK} from '../models';
import {DT_ORDERRepository, DtPalletStockRepository, DtVesselVisitRepository} from '../repositories';
import {DtPackageStockRepository} from '../repositories/dt-package-stock.repository';
import {JOB_QUANTITY_CHECKRepository} from '../repositories/job-quantity-check.repository';
const spec = {
  responses: {
    '200': {
      description: 'DT_PACKAGE_STOCK detail list of filter',
      content: {
        'application/json': {
          schema: {},
        }
      }
    }
  }
}

export class DtPackageStock {
  constructor(
    @repository(DtPackageStockRepository)
    public dtPackageStockRepository: DtPackageStockRepository,
    @repository(DtVesselVisitRepository)
    public dtVesselVisitRepository: DtVesselVisitRepository,
    @repository(JOB_QUANTITY_CHECKRepository)
    public jobQuantityCheckRepo: JOB_QUANTITY_CHECKRepository,
    @repository(DT_ORDERRepository)
    public dtOrderRepo: DT_ORDERRepository,
    @repository(DtPalletStockRepository)
    public dtPalletStock: DtPalletStockRepository
  ) { }

  public response: any = {
    Status: false,
    Payload: [],
    Message: ""
  };


  @post('/dt-package-stock/viewPalletInfor', spec)
  async viewPalletInfor(
    @requestBody() dtPackageStock: JSONObject
  )  {
    if (!dtPackageStock.HB_BK) {
      this.response['Status'] = false;
      this.response['Message'] = 'Vui lòng cung cấp lại số HOUSE_BILL/BOOKING_FWD!';
      return this.response;
    }
   return await this.dtPackageStockRepository.find({
      include: [
        {
          relation: 'palletStockInfo',
          scope: {
            fields: ['PALLET_NO', 'CARGO_PIECE', 'BLOCK', 'SLOT', 'TIER', 'IDREF_STOCK']
          }
        },
        {
          relation: 'vesselVisit',
          scope: {
            fields: ['VOYAGEKEY', 'VESSEL_NAME', 'INBOUND_VOYAGE', 'OUTBOUND_VOYAGE', 'ETA', 'ETD']
          }
        },
      ],
      where: {or: [{HOUSE_BILL: String(dtPackageStock.HB_BK)}, {BOOKING_FWD: String(dtPackageStock.HB_BK)}]},
      fields: ['HOUSE_BILL', 'BOOKING_FWD', 'TIME_IN', 'CARGO_PIECE', 'ID', 'VOYAGEKEY']
    })
      .then((data: any) => {
        if (data.length > 0) {
          this.response['Payload'] = data[0];
          this.response['Status'] = true;
          this.response['Message'] = 'Load dữ liệu thành công!';
          return this.response;
        } else {
          this.response['Status'] = false;
          this.response['Message'] = 'Không có dữ liệu!';
          return this.response;
        }
      })
      .catch(err=> {
        return err
      })
  }


  //hiển thị thông tin
  @post('/dt-package-stock/view', spec)
  async view() {
    let arr: any = [];
    let _Data = await this.dtPackageStockRepository.find({
      include: [
        {
          relation: 'package_MNF',
          scope: {
            fields: ['ITEM_TYPE_CODE']
          }
        },
        {
          relation: 'vesselVisit',
          scope: {
            fields: ['VOYAGEKEY', 'VESSEL_NAME', 'INBOUND_VOYAGE', 'OUTBOUND_VOYAGE', 'ETA', 'ETD']
          }
        },
      ],
    })
      .then((data: any) => {
        return data.map((_item: any) => mapDataWithKey('packageStock', _item));
      });
    if (_Data.length) {
      _Data.map((item: any, index: any) => {
        let VESSEL_NAME: any = item.packageStock_vesselVisit.map((subVessel: any) => subVessel.VESSEL_NAME);
        let mChuyen: any = item.CLASS_CODE === 1 ? item.packageStock_vesselVisit.map((subVessel: any) => subVessel.INBOUND_VOYAGE) : item.packageStock_vesselVisit.map((subVessel: any) => subVessel.OUTBOUND_VOYAGE);
        let mDayVessel: any = item.CLASS_CODE === 1 ? item.packageStock_vesselVisit.map((subVessel: any) => subVessel.ETA) : item.packageStock_vesselVisit.map((subVessel: any) => subVessel.ETD);
        let obj: any = {
          ID: item.packageStock_ID,
          CNTRNO: item.packageStock_CNTRNO,
          HOUSE_BILL: item.packageStock_HOUSE_BILL,
          BOOKING_FWD: item.packageStock_BOOKING_FWD,
          CLASS_CODE: item.packageStock_CLASS_CODE,
          VESSEL_NAME: VESSEL_NAME[index],
          VESSEL_TRIP: mChuyen[index],
          VESSEL_DAY: mDayVessel[index],
          CUSTOMER_CODE: item.packageStock_CUSTOMER_CODE,
          ITEM_TYPE_CODE: item.package_MNF_ITEM_TYPE_CODE,
          WAREHOUSE_CODE: item.packageStock_WAREHOUSE_CODE,
          CBM: item.packageStock_CBM,
          TIME_IN: item.packageStock_TIME_IN,
          TIME_OUT: item.packageStock_TIME_OUT,
          CUSTOMER_CAS: item.packageStock_CUSTOMER_CAS,
          UNIT_CODE: item.packageStock_UNIT_CODE,
          CARGO_PIECE: item.packageStock_CARGO_PIECE,
          CARGO_WEIGHT: item.packageStock_CARGO_WEIGHT,
          STATUS: item.packageStock_STATUS,
          VOYAGEKEY: item.packageStock_VOYAGEKEY,
          METHOD_CODE: item.packageStock_METHOD_CODE,
          ORDER_NO: item.packageStock_ORDER_NO,
          PIN_CODE: item.packageStock_PIN_CODE,
          CUSTOMER_TYPE_CODE: item.packageStock_CUSTOMER_TYPE_CODE,
          LOT_NO: item.packageStock_LOT_NO,
          TLHQ: item.packageStock_TLHQ,
          GETIN_HQ: item.packageStock_GETIN_HQ,
          GETOUT_HQ: item.packageStock_GETOUT_HQ,
          TKHN_NO: item.packageStock_TKHN_NO,
          TKHX_NO: item.packageStock_TKHX_NO,
          NOTE: item.packageStock_NOTE,
        };
        return arr.push(obj);
      });
      this.response['Payload'] = arr;
      this.response['Status'] = true;
      this.response['Message'] = 'Load dữ liệu thành công!';
      return this.response;
    } else {
      this.response['Status'] = false;
      this.response['Message'] = 'Không có dữ liệu!';
      return this.response;
    }
  }

  @post('/dt-package-stock/getItem', spec)
  async getItem(
    @requestBody() dtPackageStock: JSONObject
  ) {
    let whereObj: any = {};
    dtPackageStock.CNTRNO ? whereObj['CNTRNO'] = dtPackageStock.CNTRNO : '';
    dtPackageStock.CLASS_CODE ? whereObj['CLASS_CODE'] = dtPackageStock.CLASS_CODE : '';
    let _from = dtPackageStock.fromDate ? moment(String(dtPackageStock.fromDate)).utcOffset(-8).format('YYYY-MM-DD[T]00:00:00') : '';
    let _to = dtPackageStock.toDate ? moment(String(dtPackageStock.toDate)).utcOffset(8).format('YYYY-MM-DD HH:mm:ss') : '';
    _from && _to ? whereObj['TIME_IN'] = {
      between: [_from, _to]
    } : '';
    dtPackageStock.STATUS ? whereObj['STATUS'] = dtPackageStock.STATUS : '';
    let arr: any = [];
    if (!dtPackageStock.CNTRNO) {
      this.response['Status'] = false;
      this.response['Message'] = "Vui lòng cung cấp số container!";
      return this.response;
    }
    try {
      let _Data: any = await this.dtPackageStockRepository.find({
        include: [
          {
            relation: 'package_MNF',
            scope: {
              fields: ['ITEM_TYPE_CODE', 'CUSTOMER_NAME']
            }
          },
          {
            relation: 'vesselVisit',
            scope: {
              fields: ['VOYAGEKEY', 'VESSEL_NAME', 'INBOUND_VOYAGE', 'OUTBOUND_VOYAGE', 'ETA', 'ETD']
            }
          },
        ],
        where: whereObj,
      })
        .then((data: any) => {
          return data.map((_item: any) => mapDataWithKey('packageStock', _item));
        });
      if (_Data.length) {
        _Data.map((item: any, index: any) => {
          let VESSEL_NAME: any = item.packageStock_vesselVisit.map((subVessel: any) => subVessel.VESSEL_NAME);
          let mChuyen: any = item.CLASS_CODE === 1 ? item.packageStock_vesselVisit.map((subVessel: any) => subVessel.INBOUND_VOYAGE) : item.packageStock_vesselVisit.map((subVessel: any) => subVessel.OUTBOUND_VOYAGE);
          let mDayVessel: any = item.CLASS_CODE === 1 ? item.packageStock_vesselVisit.map((subVessel: any) => subVessel.ETA) : item.packageStock_vesselVisit.map((subVessel: any) => subVessel.ETD);
          let obj: any = {
            ID: item.packageStock_ID,
            CNTRNO: item.packageStock_CNTRNO,
            HOUSE_BILL: item.packageStock_HOUSE_BILL,
            BOOKING_FWD: item.packageStock_BOOKING_FWD,
            CLASS_CODE: item.packageStock_CLASS_CODE,
            VESSEL_NAME: VESSEL_NAME[index],
            VESSEL_TRIP: mChuyen[index],
            VESSEL_DAY: mDayVessel[index],
            CUSTOMER_CODE: item.packageStock_CUSTOMER_CODE,
            CUSTOMER_NAME: item.package_MNF_CUSTOMER_NAME,
            ITEM_TYPE_CODE: item.package_MNF_ITEM_TYPE_CODE,
            WAREHOUSE_CODE: item.packageStock_WAREHOUSE_CODE,
            CBM: item.packageStock_CBM,
            TIME_IN: item.packageStock_TIME_IN,
            TIME_OUT: item.packageStock_TIME_OUT,
            CUSTOMER_CAS: item.packageStock_CUSTOMER_CAS,
            UNIT_CODE: item.packageStock_UNIT_CODE,
            CARGO_PIECE: item.packageStock_CARGO_PIECE,
            CARGO_WEIGHT: item.packageStock_CARGO_WEIGHT,
            STATUS: item.packageStock_STATUS,
            VOYAGEKEY: item.packageStock_VOYAGEKEY,
            METHOD_CODE: item.packageStock_METHOD_CODE,
            ORDER_NO: item.packageStock_ORDER_NO,
            PIN_CODE: item.packageStock_PIN_CODE,
            CUSTOMER_TYPE_CODE: item.packageStock_CUSTOMER_TYPE_CODE,
            LOT_NO: item.packageStock_LOT_NO,
            TLHQ: item.packageStock_TLHQ,
            GETIN_HQ: item.packageStock_GETIN_HQ,
            GETOUT_HQ: item.packageStock_GETOUT_HQ,
            TKHN_NO: item.packageStock_TKHN_NO,
            TKHX_NO: item.packageStock_TKHX_NO,
            NOTE: item.packageStock_NOTE,
          };
          return arr.push(obj);
        });
        this.response['Payload'] = arr;
        this.response['Status'] = true;
        this.response['Message'] = 'Load dữ liệu thành công!';
        return this.response;
      } else {
        this.response['Status'] = false;
        this.response['Message'] = 'Không tìm thấy dữ liệu cần tìm!';
        return this.response;
      }
    } catch {
      this.response['Status'] = false;
      this.response['Message'] = "Không thể load dữ liệu!";
      return this.response;
    }
  }

  //Thoilc(*Note)-Xác nhận layout 3 kiểm đếm NKN/NKX
  @post('/dt-package-stock/handleSave', spec)
  async handleSave(
    @requestBody() dtPackageStock: JSONObject
  ) {
    if (!dtPackageStock.ORDER_NO) {
      this.response['Status'] = false;
      this.response['Message'] = 'Vui lòng cung cấp lại mã lệnh!';
      return this.response;
    }

    if (!(dtPackageStock.CLASS_CODE === 1 || dtPackageStock.CLASS_CODE === 2)) {
      this.response['Status'] = false;
      this.response['Message'] = 'Vui lòng cung cấp lại hướng!'
      return this.response;
    }

    if (!dtPackageStock.CREATE_BY) {
      this.response['Status'] = false;
      this.response['Message'] = 'Vui lòng cung cấp lại tên người tạo!'
      return this.response;
    }
    if (dtPackageStock.CLASS_CODE === 1) {
      // ------- check exist equipment type --------
      let checkCode = await this.dtPackageStockRepository.find({
        where: {
          and: [
            {ORDER_NO: String(dtPackageStock.ORDER_NO)},
            {HOUSE_BILL: String(dtPackageStock.HOUSE_BILL)},
          ]
        }
      });
      if (!checkCode.length) {
        let obj: any = {
          VOYAGEKEY: dtPackageStock.VOYAGEKEY ? dtPackageStock.VOYAGEKEY : null,
          WAREHOUSE_CODE: dtPackageStock.WAREHOUSE_CODE ? dtPackageStock.WAREHOUSE_CODE : null,
          CLASS_CODE: dtPackageStock.CLASS_CODE,
          METHOD_IN: dtPackageStock.METHOD_CODE ? dtPackageStock.METHOD_CODE : null,
          ORDER_NO: dtPackageStock.ORDER_NO,
          PIN_CODE: dtPackageStock.PIN_CODE ? dtPackageStock.PIN_CODE : null,
          CUSTOMER_CODE: dtPackageStock.CUSTOMER_CODE ? dtPackageStock.CUSTOMER_CODE : null,
          HOUSE_BILL: dtPackageStock.HOUSE_BILL ? dtPackageStock.HOUSE_BILL : null,
          CNTRNO: dtPackageStock.CNTRNO ? dtPackageStock.CNTRNO : null,
          LOT_NO: dtPackageStock.LOT_NO ? dtPackageStock.LOT_NO : null,
          STATUS: "I",
          TIME_IN: moment().format("YYYY-MM-DD HH:mm:ss"),
          CARGO_PIECE: dtPackageStock.CARGO_PIECE ? dtPackageStock.CARGO_PIECE : null,
          UNIT_CODE: dtPackageStock.UNIT_CODE ? dtPackageStock.UNIT_CODE : null,
          CARGO_WEIGHT: dtPackageStock.CARGO_WEIGHT ? dtPackageStock.CARGO_WEIGHT : null,
          ITEM_TYPE_CODE: dtPackageStock.ITEM_TYPE_CODE,
          CBM: dtPackageStock.CBM ? dtPackageStock.CBM : null,
          NOTE: dtPackageStock.NOTE,
          COMMODITYDESCRIPTION: dtPackageStock.COMMODITYDESCRIPTION,
          CREATE_BY: dtPackageStock.CREATE_BY,
          CREATE_DATE: moment().format("YYYY-MM-DD HH:mm:ss"),
        };
        await this.dtPackageStockRepository.create(obj)
          .then((data: any) => {
            this.response['Status'] = true;
            this.response['Payload'].push(data);
            this.response['Message'] = "Lưu dữ liệu thành công!";
            return this.response;
          });
      } else {
        let ID: any = await this.dtPackageStockRepository.find({
          where: {
            and: [
              {ORDER_NO: String(dtPackageStock.ORDER_NO)},
              {HOUSE_BILL: String(dtPackageStock.HOUSE_BILL)},
            ]
          }
        })
          .then((data: any) => data.map((item: any) => item.ID));
        dtPackageStock['UPDATE_BY'] = dtPackageStock.CREATE_BY;
        dtPackageStock['UPDATE_DATE'] = moment().format("YYYY-MM-DD HH:mm:ss");
        await this.dtPackageStockRepository.updateById(ID, dtPackageStock)
          .then(() => {
            this.response['Status'] = true;
            this.response['Payload'] = dtPackageStock;
            this.response['Message'] = "Lưu dữ liệu thành công!";
            return this.response;
          });
      }
    } else {
      // ------- check exist equipment type --------
      let checkCode = await this.dtPackageStockRepository.find({
        where: {
          and: [
            {ORDER_NO: String(dtPackageStock.ORDER_NO)},
            {BOOKING_FWD: String(dtPackageStock.BOOKING_FWD)},
          ]
        }
      })
        .then((data: any) => data.map((item: any) => item.ID));
      if (!checkCode.length) {
        let obj: any = {
          VOYAGEKEY: dtPackageStock.VOYAGEKEY ? dtPackageStock.VOYAGEKEY : null,
          WAREHOUSE_CODE: dtPackageStock.WAREHOUSE_CODE ? dtPackageStock.WAREHOUSE_CODE : null,
          CLASS_CODE: dtPackageStock.CLASS_CODE,
          ITEM_TYPE_CODE: dtPackageStock.ITEM_TYPE_CODE,
          METHOD_IN: dtPackageStock.METHOD_CODE ? dtPackageStock.METHOD_CODE : null,
          ORDER_NO: dtPackageStock.ORDER_NO,
          PIN_CODE: dtPackageStock.PIN_CODE ? dtPackageStock.PIN_CODE : null,
          CUSTOMER_CODE: dtPackageStock.CUSTOMER_CODE ? dtPackageStock.CUSTOMER_CODE : null,
          BOOKING_FWD: dtPackageStock.BOOKING_FWD ? dtPackageStock.BOOKING_FWD : null,
          CNTRNO: dtPackageStock.CNTRNO ? dtPackageStock.CNTRNO : null,
          LOT_NO: dtPackageStock.LOT_NO ? dtPackageStock.LOT_NO : null,
          STATUS: "I",
          TIME_IN: moment().format("YYYY-MM-DD HH:mm:ss"),
          CARGO_PIECE: dtPackageStock.CARGO_PIECE,
          UNIT_CODE: dtPackageStock.UNIT_CODE ? dtPackageStock.UNIT_CODE : null,
          CARGO_WEIGHT: dtPackageStock.CARGO_WEIGHT,
          CBM: dtPackageStock.CBM,
          CREATE_BY: dtPackageStock.CREATE_BY,
          CREATE_DATE: moment().format("YYYY-MM-DD HH:mm:ss"),
        };
        await this.dtPackageStockRepository.create(obj)
          .then((data: any) => {
            this.response['Status'] = true;
            this.response['Payload'].push(data);
            this.response['Message'] = "Lưu dữ liệu thành công!";
            return this.response;
          });
      } else {
        let ID: any = await this.dtPackageStockRepository.find({
          where: {
            and: [
              {ORDER_NO: String(dtPackageStock.ORDER_NO)},
              {BOOKING_FWD: String(dtPackageStock.BOOKING_FWD)},
            ]
          }
        })
          .then((data: any) => data.map((item: any) => item.ID));
        dtPackageStock['UPDATE_BY'] = dtPackageStock.CREATE_BY;
        dtPackageStock['UPDATE_DATE'] = moment().format("YYYY-MM-DD HH:mm:ss");
        await this.dtPackageStockRepository.updateById(ID, dtPackageStock)
          .then(() => {
            this.response['Status'] = true;
            this.response['Payload'] = dtPackageStock;
            this.response['Message'] = "Lưu dữ liệu thành công!";
            return this.response;
          });
      }
    }
    return this.response;
  }

  //Thoilc(*Note)-Màn hình kiểm đếm xuất
  @post('/dt-package-stock/viewEx', spec)
  async viewEx(
    @requestBody() dtPackageStock: any,
  ): Promise<any> {
    if (!dtPackageStock.ORDER_NO) {
      this.response['Status'] = false;
      this.response['Message'] = "Vui lòng cung cấp lại số lệnh!";
      return this.response;
    }
    await this.dtPackageStockRepository.find({
      where: {ORDER_NO: dtPackageStock.ORDER_NO},
    }).then((data: any) => {
      if (data.length) {
        this.response['Status'] = true;
        this.response['Payload'] = data;
        this.response['Message'] = "Load dữ liệu thành công!";
        return this.response;
      } else {
        this.response['Status'] = false;
        this.response['Message'] = "Không tìm thấy dữ liệu!";
        return this.response;
      }
    })
      .catch((err: any) => {
        this.response['Status'] = true;
        this.response['Payload'] = err;
        this.response['Message'] = "Không tìm thấy dữ liệu!";
        return this.response;
      });

    if (this.response['Status']) {
      let tempHouseBill = this.response['Payload'].map((item: any) => item.HOUSE_BILL)
      for (let i = 0; i < tempHouseBill.length; i++) {
            let sum: number = 0
            let note: string = ''
        await this.jobQuantityCheckRepo.find({
          where: {
            and: [
              {ORDER_NO: dtPackageStock.ORDER_NO},
              {HOUSE_BILL: tempHouseBill[i]},
              {JOB_STATUS: 'C'}
            ]
          }
        })
          .then(data => {
            data.map(e => {
            sum += Number(e.ACTUAL_CARGO_PIECE)
            })
          })
          .catch(err => {
            return console.log(err)
          })
          
          await this.jobQuantityCheckRepo.find({
            where: {
              and: [
                {HOUSE_BILL: tempHouseBill[i]},
                {METHOD_CODE: 'NKN'}
              ]
            }
          })
            .then(data => {
              data.map(e => {
              note = String(e.NOTE)
              })
            })
            .catch(err => {
              return console.log(err)
            })
        this.response['Payload'][i] = {...this.response['Payload'][i], total_ACTUAL_CARGO_PIECE: sum, NOTE: note}
      }
    }
    return this.response
  }

  @post('/dt-package-stock/get', spec)
  async get(
    @requestBody() dataReq: DT_PACKAGE_STOCK
  ): Promise<any> {
    let whereObj: any = {}
    if (!dataReq.HOUSE_BILL) {
      this.response['Status'] = false;
      this.response['Payload'] = [];
      this.response['Message'] = 'Vui lòng cung cấp số House Bill !';
      return this.response;
    }
    if (!dataReq.VOYAGEKEY) {
      this.response['Status'] = false;
      this.response['Payload'] = [];
      this.response['Message'] = 'Vui lòng cung cấp số mã tàu chuyến!';
      return this.response;
    }
    whereObj['HOUSE_BILL'] = dataReq.HOUSE_BILL;
    whereObj['VOYAGEKEY'] = dataReq.VOYAGEKEY;
    whereObj['METHOD_CODE'] = 'XKN';
    let checkCont: any = await this.dtOrderRepo.find({
      where: whereObj
    })
      .then((data) => {
        //Nếu không có trong dt_order hoặc dt_order.GATE_CHK = 1 thì vẫn cho làm lệnh
        if (data.length === 0) {
          return false;
        } else if ((data.filter((item) => item.GATE_CHK === false).length !== 0)) {
          return true;
        } else {
          return false;
        }
      })
    if (checkCont) {
      this.response['Status'] = false;
      this.response['Message'] = `Số House Bill : ${dataReq.HOUSE_BILL} đã làm lệnh !`;
      return this.response;
    }
    return await this.dtPackageStockRepository.find({
      include: [
        {
          relation: 'customerName',
          scope: {
            fields: ['CUSTOMER_NAME']
          }
        },
        {
          relation: 'getItemTypeCodeCont',
        }
      ],
      where: whereObj
    })
      .then((data: any) => {
        if (data.length) {
          let arr: any = []
          data.map((item: any) => {
            let obj: any = {
              ID: item.ID,
              CUSTOMER_NAME: item.customerName ? item.customerName.CUSTOMER_NAME : null,
              VOYAGEKEY: item.VOYAGEKEY,
              WAREHOUSE_CODE: item.WAREHOUSE_CODE,
              CLASS_CODE: item.CLASS_CODE,
              METHOD_CODE: item.METHOD_CODE,
              ORDER_NO: item.ORDER_NO,
              PIN_CODE: item.PIN_CODE,
              CUSTOMER_TYPE_CODE: item.CUSTOMER_TYPE_CODE,
              CUSTOMER_CODE: item.CUSTOMER_CODE,
              HOUSE_BILL: item.HOUSE_BILL,
              BOOKING_FWD: item.BOOKING_FWD,
              CNTRNO: item.CNTRNO,
              LOT_NO: item.LOT_NO,
              STATUS: item.STATUS,
              TIME_IN: item.TIME_IN,
              TIME_OUT: item.TIME_OUT,
              CARGO_PIECE: item.CARGO_PIECE,
              UNIT_CODE: item.UNIT_CODE,
              CARGO_WEIGHT: item.CARGO_WEIGHT,
              CBM: item.CBM,
              TLHQ: item.TLHQ,
              GETIN_HQ: item.GETIN_HQ,
              GETOUT_HQ: item.GETOUT_HQ,
              TKHN_NO: item.TKHN_NO,
              TKHX_NO: item.TKHX_NO,
              CUSTOMER_CAS: item.CUSTOMER_CAS,
              NOTE: item.NOTE,
              ITEM_TYPE_CODE: item.ITEM_TYPE_CODE,
              CREATE_BY: item.CREATE_BY,
              CREATE_DATE: item.CREATE_DATE,
              UPDATE_BY: item.UPDATE_BY,
              UPDATE_DATE: item.UPDATE_DATE,
              ITEM_TYPE_CODE_CNTR: item.getItemTypeCodeCont ? item.getItemTypeCodeCont.ITEM_TYPE_CODE_CNTR : null,
              CNTRSZTP: item.getItemTypeCodeCont ? item.getItemTypeCodeCont.CNTRSZTP : null,
              COMMODITYDESCRIPTION: item.COMMODITYDESCRIPTION,
            }
            return arr.push(obj);
          })
          let TLHQValue: any = []
          arr.map((item: any) => {
            if (!item.TLHQ) {
              TLHQValue.push(item.HOUSE_BILL)
            }
          })
          if (TLHQValue.length) {
            this.response['Status'] = false;
            this.response['Payload'] = TLHQValue;
            this.response['Message'] = `Vui lòng xác nhận thanh lí hải quan cho số Bill :${TLHQValue}`
            return this.response;
          } else {
            this.response['Status'] = true;
            this.response['Payload'] = arr;
            this.response['Message'] = 'Truy vấn dữ liệu thành công!!';
            return this.response;
          }
        } else {
          this.response['Status'] = false;
          this.response['Payload'] = [];
          this.response['Message'] = 'Truy vấn dữ liệu thất bại!!';
          return this.response;
        }
      })
      .catch(err => {
        this.response['Status'] = false;
        this.response['Payload'] = err;
        this.response['Message'] = 'Truy vấn dữ liệu thất bại!!';
        return this.response;
      });
  }
  @post('/dt-package-stock/viewExExportWarehouse', spec)
  async viewExExportWarehouse(
    @requestBody() dtPackageStock: any,
  ): Promise<any> {
    if (!dtPackageStock.ORDER_NO) {
      this.response['Status'] = false;
      this.response['Message'] = "Vui lòng cung cấp lại số lệnh!";
      return this.response;
    }
    await this.dtPackageStockRepository.find({
      where: {ORDER_NO: dtPackageStock.ORDER_NO},
    }).then((data: any) => {
      if (data.length) {
        this.response['Status'] = true;
        this.response['Payload'] = data;
        this.response['Message'] = "Load dữ liệu thành công!";
        return this.response;
      } else {
        this.response['Status'] = false;
        this.response['Message'] = "Không tìm thấy dữ liệu!";
        return this.response;
      }
    })
      .catch((err: any) => {
        this.response['Status'] = false;
        this.response['Payload'] = err;
        this.response['Message'] = "Không tìm thấy dữ liệu!";
        return this.response;
      });
    if (this.response['Status']) {
      let tempBookingFWD = this.response['Payload'].map((item: any) => item.BOOKING_FWD)
      for (let i = 0; i < tempBookingFWD.length; i++) {
        let sum: number = 0
        await this.jobQuantityCheckRepo.find({
          where: {
            and: [
              {ORDER_NO: dtPackageStock.ORDER_NO},
              {BOOKING_FWD: tempBookingFWD[i]},
              {JOB_STATUS: 'C'}
            ]
          }
        })
          .then(data => {
            data.map(e => {
              sum += Number(e.ACTUAL_CARGO_PIECE)
            })
          })
          .catch(err => {
            return console.log(err)
          })
        this.response['Payload'][i] = {...this.response['Payload'][i], total_ACTUAL_CARGO_PIECE: sum}
      }
    }
    return this.response
  }

  // Thay đổi dữ liệu của kiện
  @post('/dt-package-stock/filterStock', spec)
  async filterStock(
    @requestBody() req: JSONObject
  ) {
    if (!Object.values(req).length) {
      this.response['Status'] = false;
      this.response['Message'] = 'Vui lòng cung cấp thông tin tàu chuyến và số container!'
      return this.response;
    }
    if (!req.VOYAGEKEY) {
      this.response['Status'] = false;
      this.response['Message'] = 'Vui lòng cung cấp thông tin tàu chuyến !'
      return this.response;
    }
    if (!req.CNTRNO && req.CLASS_CODE === 1) {
      this.response['Status'] = false;
      this.response['Message'] = 'Vui lòng cung cấp số container!'
      return this.response;
    }
    let whereObj: any = {
      STATUS: 'S',
      VOYAGEKEY: req.VOYAGEKEY,
      CNTRNO: req.CNTRNO
    };
    if (req.CLASS_CODE === 1 || req.CLASS_CODE === 2) {
      whereObj['CLASS_CODE'] = req.CLASS_CODE
    }
    req.HOUSE_BILL ? whereObj['HOUSE_BILL'] = req.HOUSE_BILL : '';
    req.BOOKING_FWD ? whereObj['BOOKING_FWD'] = req.BOOKING_FWD : '';
    return this.dtPackageStockRepository.find({
      where: whereObj
    })
      .then(data => {
        if (data.length) {
          this.response['Status'] = true;
          this.response['Payload'] = data;
          this.response['Message'] = 'Truy vấn dữ liệu thành công!';
          return this.response;
        } else {
          this.response['Status'] = false;
          this.response['Payload'] = [];
          this.response['Message'] = 'Không tìm thấy dữ liệu!';
          return this.response;
        }
      })
      .catch(err => {
        this.response['Status'] = false;
        this.response['Payload'] = err;
        this.response['Message'] = 'Phát sinh lỗi! Vui lòng liên hệ bộ phận kĩ thuật!';
        return this.response;
      })
  }
  @post('/dt-package-stock/updateTLHQ', spec)
  async updateTLHQ(
    @requestBody() req: any
  ) {
    if (!Object.values(req).length) {
      this.response['Status'] = false;
      this.response['Message'] = 'Không có dữ liệu thay đổi!'
      return this.response;
    }
    return this.dtPackageStockRepository.updateById(req.ID, {TLHQ: req.TLHQ})
      .then(data => {
        this.response['Status'] = true;
        this.response['Message'] = 'Cập nhật dữ liệu thành công!'
        return this.response;
      })
      .catch(err => {
        this.response['Status'] = false;
        this.response['Payload'] = err
        this.response['Message'] = 'Phát sinh lỗi! Vui lòng liên hệ bộ phận kĩ thuật!';
        return this.response;
      })
  }

}
