import { JSONObject } from '@loopback/core';
import {
  repository
} from '@loopback/repository';
import { post, requestBody } from '@loopback/rest';
import { DT_PACKAGE_MNF_LDRepository } from '../repositories/dt-package-mnf-ld.repository';
import moment from 'moment';
import { ccurl } from '../general';
import { DT_CNTR_MNF_LD } from '../models';
import { API_TOSRepository, DT_CNTR_MNF_LDRepository, DT_ORDERRepository } from '../repositories';
const spec = {
  responses: {
    '200': {
      description: 'DT_CNTR_MNF_LD detail list of filter',
      content: {
        'application/json': {
          schema: {},
        }
      }
    }
  }
}

export class DtCntrMnfLdController {
  constructor(
    @repository(DT_CNTR_MNF_LDRepository)
    public dtMnfRepository: DT_CNTR_MNF_LDRepository,
    @repository(DT_ORDERRepository)
    public dtOrderRepo: DT_ORDERRepository,
    @repository(API_TOSRepository)
    public API_TOSRepo: API_TOSRepository,
    @repository(DT_PACKAGE_MNF_LDRepository)
    public dtPackageMnfRepo: DT_PACKAGE_MNF_LDRepository,
  ) { }

  public response: any = {
    Status: false,
    Payload: [],
    Message: ""
  };


  @post('/dt-cntr-mnf-ld/CFStoVTOS_getManifestCntr', spec)
  async CFStoVTOS_getManifestCntr(
    @requestBody() dataReq: JSONObject
  ): Promise<any> {
    if (!dataReq.TOS_SHIPKEY) {
      this.response['Status'] = false;
      this.response['Message'] = "Vui lòng cung cấp lại mã tàu từ TOS";
      return this.response;
    }
    if (!dataReq.CLASS_CODE) {
      this.response['Status'] = false;
      this.response['Message'] = "Vui lòng cung cấp lại hướng!";
      return this.response;
    }
    if (!dataReq.CREATE_BY) {
      this.response['Status'] = false;
      this.response['Message'] = "Vui lòng cung cấp lại tên người truy vấn dữ liệu!";
      return this.response;
    }
    const CFStoVTOS_getManifestCntr = async () => {
      let dataSend: any = {
        TOS_SHIPKEY: dataReq.TOS_SHIPKEY,
        CLASS_CODE: dataReq.CLASS_CODE
      };
      dataReq.CNTRNO ? dataSend['CntrNo'] = dataReq.CNTRNO : ''
      dataSend = JSON.stringify(dataSend)
      return new Promise(async (resolve, reject) => {
        const options = {
          hostname: process.env.API_TOS_URL,
          port: 181,
          path: '/index.php/api_server/CFStoVTOS_getManifestCntr',
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
      })
    }
    return CFStoVTOS_getManifestCntr()
      .then((data: any) => {
        let objTOS: any = {
          TOS_ROWGUID: null,
          FUNCTION_PATCH: "Manifest",
          FUNCTION_NAME: "Insert",
          POST_DATA: "",
          GET_DATA: JSON.stringify(dataReq),
          MES_STATUS: this.response['Status'],
          CREATE_BY: dataReq.CREATE_BY,
          CREATE_DATE: moment().format("YYYY-MM-DD HH:mm:ss")
        }
        if (data.Payload.length) {
          let tempData = data.Payload.map((item: any) => {
            return {
              BILLOFLADING: item.BLNo,
              BOOKING_NO: item.BookingNo,
              SEALNO: item.SealNo,
              CNTRNO: item.CntrNo,
              CNTRSZTP: item.ISO_SZTP,
              ITEM_TYPE_CODE: item.CARGO_TYPE,
              STATUSOFGOOD: item.Status,
              COMMODITYDESCRIPTION: item.CmdID,
            }
          })
          objTOS.POST_DATA = JSON.stringify({
            Status: true,
            Payload: tempData,
            Message: `Truy vấn dữ liệu thành công!`
          });
          objTOS.MES_STATUS = true;
          this.response['Status'] = true;
          this.response['Payload'] = tempData;
          this.response['Message'] = `Truy vấn dữ liệu thành công!`;
          this.API_TOSRepo.create(objTOS)
          return this.response
        } else {
          objTOS.POST_DATA = JSON.stringify({
            Status: false,
            Payload: [],
            Message: "Không tìm thấy dữ liệu!"
          });
          objTOS.MES_STATUS = false;
          this.response['Status'] = false;
          this.response['Payload'] = [];
          this.response['Message'] = "Không tìm thấy dữ liệu!";
          this.API_TOSRepo.create(objTOS);
          return this.response;
        }
      })
      .catch(err => {
        this.response['Status'] = false;
        this.response['Payload'] = err;
        this.response['Message'] = "Phát sinh lỗi! Vui lòng liên hệ bộ phận kĩ thuật!";
        return this.response;
      })
  }

  //ThachHD(*Note)-Hiển thị dữ liệu manifest
  @post('/dt-cntr-mnf-ld/view', spec)
  async view(
    @requestBody() dtMnf: JSONObject
  ): Promise<any> {
    if (!dtMnf.VOYAGEKEY) {
      this.response['Status'] = false;
      this.response['Message'] = "Vui lòng cung cấp lại key tàu!";
      return this.response;
    }
    if (!(dtMnf.CLASS_CODE === 1 || dtMnf.CLASS_CODE === 2)) {
      this.response['Status'] = false;
      this.response['Message'] = "Vui lòng cung cấp hướng nhập/xuất!";
      return this.response;
    }

    let fields: any = Array.isArray(dtMnf.fields) ? dtMnf.fields : [];
    let whereObj: any = {};
    whereObj['VOYAGEKEY'] = dtMnf.VOYAGEKEY;
    whereObj['CLASS_CODE'] = dtMnf.CLASS_CODE;
    return this.dtMnfRepository.find({
      order: ['CREATE_DATE DESC'],
      where: whereObj,
      fields: fields
    }).then(data => {
      if (data) {
        this.response['Status'] = true;
        this.response['Payload'] = data;
        this.response['Message'] = "Nạp dữ liệu thành công";
      }

      return this.response;
    })
  }

  @post('/dt-cntr-mnf-ld/getCont', spec)
  async get(
    @requestBody() dtMnf: JSONObject
  ): Promise<any> {
    if (!dtMnf.VOYAGEKEY) {
      this.response['Status'] = false;
      this.response['Message'] = "Vui lòng cung cấp lại key tàu!";
      return this.response;
    }
    //API này dùng để load những cont theo masterbill chưa lưu lệnh
    // 1. tìm tất cả cont trong masterbill ở bảng dt-cntr-mnf-ld, 2. truy vấn trong bảng dt-order có cont đó chưa,
    let fields: any = Array.isArray(dtMnf.fields) ? dtMnf.fields : [];
    let whereObj: any = {};
    dtMnf.VOYAGEKEY ? whereObj['VOYAGEKEY'] = dtMnf.VOYAGEKEY : '';
    dtMnf.BILLOFLADING ? whereObj['BILLOFLADING'] = dtMnf.BILLOFLADING : '';
    dtMnf.BOOKING_NO ? whereObj['BOOKING_NO'] = dtMnf.BOOKING_NO : '';
    dtMnf.CLASS_CODE ? whereObj['CLASS_CODE'] = dtMnf.CLASS_CODE : '';

    if (!(whereObj['BILLOFLADING'] || whereObj['BOOKING_NO'])) {
      this.response['Status'] = false;
      this.response['Message'] = "Vui lòng cung cấp lại số vận đơn hoặc số booking!";
      return this.response;
    }
    if (!(whereObj['CLASS_CODE'] === 1 || whereObj['CLASS_CODE'] === 2)) {
      this.response['Status'] = false;
      this.response['Message'] = "Vui lòng cung cấp lại hướng!";
      return this.response;
    }
    let tempCont: any = await this.dtMnfRepository.find({
      where: whereObj,
      fields: fields,
    })
      .then(data => {
        return data.map(item => item.CNTRNO)
      })
      .catch(err => {
        this.response['Status'] = false;
        this.response['Payload'] = err;
        this.response['Message'] = "Nạp dữ liệu thất bại!";
      })
    let tempOrdered: any = await this.dtOrderRepo.find({
      where: {
        VOYAGEKEY: whereObj['VOYAGEKEY'],
        CNTRNO: { inq: tempCont },
        GATE_CHK: false
      }
    })
      .then(data => {
        return data.map(item => item.CNTRNO)
      })
      .catch(err => {
        this.response['Status'] = false;
        this.response['Payload'] = err;
        this.response['Message'] = "Nạp dữ liệu thất bại!";
      })
    tempOrdered = [...new Set(tempOrdered)]

    let arr: any[] = [];
    for (let i = 0; i < tempCont.length; i++) {
      if (!tempOrdered.includes(tempCont[i])) {
        arr.push(tempCont[i])
      }
    }
    await this.dtMnfRepository.find({
      where: {
        VOYAGEKEY: whereObj['VOYAGEKEY'],
        CNTRNO: { inq: arr },
        CLASS_CODE: whereObj['CLASS_CODE'],
      },
      include: [
        {
          relation: "contInfor",
        }
      ],
    })
      .then(data => {
        if (data.length) {
          this.response['Status'] = true;
          this.response['Payload'] = data.filter(item => item.contInfor !== undefined);
          this.response['Message'] = "Nạp dữ liệu thành công!";
        } else {
          this.response['Status'] = false;
          this.response['Payload'] = data;
          this.response['Message'] = "Không tìm thấy dữ liệu!";
        }
      })
      .catch(err => {
        this.response['Status'] = false;
        this.response['Payload'] = err;
        this.response['Message'] = "Nạp dữ liệu thất bại!";
      })
    return this.response
  }
  //ThachHD(*Note)-Xoá dữ liệu manifest
  // @post('/dt-cntr-mnf-ld/delete', spec)
  // async delete(
  //   @requestBody() dtMnf: DT_CNTR_MNF_LD[],
  // ): Promise<any> {
  //   return Promise.all(dtMnf.map(async item => {
  //     if (!item.ID) {
  //       this.response['Status'] = false;
  //       this.response['Message'] = "Vui lòng cung cấp lại số ID!";
  //       return this.response;
  //     }
  //     try {
  //       return await this.dtMnfRepository.deleteById(item.ID)
  //         .then(() => {
  //           this.response['Status'] = true;
  //           this.response['Message'] = "Xóa dữ liệu thành công!";
  //           return this.response;
  //         })
  //     } catch {
  //       this.response['Status'] = false;
  //       this.response['Message'] = "Xóa dữ liệu không thành công!";
  //     }
  //   })).then((value) => {
  //     return this.response;
  //   })
  // }

  //Binh(*Note)-Xoá dữ liệu manifestcont và BKHH
  @post('/dt-cntr-mnf-ld/deleteCntrAndGoods', spec)
  async delete(
    @requestBody() dtMnf: JSONObject,
  ): Promise<any> {
    let whereObj = {
      HOUSE_BILL: dtMnf.BILLOFLADING === '' ? null : dtMnf.BILLOFLADING,
      CNTRNO: dtMnf.CNTRNO,
      VOYAGEKEY: dtMnf.VOYAGEKEY
    }
    if (!dtMnf.ID) {
      this.response['Status'] = false;
      this.response['Message'] = "Vui lòng cung cấp lại số ID!";
      return this.response;
    }
    try {
      await this.dtMnfRepository.deleteById(Number(dtMnf.ID))
        .then(() => {
          this.response['Status'] = true;
          this.response['Message'] = "Xóa dữ liệu thành công!";
          return this.response;
        })
      await this.dtPackageMnfRepo.deleteAll(Object(whereObj))
        .then(() => {
            this.response['Status'] = true;
            this.response['Message'] = "Xóa dữ liệu thành công!";
          return this.response;
        });
      return this.response;
    } catch {
      this.response['Status'] = false;
      this.response['Message'] = "Xóa dữ liệu không thành công!";
    }
  }

  //ThachHD(*Note)-Thêm mới và cập nhật dữ liệu manifest
  @post('/dt-cntr-mnf-ld/insertAndUpdate', spec)
  async insertAndUpdate(
    @requestBody() dtMnf: DT_CNTR_MNF_LD[]
  ): Promise<any> {
    let tempArrDuplicate: any = [];
    let tempArrDuplicateCNTRNO: any = [];
    return Promise.all(dtMnf.map(async (item: any) => {
      switch (item.status) {
        case 'insert':
          if (!item.VOYAGEKEY) {
            this.response['Status'] = false;
            this.response['Message'] = 'Vui lòng cung cấp lại key tàu!'
            return this.response;
          }
          if (!(item.CLASS_CODE === 1 || item.CLASS_CODE === 2)) {
            this.response['Status'] = false;
            this.response['Message'] = "Vui lòng cung cấp hướng nhập xuất!";
            return this.response;
          }
          if (!item.TRANSPORTIDENTITY) {
            this.response['Status'] = false;
            this.response['Message'] = 'Vui lòng cung cấp lại tên tàu!'
            return this.response;
          }
          if (!item.NUMBEROFJOURNEY) {
            this.response['Status'] = false;
            this.response['Message'] = 'Vui lòng cung cấp lại số chuyến!'
            return this.response;
          }
          if (!item.ARRIVALDEPARTURE) {
            this.response['Status'] = false;
            this.response['Message'] = 'Vui lòng cung cấp lại ngày tàu cập/rời!'
            return this.response;
          }
          if (!item.CNTRNO) {
            this.response['Status'] = false;
            this.response['Message'] = 'Vui lòng cung cấp lại số container!'
            return this.response;
          }
          if (!item.CNTRSZTP) {
            this.response['Status'] = false;
            this.response['Message'] = 'Vui lòng cung cấp lại kích cở ISO!'
            return this.response;
          }
          if (!(item.STATUSOFGOOD === true || item.STATUSOFGOOD === false)) {
            this.response['Status'] = false;
            this.response['Message'] = 'Vui lòng cung cấp lại trạng thái hàng hóa!'
            return this.response;
          }
          if (!item.ITEM_TYPE_CODE) {
            this.response['Status'] = false;
            this.response['Message'] = 'Vui lòng cung cấp lại mã loại hàng hóa!'
            return this.response;
          }
          if (!item.CREATE_BY) {
            this.response['Status'] = false;
            this.response['Message'] = 'Vui lòng cung cấp lại tên người tạo!'
            return this.response;
          }
          if (item.CLASS_CODE === 1 ? !item.BILLOFLADING : !item.BOOKING_NO) {
            return;
          } 
            let whereObj: any = {
            [item.CLASS_CODE === 1 ? "BILLOFLADING" : "BOOKING_NO"]: item.CLASS_CODE === 1 ? item.BILLOFLADING : item.BOOKING_NO,
            VOYAGEKEY: item.VOYAGEKEY,
          };
          let obj: any = {
            VOYAGEKEY: item.VOYAGEKEY,
            CLASS_CODE: item.CLASS_CODE,
            TRANSPORTIDENTITY: item.TRANSPORTIDENTITY,
            NUMBEROFJOURNEY: item.NUMBEROFJOURNEY,
            ARRIVALDEPARTURE: item.ARRIVALDEPARTURE,
            BILLOFLADING: item.BILLOFLADING,
            BOOKING_NO: item.BOOKING_NO,
            SEALNO: item.SEALNO,
            CNTRNO: item.CNTRNO,
            CNTRSZTP: item.CNTRSZTP,
            STATUSOFGOOD: item.STATUSOFGOOD === true ? 1 : 0,
            ITEM_TYPE_CODE: item.ITEM_TYPE_CODE,
            COMMODITYDESCRIPTION: item.COMMODITYDESCRIPTION,
            CREATE_BY: item.CREATE_BY,
            CREATE_DATE: moment().format("YYYY-MM-DD HH:mm:ss"),
          }
          //Check exist CNTR
          // let whereObj: any = {
          //   VOYAGEKEY: item.VOYAGEKEY,
          //   CLASS_CODE: item.CLASS_CODE,
          //   NUMBEROFJOURNEY: item.NUMBEROFJOURNEY,
          //   CNTRNO: item.CNTRNO,
          // }
          // let checkCode = await this.dtMnfRepository.find({
          //   where: whereObj
          // })
          // if (checkCode.length === 0) {
          await this.dtMnfRepository.create(obj)
            .then((data: any) => {
              this.response['Status'] = true;
              this.response['Payload'].push(data);
              this.response['Message'] = "Lưu dữ liệu thành công!";
            })
            .catch(err => {
              this.response['Status'] = false;
              this.response['Payload'] = err
              this.response['Message'] = "Phát sinh lỗi! Vui lòng liên hệ bộ phận kĩ thuật!";
            })
          if (item.CLASS_CODE === 2) {
            item.BOOKING_FWD.map(async (data: any) => {
              await this.dtPackageMnfRepo.updateAll({ CNTRNO: item.CNTRNO, CNTRSZTP: item.CNTRSZTP, ITEM_TYPE_CODE_CNTR: item.ITEM_TYPE_CODE_CNTR }, {VOYAGEKEY: item.VOYAGEKEY, BOOKING_FWD: data})
               .then(() => {
                this.response['Message'] = "Lưu dữ liệu thành công!";
              });
              return this.response;
            })
          }
          // } else {
          //   await tempArrDuplicate.push(checkCode[0]);
          //   tempArrDuplicateCNTRNO = tempArrDuplicate.map((e: any) => e.CNTRNO);
          // }
          return this.response
        case 'update':
          if (!item.ID) {
            this.response['Status'] = false;
            this.response['Message'] = 'Vui lòng cung cấp lại số ID!';
            return this.response
          }
          if (!item.UPDATE_BY) {
            this.response['Status'] = false;
            this.response['Message'] = 'Vui lòng cung cấp lại tên người cập nhật!';
            return this.response
          }
          item.UPDATE_DATE = moment().format("YYYY-MM-DD HH:mm:ss");
          try {
             await this.dtMnfRepository.updateById(item.ID, item)
              .then(() => {
                this.response['Status'] = true;
                this.response['Payload'].push(item);
                this.response['Message'] = "Lưu dữ liệu thành công!";
                return this.response;
              })
              await this.dtPackageMnfRepo.updateAll({ CNTRSZTP: item.CNTRSZTP }, whereObj)
              .then(() => {
                this.response['Message'] = "Lưu dữ liệu thành công!";
                return this.response;
              });
          } catch {
            this.response['Status'] = false;
            this.response['Message'] = "Không thể lưu mới dữ liệu!";
            return this.response;
          }
        default:
          this.response['Status'] = false;
          this.response['Message'] = "Vui lòng cung cấp lại trạng thái!";
          return this.response;
      }
    }))
      .then(returnValue => {
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
}
