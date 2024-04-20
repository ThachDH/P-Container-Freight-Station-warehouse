import { JSONObject } from '@loopback/core';
import { repository } from '@loopback/repository';
import { post, requestBody } from '@loopback/rest';
import moment from 'moment';
import { DT_ORDER } from '../models';
import {
  BS_CUSTOMERRepository,
  DT_ORDERRepository,
  DtPackageStockRepository,
  DtVesselVisitRepository,
  InvDftDtlRepository,
  InvDftRepository,
} from '../repositories';
import { DT_PACKAGE_MNF_LDRepository } from '../repositories/dt-package-mnf-ld.repository';
import { JOB_QUANTITY_CHECKRepository } from '../repositories/job-quantity-check.repository';
const spec = {
  responses: {
    '200': {
      description: 'JOB_GATE detail list of filter',
      content: {
        'application/json': {
          schema: {},
        },
      },
    },
  },
};

export class DtOrderController {
  constructor(
    @repository(DT_ORDERRepository)
    public dtOrderRepo: DT_ORDERRepository,
    @repository(JOB_QUANTITY_CHECKRepository)
    public jobQuantityCheckRepo: JOB_QUANTITY_CHECKRepository,
    @repository(DtPackageStockRepository)
    public DtPackageStockRepo: DtPackageStockRepository,
    @repository(DtVesselVisitRepository)
    public DtVesselVisitRepo: DtVesselVisitRepository,
    @repository(BS_CUSTOMERRepository)
    public BS_CUSTOMERRepo: BS_CUSTOMERRepository,
    @repository(DT_PACKAGE_MNF_LDRepository)
    public DT_PACKAGE_MNF_LDRepo: DT_PACKAGE_MNF_LDRepository,
    @repository(InvDftRepository)
    public InvDftRepo: InvDftRepository,
    @repository(InvDftDtlRepository)
    public InvDftDtlRepo: InvDftDtlRepository,
  ) { }
  public response: any = {
    Status: false,
    Payload: [],
    Message: '',
  };

  @post('/dt-order/view', spec)
  async view(@requestBody() dtOrder: DT_ORDER): Promise<any> {
    let arr: any = [];
    if (!dtOrder.ORDER_NO && !dtOrder.PIN_CODE && !dtOrder.CNTRNO) {
      this.response['Status'] = false;
      this.response['Message'] =
        'Vui lòng cung cấp lại số lệnh, mã PIN và Container!';
      return this.response;
    }
    try {
      let obj: any = {
        ORDER_NO: dtOrder.ORDER_NO,
        PIN_CODE: dtOrder.PIN_CODE,
        CNTRNO: dtOrder.CNTRNO,
      };
      if (obj.ORDER_NO) {
        await this.dtOrderRepo
          .find({
            include: [
              {
                relation: 'vesselInfo',
                scope: {
                  fields: ['INBOUND_VOYAGE', 'OUTBOUND_VOYAGE', 'ETA', 'ETD', 'VESSEL_NAME']
                }
              }
            ],
            fields: [
              'VOYAGEKEY',
              'ORDER_NO',
              'PIN_CODE',
              'CNTRNO',
              'CNTRSZTP',
              'CUSTOMER_CODE',
              'METHOD_CODE',
              'CLASS_CODE',
              'BILLOFLADING',
              'HOUSE_BILL',
              'BOOKING_FWD',
              'BOOKING_NO',
            ],
            where: {
              and: [{ ORDER_NO: String(dtOrder.ORDER_NO) }, { GATE_CHK: false }],
            },
            order: [
              'VOYAGEKEY',
              'ORDER_NO',
              'PIN_CODE',
              'CNTRNO',
              'CNTRSZTP',
              'CUSTOMER_CODE',
              'METHOD_CODE',
              'CLASS_CODE',
              'BILLOFLADING',
              'HOUSE_BILL',
              'BOOKING_FWD',
              'BOOKING_NO',
            ],
          })
          .then((data: any) => {
            if (data.length) {
              data.map((item: any) => {
                let obj: any = {
                  VOYAGEKEY: item.VOYAGEKEY,
                  ORDER_NO: item.ORDER_NO,
                  PIN_CODE: item.PIN_CODE.split('-')[0],
                  BILLOFLADING: item.BILLOFLADING,
                  HOUSE_BILL: item.HOUSE_BILL,
                  BOOKING_FWD: item.BOOKING_FWD,
                  BOOKING_NO: item.BOOKING_NO,
                  CNTRNO: item.CNTRNO,
                  CNTRSZTP: item.CNTRSZTP,
                  CUSTOMER_CODE: item.CUSTOMER_CODE,
                  METHOD_CODE: item.METHOD_CODE,
                  CLASS_CODE: item.CLASS_CODE,
                  INBOUND_VOYAGE: data[0]?.vesselInfo.INBOUND_VOYAGE,
                  OUTBOUND_VOYAGE: data[0]?.vesselInfo.OUTBOUND_VOYAGE,
                  ETA: data[0]?.vesselInfo.ETA,
                  ETD: data[0]?.vesselInfo.ETD,
                  VESSEL_NAME: data[0]?.vesselInfo.VESSEL_NAME,

                };
                arr.push(obj);
              });
            } else {
              this.response['Status'] = false;
              this.response['Message'] = 'Không có dữ liệu!';
              return this.response;
            }
          });
      } else if (obj.PIN_CODE) {
        await this.dtOrderRepo
          .find({
            include: [
              {
                relation: 'vesselInfo',
                scope: {
                  fields: ['INBOUND_VOYAGE', 'OUTBOUND_VOYAGE', 'ETA', 'ETD', 'VESSEL_NAME']
                }
              }
            ],
            fields: [
              'VOYAGEKEY',
              'ORDER_NO',
              'PIN_CODE',
              'CNTRNO',
              'CNTRSZTP',
              'CUSTOMER_CODE',
              'METHOD_CODE',
              'CLASS_CODE',
              'BILLOFLADING',
              'HOUSE_BILL',
              'BOOKING_FWD',
              'BOOKING_NO',
            ],
            where: {
              and: [
                { PIN_CODE: { like: dtOrder.PIN_CODE + '%' } },
                { GATE_CHK: false },
              ],
            },
            order: [
              'VOYAGEKEY',
              'ORDER_NO',
              'PIN_CODE',
              'CNTRNO',
              'CNTRSZTP',
              'CUSTOMER_CODE',
              'METHOD_CODE',
              'CLASS_CODE',
              'BILLOFLADING',
              'HOUSE_BILL',
              'BOOKING_FWD',
              'BOOKING_NO',
            ],
          })
          .then((data: any) => {
            if (data.length) {
              data.map((item: any) => {
                let obj: any = {
                  VOYAGEKEY: item.VOYAGEKEY,
                  ORDER_NO: item.ORDER_NO,
                  PIN_CODE: item.PIN_CODE.split('-')[0],
                  BILLOFLADING: item.BILLOFLADING,
                  HOUSE_BILL: item.HOUSE_BILL,
                  BOOKING_FWD: item.BOOKING_FWD,
                  BOOKING_NO: item.BOOKING_NO,
                  CNTRNO: item.CNTRNO,
                  CNTRSZTP: item.CNTRSZTP,
                  CUSTOMER_CODE: item.CUSTOMER_CODE,
                  METHOD_CODE: item.METHOD_CODE,
                  CLASS_CODE: item.CLASS_CODE,
                  INBOUND_VOYAGE: data[0]?.vesselInfo.INBOUND_VOYAGE,
                  OUTBOUND_VOYAGE: data[0]?.vesselInfo.OUTBOUND_VOYAGE,
                  ETA: data[0]?.vesselInfo.ETA,
                  ETD: data[0]?.vesselInfo.ETD,
                  VESSEL_NAME: data[0]?.vesselInfo.VESSEL_NAME,

                };
                arr.push(obj);
              });
            } else {
              this.response['Status'] = false;
              this.response['Message'] = 'Không có dữ liệu!';
              return this.response;
            }
          });
      } else {
        await this.dtOrderRepo
          .find({
            include: [
              {
                relation: 'vesselInfo',
                scope: {
                  fields: ['INBOUND_VOYAGE', 'OUTBOUND_VOYAGE', 'ETA', 'ETD', 'VESSEL_NAME']
                }
              }
            ],
            fields: [
              'VOYAGEKEY',
              'ORDER_NO',
              'PIN_CODE',
              'CNTRNO',
              'CNTRSZTP',
              'CUSTOMER_CODE',
              'METHOD_CODE',
              'CLASS_CODE',
              'BILLOFLADING',
              'HOUSE_BILL',
              'BOOKING_FWD',
              'BOOKING_NO',
            ],
            where: {
              and: [{ CNTRNO: String(dtOrder.CNTRNO) }, { GATE_CHK: false }],
            },
            order: [
              'VOYAGEKEY',
              'ORDER_NO',
              'PIN_CODE',
              'CNTRNO',
              'CNTRSZTP',
              'CUSTOMER_CODE',
              'METHOD_CODE',
              'CLASS_CODE',
              'BILLOFLADING',
              'HOUSE_BILL',
              'BOOKING_FWD',
              'BOOKING_NO',
            ],
          })
          .then((data: any) => {
            if (data.length) {
              data.map((item: any) => {
                let obj: any = {
                  VOYAGEKEY: item.VOYAGEKEY,
                  ORDER_NO: item.ORDER_NO,
                  PIN_CODE: item.PIN_CODE.split('-')[0],
                  BILLOFLADING: item.BILLOFLADING,
                  HOUSE_BILL: item.HOUSE_BILL,
                  BOOKING_FWD: item.BOOKING_FWD,
                  BOOKING_NO: item.BOOKING_NO,
                  CNTRNO: item.CNTRNO,
                  CNTRSZTP: item.CNTRSZTP,
                  CUSTOMER_CODE: item.CUSTOMER_CODE,
                  METHOD_CODE: item.METHOD_CODE,
                  CLASS_CODE: item.CLASS_CODE,
                  INBOUND_VOYAGE: data[0]?.vesselInfo.INBOUND_VOYAGE,
                  OUTBOUND_VOYAGE: data[0]?.vesselInfo.OUTBOUND_VOYAGE,
                  ETA: data[0]?.vesselInfo.ETA,
                  ETD: data[0]?.vesselInfo.ETD,
                  VESSEL_NAME: data[0]?.vesselInfo.VESSEL_NAME,
                };
                arr.push(obj);
              });
            } else {
              this.response['Status'] = false;
              this.response['Message'] = 'Không có dữ liệu!';
              return this.response;
            }
          });
      }
      // let filterData = arr.filter((p: any) => p.PIN_CODE === pinCode.PIN_CODE.split('-')[0])
      if (arr[0]) {
        this.response['Payload'] = arr[0];
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
      this.response['Message'] = 'Không thể lưu mới dữ liệu!';
      return this.response;
    }
  }

  //Thoilc(*Note)-Load danh sách HB khi chọn số xe theo theo ORDER_NO NKN
  @post('/dt-order/getHousebillList', spec)
  async getHousebillList(@requestBody() dataReq: DT_ORDER): Promise<any> {
    if (!dataReq.ORDER_NO) {
      this.response['Status'] = false;
      this.response['Payload'] = [];
      this.response['Message'] = 'Vui lòng cung cấp số lệnh!';
      return this.response;
    }

    await this.dtOrderRepo
      .find({
        where: {
          ORDER_NO: String(dataReq.ORDER_NO),
        },
        include: [
          {
            relation: 'vesselInfo',
            scope: {
              fields: ['INBOUND_VOYAGE', 'OUTBOUND_VOYAGE', 'ETA', 'ETD', 'VESSEL_NAME']
            }
          },
        ],
      })
      .then((data: any) => {
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
      .catch((err: any) => {
        this.response['Status'] = false;
        this.response['Payload'] = err;
        this.response['Message'] =
          'Phát sinh lỗi! Vui lòng liên hệ bộ phận kỹ thuật!';
        return this.response;
      });

    //tính số lượng thực tế của màn hình
    if (this.response['Status'] === true) {
      if (dataReq.CLASS_CODE === 1) {
        let tempHouseBill = this.response['Payload'].map(
          (item: any) => item.HOUSE_BILL,
        );
        for (let i = 0; i < tempHouseBill.length; i++) {
          let sum: number = 0;
          await this.jobQuantityCheckRepo
            .find({
              where: {
                ORDER_NO: String(dataReq.ORDER_NO),
                HOUSE_BILL: tempHouseBill[i],
                JOB_STATUS: 'C'
              },
            })
            .then((data: any) => {
              data.map((e: any) => {
                sum += Number(e.ACTUAL_CARGO_PIECE);
              });
            })
            .catch((err: any) => {
              this.response['Status'] = false;
              this.response['Payload'] = err;
              this.response['Message'] =
                'Phát sinh lỗi! Vui lòng liên hệ bộ phận kỹ thuật!';
              return this.response;
            });
          this.response['Payload'][i] = {
            ...this.response['Payload'][i],
            total_ACTUAL_CARGO_PIECE: sum,
          };
        }
      } else {
        let tempBookingFWD = this.response['Payload'].map(
          (item: any) => item.BOOKING_FWD,
        );
        for (let i = 0; i < tempBookingFWD.length; i++) {
          let sum: number = 0;
          await this.jobQuantityCheckRepo
            .find({
              where: {
                ORDER_NO: String(dataReq.ORDER_NO),
                BOOKING_FWD: tempBookingFWD[i],
                JOB_STATUS: 'C'
              },
            })
            .then((data: any) => {
              data.map((e: any) => {
                sum += Number(e.ACTUAL_CARGO_PIECE);
              });
            })
            .catch((err: any) => {
              this.response['Status'] = false;
              this.response['Payload'] = err;
              this.response['Message'] =
                'Phát sinh lỗi! Vui lòng liên hệ bộ phận kỹ thuật!';
              return this.response;
            });
          this.response['Payload'][i] = {
            ...this.response['Payload'][i],
            total_ACTUAL_CARGO_PIECE: sum,
          };
        }
      }
    }

    return this.response;
  }

  //Thoilc(*Note)-Tạo lệnh nhập kho nhập
  // let originalString = '0000';
  // let increment = 102;

  // let number = parseInt(originalString, 10); // Chuyển chuỗi số thành số nguyên
  // let result = number + increment; // Thực hiện phép cộng
  // let newString = result.toString().padStart(originalString.length, '0'); // Chuyển kết quả về chuỗi số và thêm số 0 vào đầu nếu cần

  //Thoilc(*Note)-Xác nhận layout 2 xác nhận sl kiểm đếm NKN/NKX
  @post('/dt-order/confirmOrder', spec)
  async confQunality(@requestBody() dataReq: JSONObject): Promise<any> {
    console.log(dataReq);
    if (!dataReq.ORDER_NO) {
      this.response['Status'] = false;
      this.response['Message'] = 'Vui lòng cung cấp lại mã lệnh!';
      return this.response;
    }
    if (!(dataReq.CLASS_CODE === 1 || dataReq.CLASS_CODE === 2)) {
      this.response['Status'] = false;
      this.response['Message'] = 'Vui lòng cung cấp lại hướng!';
      return this.response;
    }

    let whereObj: any;
    if (dataReq.CLASS_CODE === 1) {
      whereObj = {
        ORDER_NO: dataReq.ORDER_NO,
        CLASS_CODE: dataReq.CLASS_CODE,
        HOUSE_BILL: dataReq.HOUSE_BILL,
      };
    } else {
      whereObj = {
        ORDER_NO: dataReq.ORDER_NO,
        CLASS_CODE: dataReq.CLASS_CODE,
        BOOKING_FWD: dataReq.BOOKING_FWD,
      };
    }

    await this.dtOrderRepo
      .find({
        where: whereObj,
      })
      .then(async (data: any) => {
        if (data.length) {
          //Thoilc(*Note)-Cập nhật trạng thái I -> S của bảng DT_PACKAGE_STOCK
          // await this.DtPackageStockRepo.updateAll(
          //   {
          //     STATUS: 'S',
          //     UPDATE_BY: whereObj.UPDATE_BY,
          //     UPDATE_DATE: moment().format('YYYY-MM-DD HH:mm:ss'),
          //   },
          //   whereObj,
          // );
          //Thoilc(*Note)-Cập nhật trạng thái A -> C của bảng JOB_QUANTITY_CHECK
          await this.jobQuantityCheckRepo.updateAll(
            {
              NOTE: dataReq.NOTE ? String(dataReq.NOTE) : '',
              IS_FINAL: true,
              UPDATE_BY: whereObj.UPDATE_BY,
              UPDATE_DATE: moment().format('YYYY-MM-DD HH:mm:ss'),
            },
            whereObj,
          );

          let ID: any = data.map((item: any) => item.ID);
          let updateQUANTITY_CHK: any = {};
          updateQUANTITY_CHK['QUANTITY_CHK'] = true;
          updateQUANTITY_CHK['UPDATE_BY'] = dataReq.UPDATE_BY;
          updateQUANTITY_CHK['UPDATE_DATE'] = moment().format(
            'YYYY-MM-DD HH:mm:ss',
          );
          //Thoilc(*Note)-Lỗi 500 khi xác nhận do HB bị trùng
          //Thoilc(*Note)-Cập nhật QUANTITY_CHK 0 - >1 của bảng DT_ORDER
          return await this.dtOrderRepo
            .updateAll(updateQUANTITY_CHK, {
              and: [{ ID: { inq: ID } }],
            })
            .then(() => {
              this.response['Status'] = true;
              this.response['Payload'] = dataReq;
              this.response['Message'] = 'Lưu dữ liệu thành công!';
              return this.response;
            });
        } else {
          this.response['Status'] = false;
          this.response['Message'] = 'Không tìm thấy dữ liệu!';
          return this.response;
        }
      });
    return this.response;
  }

  //Thoilc(*Note)-Xác nhận layout 2 xác nhận sl kiểm đếm XKN/XKX
  @post('/dt-order/confirmOrderEx', spec)
  async confirmOrderEx(@requestBody() dataReq: JSONObject): Promise<any> {

    if (!dataReq.ORDER_NO) {
      this.response['Status'] = false;
      this.response['Message'] = 'Vui lòng cung cấp lại mã lệnh!';
      return this.response;
    }
    if (!(dataReq.CLASS_CODE === 1 || dataReq.CLASS_CODE === 2)) {
      this.response['Status'] = false;
      this.response['Message'] = 'Vui lòng cung cấp lại hướng!';
      return this.response;
    }

    let whereObj: any;
    if (dataReq.CLASS_CODE === 1) {
      whereObj = {
        ORDER_NO: dataReq.ORDER_NO,
        CLASS_CODE: dataReq.CLASS_CODE,
      };
    } else {
      whereObj = {
        ORDER_NO: dataReq.ORDER_NO,
        CLASS_CODE: dataReq.CLASS_CODE,
      };
    }
    let whereJobQuantity: any = {
      ORDER_NO: String(dataReq.ORDER_NO),
      CLASS_CODE: dataReq.CLASS_CODE,
    };
    dataReq.CLASS_CODE === 1 ? whereJobQuantity['HOUSE_BILL'] = dataReq.HOUSE_BILL : whereJobQuantity['BOOKING_FWD'] = dataReq.BOOKING_FWD
    await this.jobQuantityCheckRepo.updateAll({ IS_FINAL: true }, whereJobQuantity)
    await this.dtOrderRepo
      .find({
        where: whereObj,
      })
      .then(async (data: any) => {
        if (data.length) {
          //Thoilc(*Note)-Cập nhật trạng thái S -> O của bảng DT_PACKAGE_STOCK
          await this.DtPackageStockRepo.updateAll(
            {
              STATUS: 'O',
              UPDATE_BY: String(dataReq.UPDATE_BY),
              UPDATE_DATE: moment().format('YYYY-MM-DD HH:mm:ss'),
            },
            whereObj,
          );
          await this.jobQuantityCheckRepo.updateAll(
            {
              NOTE: String(dataReq.NOTE) ?? '',
              UPDATE_BY: String(dataReq.UPDATE_BY),
              UPDATE_DATE: moment().format('YYYY-MM-DD HH:mm:ss'),
            },
            whereObj,
          )
          let ID: any = data.map((item: any) => item.ID);
          let updateQUANTITY_CHK: any = {};
          updateQUANTITY_CHK['QUANTITY_CHK'] = true;
          updateQUANTITY_CHK['UPDATE_BY'] = dataReq.UPDATE_BY;
          updateQUANTITY_CHK['UPDATE_DATE'] = moment().format(
            'YYYY-MM-DD HH:mm:ss',
          );
          //Thoilc(*Note)-Lỗi 500 khi xác nhận do HB bị trùng
          //Thoilc(*Note)-Cập nhật QUANTITY_CHK 0 - >1 của bảng DT_ORDER
          // return await this.dtOrderRepo.updateById(ID, whereObj)
          return await this.dtOrderRepo
            .updateAll(updateQUANTITY_CHK, {
              and: [{ ID: { inq: ID } }],
            })
            .then(() => {
              this.response['Status'] = true;
              this.response['Payload'] = dataReq;
              this.response['Message'] = 'Lưu dữ liệu thành công!';
              return this.response;
            });
        } else {
          this.response['Status'] = false;
          this.response['Message'] = 'Không tìm thấy dữ liệu!';
          return this.response;
        }
      });
    return this.response;
  }

  //Màn hình truy vấn thông tin lệnh
  @post('/dt-order/getOrder', spec)
  async getOrder(@requestBody() dataReq: any): Promise<any> {
    let whereObj: any = {};
    let dataAll: any = [];
    dataReq.ORDER_NO ? (whereObj['ORDER_NO'] = dataReq.ORDER_NO) : '';
    dataReq.BILLOFLADING
      ? (whereObj['BILLOFLADING'] = dataReq.BILLOFLADING)
      : '';
    dataReq.BOOKING_NO ? (whereObj['BOOKING_NO'] = dataReq.BOOKING_NO) : '';
    if (!Object.keys(whereObj).length) {
      this.response['Status'] = false;
      this.response['Message'] =
        'Vui lòng cung cấp số lệnh, số bill hoặc số booking!';
      return this.response;
    }
    // if (whereObj['ORDER_NO']) {
    return await this.dtOrderRepo
      .find({
        include: [
          {
            relation: 'vesselInfo',
          },
          // {relation: 'conInfo'},
          { relation: 'customerInfo' },
        ],
        where: whereObj,
      })
      .then(async (data: any) => {
        let VOYAGEKEY: any = data[0].VOYAGEKEY;
        let CLASS_CODE: any = data[0].CLASS_CODE;
        let HOUSE_BILL: any = data[0].HOUSE_BILL;
        let BOOKING_FWD: any = data[0].BOOKING_FWD;
        let arrData = data.map((item: any) => {
          let obj: any = {
            VOYAGEKEY: item.VOYAGEKEY,
            ORDER_NO: item.ORDER_NO,
            BOOKING_NO: item.BOOKING_NO,
            BILLOFLADING: item.BILLOFLADING,
            VESSEL_NAME: item?.vesselInfo.VESSEL_NAME,
            CLASS_CODE: item.CLASS_CODE,
            METHOD_CODE: item.METHOD_CODE, //tác nghiệp
            CNTRNO: item.CNTRNO,
            OWNER: item.OWNER,
            OWNER_PHONE: item.OWNER_PHONE,
            EXP_DATE: item.EXP_DATE,
            ITEM_TYPE_CODE: item.ITEM_TYPE_CODE,
            ACC_TYPE: item.ACC_TYPE,
            HOUSE_BILL: item.HOUSE_BILL,
            BOOKING_FWD: item.BOOKING_FWD,
            CARGO_PIECE: item.CARGO_PIECE,
            UNIT_CODE: item.UNIT_CODE,
            CARGO_WEIGHT: item.CARGO_WEIGHT,
            CBM: item.CBM,
            NOTE: item.NOTE,
            INBOUND_VOYAGE: item?.vesselInfo.INBOUND_VOYAGE,
            OUTBOUND_VOYAGE: item?.vesselInfo.OUTBOUND_VOYAGE,
            ETA: item?.vesselInfo.ETA,
            ETD: item?.vesselInfo.ETD,
            CNTRSZTP: item?.CNTRSZTP,
            CUSTOMER_NAME: item?.customerInfo.CUSTOMER_NAME,
            LOT_NO: item.LOT_NO,
            GATE_CHK: item.GATE_CHK,
            PAYMENT_CHK: item.PAYMENT_CHK,
            QUANTITY_CHK: item.QUANTITY_CHK,
          };
          // findPackage_Mnf_Ld[0].SHIPMARKS ? obj['SHIPMARKS'] = findPackage_Mnf_Ld[0].SHIPMARKS : '';
          // findPackage_Mnf_Ld[0].DECLARE_NO ? obj['DECLARE_NO'] = findPackage_Mnf_Ld[0].DECLARE_NO : '';
          return obj;
        });
        let whereObjPackage: any = {
          VOYAGEKEY: VOYAGEKEY,
          CLASS_CODE: CLASS_CODE,
          [CLASS_CODE === 1 ? 'HOUSE_BILL' : 'BOOKING_FWD']:
            CLASS_CODE === 1 ? HOUSE_BILL : BOOKING_FWD,
        };
        let findPackage_Mnf_Ld: any = await this.DT_PACKAGE_MNF_LDRepo.find({
          fields: ['SHIPMARKS', 'DECLARE_NO'],
          where: whereObjPackage,
        });

        for (let i = 0; i < arrData.length; i++) {
          dataAll.push(
            Object.assign(arrData[i], {
              SHIPMARKS: findPackage_Mnf_Ld[0]?.SHIPMARKS,
              DECLARE_NO: findPackage_Mnf_Ld[0]?.DECLARE_NO,
            }),
          );
        }
        if (data.length) {
          this.response['Status'] = true;
          this.response['Payload'] = dataAll;
          this.response['Message'] = 'Truy vấn dữ liệu thành công!';
          return this.response;
        } else {
          this.response['Status'] = false;
          this.response['Payload'] = data;
          this.response['Message'] = 'Truy vấn dữ liệu thất bại!';
          return this.response;
        }
      })
      .catch(err => {
        this.response['Status'] = false;
        this.response['Payload'] = err;
        this.response['Message'] =
          'Phát sinh lỗi! Vui lòng liên hệ bộ phận kỹ thuật!';
        return this.response;
      });
  }

  @post('/dt-order/insertOrder', spec)
  async insertOrder(@requestBody() orderReq: any[]): Promise<any> {

    if (!orderReq[0].VOYAGEKEY) {
      this.response['Status'] = false;
      this.response['Message'] = 'Vui lòng cung cấp key tàu!';
      return this.response;
    }
    if (!(orderReq[0].CLASS_CODE === 1 || orderReq[0].CLASS_CODE === 2)) {
      this.response['Status'] = false;
      this.response['Message'] = 'Vui lòng cung cấp hướng!';
      return this.response;
    }
    if (orderReq[0].METHOD_CODE !== 'NKX' && !orderReq[0].ACC_CD) {
      this.response['Status'] = false;
      this.response['Message'] =
        'Vui lòng cung cấp mã hình thức thanh toán!';
      return this.response;
    }
    if (!orderReq[0].METHOD_CODE) {
      this.response['Status'] = false;
      this.response['Message'] = 'Vui lòng cung cấp mã phương án!';
      return this.response;
    }
    if (!orderReq[0].OWNER) {
      this.response['Status'] = false;
      this.response['Message'] = 'Vui lòng cung cấp thông tin chủ hàng!';
      return this.response;
    }
    if (!orderReq[0].OWNER_REPRESENT) {
      this.response['Status'] = false;
      this.response['Message'] =
        'Vui lòng cung cấp thông tin tên người đại diện!';
      return this.response;
    }
    if (!orderReq[0].OWNER_PHONE) {
      this.response['Status'] = false;
      this.response['Message'] = 'Vui lòng cung cấp thông tin SĐT!';
      return this.response;
    }
    if (!orderReq[0].CREATE_BY) {
      this.response['Status'] = false;
      this.response['Message'] = 'Vui lòng cung cấp lại tên người tạo!';
      return this.response;
    }

    //sinh ra order no
    let order_no_created: string = `${orderReq[0].METHOD_CODE}${orderReq[0].CLASS_CODE
      }${moment().format('YYMMDD')}`;
    await this.dtOrderRepo
      .find({
        fields: ['ORDER_NO'],
        where: { ORDER_NO: { like: order_no_created + '%' } },
        order: ['ORDER_NO DESC'],
      })
      .then((orderNo: any) => {
        if (orderNo.length === 0) {
          return (order_no_created = `${order_no_created}001`);
        } else {
          let tempOrderNo = orderNo[0].ORDER_NO?.substr(-3);
          let threeLastOrderNo = `000${Number(tempOrderNo) + 1}`.substr(-3);
          order_no_created = `${order_no_created}${threeLastOrderNo}`;
        }
      });

    return Promise.all(
      orderReq.map(async (item: any, index: number) => {
        if (!item.ITEM_TYPE_CODE) {
          this.response['Status'] = false;
          this.response['Message'] = 'Vui lòng cung cấp mã loại hàng hóa!';
          return this.response;
        }
        let countPIN: string = `000${String(index + 1)}`.substr(-3);
        //sinh ra PIN
        let pinCode: string = `${moment().format('YYMMDD')}`;
        await this.dtOrderRepo
          .find({
            fields: ['PIN_CODE'],
            where: { PIN_CODE: { like: pinCode + '%' } },
            order: ['PIN_CODE DESC'],
          })
          .then((item: any) => {
            if (item.length === 0) {
              return (pinCode = `${pinCode}001-${countPIN}`);
            } else {
              let temp = item[0].PIN_CODE?.slice(6, 9);
              let pincodeTemp = `000${Number(temp) + 1}`.substr(-3);
              pinCode = `${pinCode}${pincodeTemp}-${countPIN}`;
            }
          });
        let obj: any = {
          VOYAGEKEY: item.VOYAGEKEY,
          CLASS_CODE: item.CLASS_CODE,
          ORDER_NO: order_no_created,
          PIN_CODE: pinCode,
          CUSTOMER_CODE: item.CUSTOMER_CODE,
          ACC_TYPE: item.ACC_TYPE,
          ACC_CD: item.ACC_CD,
          DELIVERY_ORDER: item.DELIVERY_ORDER ? item.DELIVERY_ORDER : null,
          BILLOFLADING: item.BILLOFLADING ? item.BILLOFLADING : null,
          BOOKING_NO: item.BOOKING_NO ? item.BOOKING_NO : null,
          CNTRNO: item.CNTRNO ? item.CNTRNO : null,
          CNTRSZTP: item.CNTRSZTP ? item.CNTRSZTP : null,
          ITEM_TYPE_CODE: item.ITEM_TYPE_CODE,
          ITEM_TYPE_CODE_CNTR: item.ITEM_TYPE_CODE,
          METHOD_CODE: item.METHOD_CODE ? item.METHOD_CODE : null,
          ISSUE_DATE: moment().format('YYYY-MM-DD HH:mm:ss'),
          EXP_DATE: moment(item.EXP_DATE).format('YYYY-MM-DD HH:mm:ss'),
          HOUSE_BILL: item.HOUSE_BILL ? item.HOUSE_BILL : null,
          BOOKING_FWD: item.BOOKING_FWD ? item.BOOKING_FWD : null,
          CARGO_PIECE: item.CARGO_PIECE ? item.CARGO_PIECE : null,
          UNIT_CODE: item.UNIT_CODE ? item.UNIT_CODE : null,
          CARGO_WEIGHT: item.CARGO_WEIGHT ? item.CARGO_WEIGHT : null,
          CBM: item.CBM ? item.CBM : null,
          RT: item.RT ? item.RT : null,
          LOT_NO: item.LOT_NO ? item.LOT_NO : null,
          NOTE: item.NOTE ? item.NOTE : null,
          DRAFT_NO: item.DRAFT_NO ? item.DRAFT_NO : null,
          INV_NO: item.INV_NO ? item.INV_NO : null,
          GATE_CHK: item.GATE_CHK,
          QUANTITY_CHK: item.QUANTITY_CHK,
          PAYMENT_CHK: item.PAYMENT_CHK,
          OWNER: item.OWNER,
          OWNER_REPRESENT: item.OWNER_REPRESENT,
          OWNER_PHONE: item.OWNER_PHONE,
          COMMODITYDESCRIPTION: item.COMMODITYDESCRIPTION,
          CREATE_BY: item.CREATE_BY,
          CREATE_DATE: moment().format('YYYY-MM-DD HH:mm:ss'),
        };
        try {
          let wherePackage: any = {
            VOYAGEKEY: item.VOYAGEKEY,
            CLASS_CODE: item.CLASS_CODE,
            [item.CLASS_CODE === 1 ? 'HOUSE_BILL' : 'BOOKING_FWD']:
              item.CLASS_CODE === 1 ? item.HOUSE_BILL : item.BOOKING_FWD,
          };
          let checkPackageMnf: any = await this.DT_PACKAGE_MNF_LDRepo.find({
            fields: ['SHIPMARKS', 'DECLARE_NO', 'VOYAGEKEY'],
            include: [
              {
                relation: 'vesselName',
              },
            ],
            where: wherePackage
          });
          return await this.dtOrderRepo.create(obj).then((data: any) => {
            this.response['Status'] = true;
            this.response['Payload'].push(
              Object.assign(
                {
                  SHIPMARKS: checkPackageMnf[0]?.SHIPMARKS,
                  DECLARE_NO: checkPackageMnf[0]?.DECLARE_NO,
                  VESSEL_NAME: checkPackageMnf[0]?.vesselName.VESSEL_NAME
                },
                data,
              ),
            );
            this.response['Message'] = 'Lưu dữ liệu thành công!';
            return this.response;
          });
        } catch (err: any) {
          this.response['Status'] = false;
          this.response['Payload'] = err;
          this.response['Message'] = 'Không thể lưu mới dữ liệu!';
          return this.response;
        }
      }),
    ).then(async (value: any) => {
      if (this.response['Status'] && orderReq[0].METHOD_CODE !== 'NKX') {
        //Thoilc(*Bổ sung)-INV_DFT
        let checkCode: any = await this.InvDftRepo.find({
          order: ['DRAFT_INV_NO DESC'],
        });
        // console.log("AAAA", checkCode, " - ", checkCode[0]?.DRAFT_INV_NO.substr(8))
        let AMOUNT: any = orderReq[0].INV_DRAFT?.datainvDraft.AMOUNT;
        let VAT: any = orderReq[0].INV_DRAFT?.datainvDraft.VAT;
        let TAMOUNT: any = orderReq[0].INV_DRAFT?.datainvDraft.TAMOUNT;
        let idx_DRAFT_INV_NO: any = parseInt(
          checkCode[0]?.DRAFT_INV_NO.substr(8),
        );
        let CURRENCY_CODE: any =
          orderReq[0].INV_DRAFT?.datainvDraft.CURRENCY_CODE;
        let CUSTOMER_CODE: any =
          orderReq[0].INV_DRAFT?.datainvDraft.CUSTOMER_CODE;
        let ACC_TYPE: any = orderReq[0].INV_DRAFT?.datainvDraft.ACC_TYPE;
        let invDftData: any = {
          DRAFT_INV_NO: idx_DRAFT_INV_NO
            ? 'DR' +
            '/' +
            moment(new Date()).format('YYYY') +
            '/' +
            (parseInt('0000000', 10) + idx_DRAFT_INV_NO + 1)
              .toString()
              .padStart('0000000'.length, '0')
            : 'DR' +
            '/' +
            moment(new Date()).format('YYYY') +
            '/' +
            `000000${String(1)}`,
          DRAFT_INV_DATE: moment().format('YYYY-MM-DD HH:mm:ss'),
          REF_NO: this.response['Payload'][0].ORDER_NO,
          PAYER_TYPE: ACC_TYPE,
          PAYER: CUSTOMER_CODE,
          AMOUNT: AMOUNT,
          VAT: VAT,
          PAYMENT_STATUS: 'U',
          CURRENCYID: CURRENCY_CODE,
          TPLT_NM: 'CFS',
          TAMOUNT: TAMOUNT,
          CREATE_BY: orderReq[0].CREATE_BY,
          CREATE_TIME: moment().format('YYYY-MM-DD HH:mm:ss'),
        };
        await this.InvDftRepo.create(invDftData);
        let dataDetail: any = orderReq[0].INV_DRAFT.DETAIL_DRAFT.map(
          (itemDetail: any, idx: any) => {
            let objINV_DETAIL: any = {
              DRAFT_INV_NO: invDftData.DRAFT_INV_NO,
              SEQ: idx + 1,
              TRF_CODE: itemDetail.TRF_CODE,
              INV_UNIT: itemDetail.UNIT_CODE,
              IX_CD: itemDetail.CLASS_CODE,
              CARGO_TYPE: itemDetail.ITEM_TYPE_CODE,
              AMOUNT: itemDetail.AMOUNT.toLocaleString().replace(/\D/g, ''),
              VAT: itemDetail.VAT.toLocaleString().replace(/\D/g, ''),
              VAT_RATE: parseFloat(itemDetail.VAT_RATE),
              TAMOUNT: itemDetail.TAMOUNT.toLocaleString().replace(/\D/g, ''),
              SZ: itemDetail.CNTRSZTP,
              QTY: Number(itemDetail.QTY),
              UNIT_RATE: (itemDetail.UNIT_RATE).toLocaleString().replace(/\D/g, ''),
              TRF_DESC: itemDetail.TRF_DESC,
              JOB_TYPE: itemDetail.METHOD_CODE,
              VAT_CHK: itemDetail.VAT_CHK,
              CREATE_BY: this.response['Payload'][0].CREATE_BY,
              CREATE_TIME: moment().format('YYYY-MM-DD HH:mm:ss'),
            };
            return objINV_DETAIL;
          },
        );
        this.InvDftDtlRepo.createAll(dataDetail);
        this.response['Payload'] = {
          order_noInfo: this.response['Payload'],
          inv_vatInfo: {},
        };
      }
      return this.response;
    });
  }

  //Cập nhật thông tin lệnh
  @post('/dt-order/get', spec)
  async getDtOrder(@requestBody() orderReq: JSONObject): Promise<any> {
    if (!orderReq.ORDER_NO) {
      this.response['Status'] = false;
      this.response['Message'] = 'Vui lòng cung cấp số lệnh!';
      return this.response;
    }
    return this.dtOrderRepo
      .find({
        fields: [
          'ORDER_NO',
          'VOYAGEKEY',
          'CNTRNO',
          'BILLOFLADING',
          'BOOKING_NO',
          'HOUSE_BILL',
          'BOOKING_FWD',
          'CBM',
          'RT',
          'OWNER',
          'INV_NO',
          'OWNER_PHONE',
          'CUSTOMER_CODE',
          'NOTE',
          'ITEM_TYPE_CODE',
          'PIN_CODE',
          'CARGO_PIECE',
          'COMMODITYDESCRIPTION',
          'CLASS_CODE',
          'CREATE_BY',
        ],
        include: [
          {
            relation: 'customerInfo',
            scope: {
              fields: ['CUSTOMER_NAME'],
            },
          },
        ],
        where: {
          ORDER_NO: String(orderReq.ORDER_NO),
        },
      })
      .then(data => {
        if (data.length) {
          let Total_RT: any = 0;
          data.map(e => {
            Total_RT += Number(e.CBM);
          });
          let objHeader: any = {
            CLASS_CODE: data[0].CLASS_CODE ? data[0].CLASS_CODE : '',
            ORDER_NO: data[0].ORDER_NO ? data[0].ORDER_NO : '',
            VOYAGEKEY: data[0].VOYAGEKEY ? data[0].VOYAGEKEY : '',
            CNTRNO: data[0].CNTRNO ? data[0].CNTRNO : '',
            BILLOFLADING: data[0].BILLOFLADING ? data[0].BILLOFLADING : '',
            BOOKING_NO: data[0].BOOKING_NO ? data[0].BOOKING_NO : '',
            Total_RT: Total_RT / 1.5,
            OWNER: data[0].OWNER ? data[0].OWNER : '',
            CUSTOMER_NAME: data[0].customerInfo?.CUSTOMER_NAME,
            INV_NO: data[0].INV_NO ? data[0].INV_NO : '',
            OWNER_PHONE: data[0].OWNER_PHONE ? data[0].OWNER_PHONE : '',
            CREATE_BY: data[0].CREATE_BY ? data[0].CREATE_BY : '',
            NOTE: data[0].NOTE ? data[0].NOTE : '',
          };
          this.response['Status'] = true;
          this.response['Payload'] = {
            header: [objHeader],
            details: data,
          };
          this.response['Message'] = 'Nạp dữ liệu thành công!';
          return this.response;
        } else {
          this.response['Status'] = false;
          this.response['Payload'] = [];
          this.response['Message'] = `Không tìm thấy dữ liệu!`;
          return this.response;
        }
      });
  }
  @post('/dt-order/updateDT_ORDER', spec)
  async updateDT_ORDER(@requestBody() orderReq: JSONObject): Promise<any> {
    if (!orderReq.ORDER_NO) {
      this.response['Status'] = false;
      this.response['Message'] = `Vui lòng cung cấp số lệnh!`;
      return this.response;
    }
    let dataUpdate: any = {};
    orderReq.OWNER_PHONE
      ? (dataUpdate['OWNER_PHONE'] = orderReq.OWNER_PHONE)
      : '';
    orderReq.NOTE ? (dataUpdate['NOTE'] = orderReq.NOTE) : '';
    return this.dtOrderRepo
      .updateAll(dataUpdate, { ORDER_NO: String(orderReq.ORDER_NO) })
      .then(data => {
        this.response['Status'] = true;
        this.response['Message'] = `Thay đổi dữ liệu thành công!`;
        return this.response;
      })
      .catch(err => {
        this.response['Status'] = false;
        this.response['Payload'] = err;
        this.response[
          'Message'
        ] = `Phát sinh lỗi! Vui lòng liên hệ bộ phận kĩ thuật!`;
        return this.response;
      });
  }
}
