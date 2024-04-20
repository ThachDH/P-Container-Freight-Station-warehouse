// Uncomment these imports to begin using these cool features!
// import {inject} from '@loopback/core';

import { JSONObject } from '@loopback/core';
import { repository } from '@loopback/repository';
import { post, requestBody } from '@loopback/rest';
import moment from 'moment';
import { ccurl } from '../general';
import { DT_CNTR_STOCK } from '../models/dt-cntr-stock.model';
import { API_TOSRepository } from '../repositories';
import { DT_CNTR_STOCKRepository } from '../repositories/dt-cntr-stock.repository';
const spec = {
  responses: {
    '200': {
      description: 'DT_CNTR_STOCK list of filter',
      content: {
        'application/json': {
          schema: {},
        }
      }
    }
  }
}

export class DT_CNTR_STOCKController {
  constructor(@repository(DT_CNTR_STOCKRepository)
  public DtCntStockRepo: DT_CNTR_STOCKRepository,
    @repository(API_TOSRepository)
    public API_TOSRepo: API_TOSRepository,
  ) { }
  public response: any = {
    Status: false,
    Payload: [],
    Message: ""
  };

  //Thoilc(*Note):Lấy dữ liệu cont biến động từ TOS sang
  @post('/dt-cntr-stocks/CFStoVTOS_getCntrStock', spec)
  //  @authenticate({strategy: 'jwt', options: {required: ['frmVoyageManage', 'IsView']}})
  async CFStoVTOS_getCntrStock(
    @requestBody() dtCntrStock: JSONObject
  ): Promise<any> {
    // if (!(dtCntrStock.fromDate && dtCntrStock.toDate)) {
    //   this.response['Status'] = false;
    //   this.response['Message'] = `Vui lòng gửi từ ngày đến ngày!`
    //   return this.response;
    // }
    if (!dtCntrStock.VOYAGEKEY) {
      this.response['Status'] = false;
      this.response['Message'] = `Vui lòng cung cấp tàu chuyến!`
      return this.response;
    }
    if (!dtCntrStock.CNTRNO) {
      this.response['Status'] = false;
      this.response['Message'] = `Vui lòng cung cấp số cont!`
      return this.response;
    }
    if (!(dtCntrStock.CLASS_CODE === 1 || dtCntrStock.CLASS_CODE === 2)) {
      this.response['Status'] = false;
      this.response['Message'] = `Vui lòng cung cấp hướng!`
      return this.response;
    }
    if (!dtCntrStock.TOS_SHIPKEY) {
      this.response['Status'] = false;
      this.response['Message'] = `Vui lòng cung cấp shipkey!`
      return this.response;
    }
    if (!dtCntrStock.CREATE_BY) {
      this.response['Status'] = false;
      this.response['Message'] = "Vui lòng cung cấp tên người truy vấn dữ liệu!";
      return this.response;
    }
    const CFStoVTOS_getCntrStock = async () => {
      const dataSend = JSON.stringify({
        // fromDate: moment(String(dtCntrStock.fromDate)).utcOffset(-8).format('YYYY-MM-DD HH:mm:ss'),
        // toDate: moment(String(dtCntrStock.toDate)).utcOffset(12).format('YYYY-MM-DD HH:mm:ss'),
        CLASS_CODE: dtCntrStock.CLASS_CODE,
        TOS_SHIPKEY: dtCntrStock.TOS_SHIPKEY,
        CNTRNO: dtCntrStock.CNTRNO ? dtCntrStock.CNTRNO : "",
        // VOYAGEKEY: dtCntrStock.VOYAGEKEY,
      });
      return new Promise(async (resolve, reject) => {
        const options = {
          hostname: process.env.API_TOS_URL,
          port: 181,
          path: '/index.php/api_server/CFStoVTOS_getCntrStock',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: (dataSend),
        };
        try {
          let result: any = await ccurl(dataSend, options);
          let objResult = JSON.parse(result);
          resolve(objResult);
        } catch (err) {
          reject(err);
          return;
        }
      });
    };
    return CFStoVTOS_getCntrStock()
      .then((data: any) => {
        let objTOS: any = {
          TOS_ROWGUID: null,
          FUNCTION_PATCH: "Container",
          FUNCTION_NAME: "Insert",
          POST_DATA: "",
          GET_DATA: JSON.stringify(dtCntrStock),
          MES_STATUS: this.response['Status'],
          CREATE_BY: dtCntrStock.CREATE_BY,
          CREATE_DATE: moment().format("YYYY-MM-DD HH:mm:ss")
        };

        if (data.Payload.length) {
          let tempData = data.Payload.map((item: any) => {
            return {
              CNTRNO: item.CntrNo,
              CNTRSZTP: item.ISO_SZTP,
              BILLOFLADING: item.BLNo,
              BOOKING_NO: item.BookingNo,
              GET_IN: item.DateIn,
              GET_OUT: item.DateOut,
              GETOUT_TRUCK: item.TruckNo,
              JOBMODE_IN: item.CJMode_CD,
              JOBMODE_OUT: item.CJMode_OUT_CD,
              NATUREOFTRANSPORT: item.Transist,
              COMMODITYDESCRIPTION: item.CmdID,
              SEALNO: item.SealNo,
              CONTAINERLOCATION: 'CFS',
              CARGO_WEIGHT: item.CMDWeight,
              REMARK: item.Note,
              CHK_FE: item.Status === 'F' ? true : false,
              CHK_LCL: 1,
              TLHQ: 0,
              ISLOCALFOREIGN: item.IsLocal,
              ID_TOS: item.rowguid,
              CLASS_CODE: dtCntrStock.CLASS_CODE,
            };
          });
          objTOS.POST_DATA = JSON.stringify({
            Status: true,
            Payload: tempData,
            Message: `Truy vấn dữ liệu thành công!`
          });
          objTOS.MES_STATUS = true;
          this.response['Status'] = true;
          this.response['Payload'] = tempData;
          this.response['Message'] = "Nạp dữ liệu thành công!";
          this.API_TOSRepo.create(objTOS);
          return this.response;
        } else {
          objTOS.POST_DATA = JSON.stringify({
            Status: false,
            Payload: [],
            Message: "Không tìm thấy dữ liệu!"
          });
          objTOS.MES_STATUS = false;
          this.response['Status'] = true;
          this.response['Payload'] = [];
          this.response['Message'] = "Không tìm thấy dữ liệu!";
          this.API_TOSRepo.create(objTOS)
          return this.response;
        }
      })
      .catch(err => {
        this.response['Status'] = true;
        this.response['Payload'] = err;
        this.response['Message'] = "Phát sinh lỗi! Vui lòng liên hệ bộ phận kĩ thuật!";
        return this.response;
      });
  }

  //Thoilc(*Note):Hiển thị dữ liệu thông tin cntr biến động
  @post('/dt-cntr-stocks/getItem', spec)
  //  @authenticate({strategy: 'jwt', options: {required: ['frmVoyageManage', 'IsView']}})
  async getItem(
    @requestBody() dtCntrStock: JSONObject
  ): Promise<any> {
    try {
      if (!dtCntrStock.VOYAGEKEY) {
        this.response['Status'] = false;
        this.response['Message'] = "Vui lòng cung cấp tàu chuyến!";
        return this.response;
      }
      if (!(dtCntrStock.CLASS_CODE === 1 || dtCntrStock.CLASS_CODE === 2)) {
        this.response['Status'] = false;
        this.response['Message'] = "Vui lòng cung cấp hướng!";
        return this.response;
      }
      let whereObj: any = {};
      dtCntrStock.CLASS_CODE ? whereObj['CLASS_CODE'] = dtCntrStock.CLASS_CODE : '';
      dtCntrStock.CNTRNO ? whereObj['CNTRNO'] = dtCntrStock.CNTRNO : '';
      dtCntrStock.VOYAGEKEY ? whereObj['VOYAGEKEY'] = dtCntrStock.VOYAGEKEY : '';
      // let _from = dtCntrStock._from ? moment(String(dtCntrStock._from)).utcOffset(-8).format('YYYY-MM-DD HH:mm:ss') : '';
      // let _to = dtCntrStock._to ? moment(String(dtCntrStock._to)).utcOffset(12).format('YYYY-MM-DD HH:mm:ss') : '';
      // _from && _to ? whereObj['GET_IN'] = {
      //   between: [_from, _to]
      // } : '';
      return await this.DtCntStockRepo.find({
        order: ['CREATE_DATE DESC'],
        where: whereObj
      })
        .then((data: any) => {
          if (data.length) {
            this.response['Status'] = true;
            this.response['Payload'] = data;
            this.response['Message'] = "Truy vấn dữ liệu thành công!";
            return this.response;
          } else {
            this.response['Status'] = false;
            this.response['Payload'] = [];
            this.response['Message'] = "Không có dữ liệu cần tìm!";
            return this.response;
          }
        });
    } catch {
      this.response['Status'] = false;
      this.response['Message'] = "Không thể load dữ liệu!";
      return this.response;
    }
  }

  //Thoilc(*Note):Xoá dữ liệu thông tin cntr biến động
  @post('/dt-cntr-stocks/delete', spec)
  //  @authenticate({strategy: 'jwt', options: {required: ['frmVoyageManage', 'IsDelete']}})
  async createVessels(
    @requestBody() dtCntrStock: DT_CNTR_STOCK[]
  ): Promise<any> {
    return Promise.all(dtCntrStock.map(async (item: any) => {
      if (!item.ID) {
        this.response['Status'] = false;
        this.response['Message'] = "Vui lòng cung cấp lại số ID";
        return this.response;
      }
      try {
        await this.DtCntStockRepo.deleteById(item.ID)
          .then(() => {
            this.response['Status'] = true;
            this.response['Payload'] = dtCntrStock;
            this.response['Message'] = "Xoá dữ liệu thành công!";
            return this.response;
          });
      } catch {
        this.response['Status'] = false;
        this.response['Message'] = "Không thể xoá dữ liệu!";
        return this.response;
      }
    }))
      .then(() => {
        return this.response;
      });
  }

  //Thoilc(*Note):Thêm mới và cập nhật dữ liệu thông tin cntr biến động
  @post('/dt-cntr-stocks/insertAndUpdate', spec)
  async insertAndUpdate(
    @requestBody() dtCntrStock: JSONObject[]
  ): Promise<any> {
    let obj: any = {};
    let insertData: any = [];
    let updateData: any = [];
    dtCntrStock.map((item: any) => {
      switch (item.status) {
        case 'insert':
          if (!(item.CLASS_CODE === 1 || item.CLASS_CODE === 2)) {
            this.response['Status'] = false;
            this.response['Message'] = "Vui lòng cung cấp lại hướng!";
            return this.response;
          }
          if (!item.VOYAGEKEY) {
            this.response['Status'] = false;
            this.response['Message'] = "Vui lòng cung cấp tên tàu!";
            return this.response;
          }
          if (!item.CNTRNO) {
            this.response['Status'] = false;
            this.response['Message'] = "Vui lòng cung cấp số cont!";
            return this.response;
          }
          if (!item.CNTRSZTP) {
            this.response['Status'] = false;
            this.response['Message'] = "Vui lòng cung cấp kích cỡ cont!";
            return this.response;
          }
          if (!item.CREATE_BY) {
            this.response['Status'] = false;
            this.response['Message'] = "Vui lòng cung cấp người tạo!";
            return this.response;
          }
          obj = {
            CLASS_CODE: item.CLASS_CODE,
            VOYAGEKEY: item.VOYAGEKEY,
            CNTRNO: item.CNTRNO,
            CNTRSZTP: item.CNTRSZTP,
            BILLOFLADING: item.BILLOFLADING && item.CLASS_CODE === 1 ? item.BILLOFLADING.trim() : null,
            BOOKING_NO: item.BOOKING_NO && item.CLASS_CODE === 2 ? item.BOOKING_NO.trim() : null,
            GET_IN: !item.GET_IN ? null :
              moment(item.GET_IN, "YYYY-MM-DDTHH:mm", true).isValid() ?
                moment(item.GET_IN, "YYYY-MM-DD HH:mm:ss.SSSZ").format("YYYY-MM-DD HH:mm:ss") :
                moment(item.GET_IN, "YYYY-MM-DD HH:mm:s").format("YYYY-MM-DD HH:mm:ss"),
            GET_OUT: !item.GET_OUT ? null :
              moment(item.GET_OUT, "YYYY-MM-DD HH:mm:ss", true).isValid() ?
                moment(item.GET_OUT, "YYYY-MM-DDTHH:mm:ss.SSSZ").format("YYYY-MM-DD HH:mm:ss") :
                moment(item.GET_OUT, "YYYY-MM-DD HH:mm:s").format("YYYY-MM-DD HH:mm:ss"),
            GETOUT_TRUCK: item.GETOUT_TRUCK,
            JOBMODE_IN: item.JOBMODE_IN,
            JOBMODE_OUT: item.JOBMODE_OUT,
            NATUREOFTRANSPORT: item.NATUREOFTRANSPORT,
            COMMODITYDESCRIPTION: item.COMMODITYDESCRIPTION,
            SEALNO: item.SEALNO,
            CONTAINERLOCATION: item.CONTAINERLOCATION,
            CARGO_WEIGHT: item.CARGO_WEIGHT,
            REMARK: item.REMARK,
            CHK_FE: item.CHK_FE ? 1 : 0,
            CHK_LCL: item.CHK_LCL ? 1 : 0,
            ISLOCALFOREIGN: item.ISLOCALFOREIGN,
            ID_TOS: item.ID_TOS,
            CREATE_BY: item.CREATE_BY,
            CREATE_DATE: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
          };
          try {
            insertData.push(obj);
            return this.response;
          } catch {
            this.response['Status'] = false;
            this.response['Message'] = "Không thể lưu mới dữ liệu!";
            return this.response;
          }
        case 'update':
          if (!item.ID) {
            this.response['Status'] = false;
            this.response['Message'] = "Vui lòng cung cấp lại số ID";
            return this.response;
          }
          if (!item.UPDATE_BY) {
            this.response['Status'] = false;
            this.response['Message'] = "Vui lòng cung cấp lại tên người cập nhật";
            return this.response;
          }
          try {
            let updateObj: any = {
              ID: item.ID,
              CLASS_CODE: item.CLASS_CODE,
              VOYAGEKEY: item.VOYAGEKEY,
              CNTRNO: item.CNTRNO,
              CNTRSZTP: item.CNTRSZTP,
              BILLOFLADING: item.BILLOFLADING && item.CLASS_CODE === 1 ? item.BILLOFLADING : null,
              BOOKING_NO: item.BOOKING_NO && item.CLASS_CODE === 2 ? item.BOOKING_NO : null,
              GET_IN: item.GET_IN ? item.GET_IN : null,
              GET_OUT: item.GET_OUT ? item.GET_OUT : null,
              GETOUT_TRUCK: item.GETOUT_TRUCK,
              JOBMODE_IN: item.JOBMODE_IN,
              JOBMODE_OUT: item.JOBMODE_OUT,
              NATUREOFTRANSPORT: item.NATUREOFTRANSPORT,
              COMMODITYDESCRIPTION: item.COMMODITYDESCRIPTION,
              SEALNO: item.SEALNO,
              CONTAINERLOCATION: item.CONTAINERLOCATION,
              CARGO_WEIGHT: item.CARGO_WEIGHT,
              REMARK: item.REMARK,
              CHK_FE: item.CHK_FE ? 1 : 0,
              CHK_LCL: item.CHK_LCL ? 1 : 0,
              ISLOCALFOREIGN: item.ISLOCALFOREIGN,
              TLHQ: item.TLHQ,
              ID_TOS: item.ID_TOS,
              UPDATE_BY: item.UPDATE_BY,
              UPDATE_DATE: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
            };
            item.BILLOFLADING ? updateObj['BILLOFLADING'] = item.BILLOFLADING : '';
            item.BOOKING_NO ? updateObj['BOOKING_NO'] = item.BOOKING_NO : '';
            updateData.push(updateObj);
          } catch {
            this.response['Status'] = false;
            this.response['Message'] = "Không thể cập nhật dữ liệu!";
            return this.response;
          }
      }
    });

    let tempArrDuplicate: any = [];
    let tempArrDuplicateCNTRNO: any = [];
    if (insertData.length) {
      return Promise.all(insertData.map(async (item: any) => {
        let whereObj: any = {
          CLASS_CODE: item.CLASS_CODE,
          VOYAGEKEY: item.VOYAGEKEY,
          CNTRNO: item.CNTRNO,
        };
        item.BILLOFLADING ? whereObj['BILLOFLADING'] = item.BILLOFLADING : '';
        item.BOOKING_NO ? whereObj['BOOKING_NO'] = item.BOOKING_NO : '';
        let checkCode = await this.DtCntStockRepo.find({
          where: whereObj
        });

        if (!checkCode.length) {
          await this.DtCntStockRepo.create(item)
            .then((data: any) => {
              this.response['Status'] = true;
              this.response['Payload'].push(data);
              this.response['Message'] = 'Lưu dữ liệu thành công!';
            });
        } else {
          await tempArrDuplicate.push(checkCode[0]);
          tempArrDuplicateCNTRNO = tempArrDuplicate.map((e: any) => e.CNTRNO);
        }
        return this.response;
      }))
        .then(() => {
          if (tempArrDuplicate.length) {
            this.response['Status'] = false;
            this.response['Payload'] = tempArrDuplicate;
            this.response['Message'] = `Số Cont : ${tempArrDuplicateCNTRNO} đã tạo!`;
            return this.response;
          } else {
            return this.response;
          }
        });
    } 

    if (updateData.length) {
      return Promise.all(updateData.map(async (item: any) => {
        await this.DtCntStockRepo.updateById(item.ID, item)
        this.response['Status'] = true;
        this.response['Payload'].push(item);
        this.response['Message'] = 'Lưu dữ liệu thành công!';
      }))
        .then(() => {
          return this.response;
        });
    } 
    return this.response;
  }
}
