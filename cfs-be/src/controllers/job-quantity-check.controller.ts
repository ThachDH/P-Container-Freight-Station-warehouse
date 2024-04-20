import {
  repository
} from '@loopback/repository';
import { post, requestBody } from '@loopback/rest';
import moment from 'moment';
import { JOB_QUANTITY_CHECK } from '../models';
import { JOB_QUANTITY_CHECKRepository } from '../repositories/job-quantity-check.repository';

const spec = {
  responses: {
    '200': {
      description: 'check quantity',
      content: {
        'application/json': {
          schema: {},
        }
      }
    }
  }
}

export class CheckQuantityController {
  constructor(
    @repository(JOB_QUANTITY_CHECKRepository)
    public jobQuantityCheck: JOB_QUANTITY_CHECKRepository,
  ) { }
  public response: any = {
    Status: false,
    Payload: [],
    Message: ""
  };

  //Thoilc(*Note)-Load dữ liệu layout 2 màn hình kiểm đếm theo House_bill/Booking_fwd
  @post('/check-quantity/getHouseBillInfo', spec)
  async getHouseBillInfo(
    @requestBody() dataReq: JOB_QUANTITY_CHECK,
  ): Promise<any> {
    const whereOder: any = {
      ORDER_NO: dataReq.ORDER_NO ? dataReq.ORDER_NO : '',
      // JOB_STATUS: "A",
    };
    dataReq.HOUSE_BILL ? whereOder['HOUSE_BILL'] = dataReq.HOUSE_BILL : '';
    dataReq.BOOKING_FWD ? whereOder['BOOKING_FWD'] = dataReq.BOOKING_FWD : '';
    return await this.jobQuantityCheck.find({
      where: whereOder,
      order: ['SEQ ASC']
    })
      .then((data: any) => {
        if (data.length) {
          this.response['Status'] = true;
          this.response['Payload'] = data;
          this.response['Message'] = "Nạp dữ liệu thành công!";
          return this.response;
        } else {
          this.response['Status'] = false;
          this.response['Payload'] = [];
          this.response['Message'] = "Không tìm thấy dữ liệu!";
          return this.response;
        }
      }).catch((err: any) => {
        this.response['Status'] = false;
        this.response['Payload'] = err;
        this.response['Message'] = "Phát sinh lỗi! Liên hệ bộ phận kỹ thuật để được hỗ trợ!";
      })
  }

  //Thoilc(*Note)-Xác nhận layout 3 khi kiểm đếm hướng NKN/XKN
  @post('/check-quantity/confirmPackedPallet', spec)
  async confirmPackedPallet(
    @requestBody() dataReq: any,
  ): Promise<any> {
    if (!dataReq.ID) {
      this.response['Status'] = false;
      this.response['Message'] = 'Vui lòng cung cấp lại số ID!';
      return this.response
    }
    if (!dataReq.UPDATE_BY) {
      this.response['Status'] = false;
      this.response['Message'] = 'Vui lòng cung cấp lại tên người cập nhật!';
      return this.response
    }
    let dataUpdate: any = {
      JOB_STATUS: 'C',
      UPDATE_DATE: moment().format("YYYY-MM-DD HH:mm:ss"),
      UPDATE_BY: dataReq.UPDATE_BY,
      ACTUAL_CARGO_PIECE: dataReq.ACTUAL_CARGO_PIECE
    };

    // ------ generate Pallet Code ----------
    const PalletCode: string = [
      // dataReq.VOYAGEKEY,
      (dataReq.CLASS_CODE === 1 ? dataReq.HOUSE_BILL : dataReq.BOOKING_FWD),
      dataReq.ACTUAL_CARGO_PIECE,
      dataReq.ESTIMATED_CARGO_PIECE,
      dataReq.SEQ
    ].join('/');
    Object.assign(dataUpdate, { PALLET_NO: PalletCode });
    return await this.jobQuantityCheck.updateById(dataReq.ID, dataUpdate)
      .then(() => {
        this.response['Status'] = true;
        this.response['Payload'] = Object.assign({ID : dataReq.ID}, dataUpdate);
        this.response['Message'] = "Cập nhật dữ liệu thành công!";
        return this.response;
      })
      .catch(err => {
        this.response['Status'] = false;
        this.response['Payload'] = err;
        this.response['Message'] = "Phát sinh lỗi! Vui lòng liên hệ bộ phận kĩ thuật!";
        return this.response;
      })
  }



  //Thoilc(*Note)-Xác nhận layout 3 khi kiểm đếm hướng NKX/XKX
  @post('/check-quantity/confirmPackedPalletEx', spec)
  async confirmPackedPalletEx(
    @requestBody() checkQuantity: any,
  ): Promise<any> {
    if (!checkQuantity.ORDER_NO) {
      this.response['Status'] = false;
      this.response['Message'] = "Vui lòng cung cấp lại lệnh!";
      return this.response;
    }

    if (!(checkQuantity.CLASS_CODE === 1 || checkQuantity.CLASS_CODE === 2)) {
      this.response['Status'] = false;
      this.response['Message'] = "Vui lòng cung cấp lại hướng!";
      return this.response;
    }

    if (!checkQuantity.PALLET_NO) {
      this.response['Status'] = false;
      this.response['Message'] = "Vui lòng cung cấp lại pallet!";
      return this.response;
    }

    let whererObj: any = {
      ORDER_NO: checkQuantity.ORDER_NO,
      CLASS_CODE: checkQuantity.CLASS_CODE,
      PALLET_NO: checkQuantity.PALLET_NO,
    };
    checkQuantity.HOUSE_BILL ? whererObj['HOUSE_BILL'] = checkQuantity.HOUSE_BILL : '';
    checkQuantity.BOOKING_FWD ? whererObj['BOOKING_FWD'] = checkQuantity.BOOKING_FWD : '';
    let checkCode: any = await this.jobQuantityCheck.find({
      where: whererObj
    });

    if (checkCode.length) {
      let obj: any = {
        JOB_STATUS: 'C',
        UPDATE_BY: checkQuantity.UPDATE_BY,
        UPDATE_DATE: moment().format("YYYY-MM-DD HH:mm:ss")
      };
      await this.jobQuantityCheck.updateAll(obj, whererObj)
        .then(() => {
          this.response['Status'] = true;
          this.response['Payload'] = checkQuantity;
          this.response['Message'] = 'Xác nhận thành công!';
          return this.response;
        });
    } else {
      this.response['Status'] = false;
      this.response['Payload'] = [];
      this.response['Message'] = 'Lỗi không thể xác nhận!';
      return this.response;
    }
    return this.response;
  }

  //Thoilc(*Note)-Màn hình kiểm đếm xuất
  @post('/check-quantity/viewEx', spec)
  async viewEx(
    @requestBody() checkQuantity: any,
  ): Promise<any> {
    if (!checkQuantity.VOYAGEKEY) {
      this.response['Status'] = false;
      this.response['Message'] = "Vui lòng cung cấp lại key tàu!";
      return this.response;
    }
    if (!(checkQuantity.CLASS_CODE === 1 || checkQuantity.CLASS_CODE === 2)) {
      this.response['Status'] = false;
      this.response['Message'] = "Vui lòng cung cấp hướng nhập/xuất!";
      return this.response;
    }
    if (!checkQuantity.HOUSE_BILL) {
      this.response['Status'] = false;
      this.response['Message'] = "Vui lòng cung cấp lại house bill!";
      return this.response;
    }

    let whereObj: any = {
      VOYAGEKEY: checkQuantity.VOYAGEKEY,
      CLASS_CODE: checkQuantity.CLASS_CODE,
      JOB_STATUS: 'A',
    };

    checkQuantity.HOUSE_BILL ? whereObj['HOUSE_BILL'] = checkQuantity.HOUSE_BILL : '';
    checkQuantity.BOOKING_FWD ? whereObj['BOOKING_FWD'] = checkQuantity.BOOKING_FWD : '';

    return await this.jobQuantityCheck.find({
      where: whereObj,
    }).then((data: any) => {
      this.response['Status'] = true;
      this.response['Payload'] = data;
      this.response['Message'] = "Truy vấn dữ liệu thành công!";
      return this.response;
    })
      .catch((err: any) => {
        this.response['Status'] = false;
        this.response['Payload'] = err;
        this.response['Message'] = "Không tìm thấy dữ liệu!";
        return this.response;
      });
  }
  // view Layout 3 kiểm đếm kho xuất hướng xuất
  @post('/check-quantity/viewExExportWarehouse', spec)
  async viewExExportWarehouse(
    @requestBody() checkQuantity: any,
  ): Promise<any> {
    if (!checkQuantity.VOYAGEKEY) {
      this.response['Status'] = false;
      this.response['Message'] = "Vui lòng cung cấp lại key tàu!";
      return this.response;
    }
    if (!(checkQuantity.CLASS_CODE === 1 || checkQuantity.CLASS_CODE === 2)) {
      this.response['Status'] = false;
      this.response['Message'] = "Vui lòng cung cấp hướng nhập/xuất!";
      return this.response;
    }
    if (!checkQuantity.BOOKING_FWD) {
      this.response['Status'] = false;
      this.response['Message'] = "Vui lòng cung cấp lại BOOKING_FWD!";
      return this.response;
    }
    let whereObj: any = {
      VOYAGEKEY: checkQuantity.VOYAGEKEY,
      CLASS_CODE: checkQuantity.CLASS_CODE,
      METHOD_CODE: checkQuantity.CLASS_CODE === 1 ? 'XKN' : 'XKX',
    };
    checkQuantity.HOUSE_BILL ? whereObj['HOUSE_BILL'] = checkQuantity.HOUSE_BILL : '';
    checkQuantity.BOOKING_FWD ? whereObj['BOOKING_FWD'] = checkQuantity.BOOKING_FWD : '';
    return await this.jobQuantityCheck.find({
      where: whereObj,
    }).then((data: any) => {
      this.response['Status'] = true;
      this.response['Payload'] = data;
      this.response['Message'] = "Truy vấn dữ liệu thành công!";
      return this.response;
    })
      .catch((err: any) => {
        this.response['Status'] = false;
        this.response['Payload'] = err;
        this.response['Message'] = "Không tìm thấy dữ liệu!";
        return this.response;
      });
  }

  // Thach(*note) - Sinh ra job-quantity check khi nhập số lượng kiểm đếm
  @post('/check-quantity/insertJobQuantity', spec)
  async insertJobQuantity(
    @requestBody() checkQuantity: any,
  ): Promise<any> {
    if (!checkQuantity.VOYAGEKEY) {
      this.response['Status'] = false;
      this.response['Message'] = 'Vui lòng cung cấp key tàu!';
      return this.response;
    }
    if (!checkQuantity.CREATE_BY) {
      this.response['Status'] = false;
      this.response['Message'] = 'Vui lòng cung cấp lại tên người tạo!';
      return this.response;
    }
    if (!(checkQuantity.CLASS_CODE === 1 || checkQuantity.CLASS_CODE === 2)) {
      this.response['Status'] = false;
      this.response['Message'] = "Vui lòng cung cấp hướng";
      return this.response;
    }
    if (checkQuantity.CLASS_CODE === 1) {
      await this.jobQuantityCheck.find({
        where: { HOUSE_BILL: checkQuantity.HOUSE_BILL },
        order: ['SEQ DESC'],
      })
        .then((data: any) => {
          if (data.length === 0) {
            checkQuantity['SEQ'] = 1;
          } else {
            checkQuantity['SEQ'] = Number(data[0].SEQ) + 1;
          }
        })
        .catch((err: any) => {
          this.response['Status'] = false;
          this.response['Payload'] = err;
          this.response['Message'] = err;
          return this.response;
        });
    } else {
      await this.jobQuantityCheck.find({
        where: { BOOKING_FWD: checkQuantity.BOOKING_FWD },
        order: ['SEQ DESC']
      })
        .then((data: any) => {
          if (data.length === 0) {
            checkQuantity['SEQ'] = 1;
          } else {
            checkQuantity['SEQ'] = Number(data[0].SEQ) + 1;
          }
        })
        .catch((err: any) => {
          this.response['Status'] = false;
          this.response['Payload'] = err;
          this.response['Message'] = err;
          return this.response;
        });
    }
    let obj: any = {
      VOYAGEKEY: checkQuantity.VOYAGEKEY ? checkQuantity.VOYAGEKEY : null,
      WAREHOUSE_CODE: checkQuantity.WAREHOUSE_CODE ? checkQuantity.WAREHOUSE_CODE : null,
      CLASS_CODE: checkQuantity.CLASS_CODE ? checkQuantity.CLASS_CODE : null,
      METHOD_CODE: checkQuantity.METHOD_CODE ? checkQuantity.METHOD_CODE : null,
      TRUCK_NO: checkQuantity.TRUCK_NO ? checkQuantity.TRUCK_NO : null,
      CNTRNO: checkQuantity.CNTRNO ? checkQuantity.CNTRNO : null,
      ORDER_NO: checkQuantity.ORDER_NO ? checkQuantity.ORDER_NO : null,
      PIN_CODE: checkQuantity.PIN_CODE ? checkQuantity.PIN_CODE : null,
      HOUSE_BILL: checkQuantity.HOUSE_BILL ? checkQuantity.HOUSE_BILL : null,
      BOOKING_FWD: checkQuantity.BOOKING_FWD ? checkQuantity.BOOKING_FWD : null,
      ITEM_TYPE_CODE: checkQuantity.ITEM_TYPE_CODE ? checkQuantity.ITEM_TYPE_CODE : null,
      BOOKING_NO: checkQuantity.BOOKING_NO ? checkQuantity.BOOKING_NO : null,
      ESTIMATED_CARGO_PIECE: checkQuantity.ESTIMATED_CARGO_PIECE ? checkQuantity.ESTIMATED_CARGO_PIECE : null,
      ACTUAL_CARGO_PIECE: checkQuantity.ACTUAL_CARGO_PIECE ? checkQuantity.ACTUAL_CARGO_PIECE : null,
      ACTUAL_UNIT: checkQuantity.ACTUAL_UNIT ? checkQuantity.ACTUAL_UNIT : null,
      ACTUAL_CARGO_WEIGHT: checkQuantity.ACTUAL_CARGO_WEIGHT ? checkQuantity.ACTUAL_CARGO_WEIGHT : null,
      START_DATE: moment().format("YYYY-MM-DD hh:mm:ss"),
      FINISH_DATE: checkQuantity.FINISH_DATE ? checkQuantity.FINISH_DATE : null,
      SEQ: checkQuantity.SEQ,
      IS_FINAL: 0,
      JOB_STATUS: 'A',
      CREATE_BY: checkQuantity.CREATE_BY,
      CREATE_DATE: moment().format("YYYY-MM-DD hh:mm:ss"),
    }

    let kObj: any = {
      HOUSE_BILL: checkQuantity.HOUSE_BILL,
      ORDER_NO: checkQuantity.ORDER_NO
    };
    const checkData: any = await this.jobQuantityCheck.find({
      where: kObj
    });

    let sumCARGO_PIECE: number = 0;
    for (let i = 0; i < checkData.length; i++) {
      sumCARGO_PIECE += checkData[i].ACTUAL_CARGO_PIECE;
    }
    let mESTIMATED_CARGO_PIECE: any = await this.jobQuantityCheck.find({
      where: kObj
    })
      .then((data: any) => {
        return data[0]?.ESTIMATED_CARGO_PIECE ? data[0].ESTIMATED_CARGO_PIECE : null
      })
    if (mESTIMATED_CARGO_PIECE === null || mESTIMATED_CARGO_PIECE >= sumCARGO_PIECE) {
      return await this.jobQuantityCheck.create(obj)
        .then(data => {
          this.response['Status'] = true;
          this.response['Payload'] = data;
          this.response['Message'] = 'Tạo dữ liệu thành công!';
          return this.response;
        })
        .catch(err => {
          this.response['Status'] = false;
          this.response['Payload'] = err;
          this.response['Message'] = 'Phát sinh lỗi! Vui lòng liên hệ bộ phận kĩ thuật!';
          return this.response;
        })
    } else {
      this.response['Status'] = false;
      this.response['Message'] = "Do số lượng thực tế vượt quá số lượng dự kiến!";
      return this.response;
    }
  }
}
