import { JSONObject } from '@loopback/core';
import {
  repository
} from '@loopback/repository';
import { post, requestBody } from '@loopback/rest';
import moment from 'moment';
import { mapDataWithKey } from '../general';
import { DT_PACKAGE_MNF_LD } from '../models/dt-package-mnf-ld.model';
import { DtPackageStockRepository, DT_CNTR_MNF_LDRepository, DT_ORDERRepository } from '../repositories';
import { BS_CUSTOMERRepository } from '../repositories/bs-customer.repository';
import { BsItemTypeRepository } from '../repositories/bs-item-type.repository';
import { BsUnitRepository } from '../repositories/bs-unit.repository';
import { DT_PACKAGE_MNF_LDRepository } from '../repositories/dt-package-mnf-ld.repository';
const spec = {
  responses: {
    '200': {
      description: 'DT_PACKAGE_MNF_LD detail list of filter',
      content: {
        'application/json': {
          schema: {},
        }
      }
    }
  }
}

export class DtPackageMnfLdController {
  constructor(
    @repository(DT_CNTR_MNF_LDRepository)
    public DT_CNTR_MNF_LDRepository: DT_CNTR_MNF_LDRepository,
    @repository(DT_PACKAGE_MNF_LDRepository)
    public dtPackageMnfLD: DT_PACKAGE_MNF_LDRepository,
    @repository(BsItemTypeRepository)
    public bsItemType: BsItemTypeRepository,
    @repository(BsUnitRepository)
    public bsUnit: BsUnitRepository,
    @repository(BS_CUSTOMERRepository)
    public bsCustomer: BS_CUSTOMERRepository,
    @repository(DT_ORDERRepository)
    public dtOrderRepo: DT_ORDERRepository,
    @repository(DtPackageStockRepository)
    public dtPackageStockRepo: DtPackageStockRepository,
  ) { }

  public response: any = {
    Status: false,
    Payload: [],
    Message: ""
  };

  //Thoilc(*Note)-Hiển thị bảng kê hàng hoá theo mã code
  @post('/dt-package-mnf-ld/viewCode', spec)
  async viewCode(): Promise<any> {
    let Unit: any = await this.bsUnit.find({
      fields: ['ID', 'UNIT_CODE']
    });

    let ItemType: any = await this.bsItemType.find({
      fields: ['ID', 'ITEM_TYPE_CODE']
    });

    let Customer: any = await this.bsCustomer.find({
      fields: ['ID', 'CUSTOMER_CODE', 'CUSTOMER_NAME']
    });
    return {
      Status: true,
      Payload: { Unit: Unit, ItemType: ItemType, Customer: Customer },
      Message: 'Load dữ liệu thành công!'
    };
  }

  //ThachHD(*Note)-Thêm mới và cập nhật bảng kê hàng hoá
  @post('/dt-package-mnf-ld/insertAndUpdate', spec)
  async createUpdate(
    @requestBody() manifestLd: JSONObject[],
  ): Promise<any> {
    let obj: any;
    let insertData: any = [];
    let updateData: any = [];
    const promises = manifestLd.map(async (item: any) => {
      switch (item.status) {
        case 'insert':
          if (!item.VOYAGEKEY) {
            this.response['Status'] = false;
            this.response['Message'] = "Vui lòng cung cấp lại key tàu!";
            return this.response;
          }
          if (!(item.CLASS_CODE === 1 || item.CLASS_CODE === 2)) {
            this.response['Status'] = false;
            this.response['Message'] = "Vui lòng cung cấp hướng nhập/xuất!";
            return this.response;
          }
          if (!item.TRANSPORTIDENTITY) {
            this.response['Status'] = false;
            this.response['Message'] = "Vui lòng cung cấp lại tên tàu!";
            return this.response;
          }
          if (!item.NUMBEROFJOURNEY) {
            this.response['Status'] = false;
            this.response['Message'] = "Vui lòng cung cấp lại số chuyến";
            return this.response;
          }
          if (!item.ARRIVALDEPARTURE) {
            this.response['Status'] = false;
            this.response['Message'] = "Vui lòng cung cấp lại ngày tàu đến hoặc tàu rời";
            return this.response;
          }
          if (!item.CUSTOMER_NAME) {
            this.response['Status'] = false;
            this.response['Message'] = "Vui lòng cung cấp lại tên khách hàng";
            return this.response;
          }
          if (!item.CARGO_PIECE) {
            this.response['Status'] = false;
            this.response['Message'] = "Vui lòng cung cấp lại số lượng";
            return this.response;
          }
          if (!item.UNIT_CODE) {
            this.response['Status'] = false;
            this.response['Message'] = "Vui lòng cung cấp lại đơn vị tính";
            return this.response;
          }
          if (!item.CARGO_WEIGHT) {
            this.response['Status'] = false;
            this.response['Message'] = "Vui lòng cung cấp lại trọng lượng";
            return this.response;
          }
          if (!item.CBM) {
            this.response['Status'] = false;
            this.response['Message'] = "Vui lòng cung cấp lại số khối";
            return this.response;
          }
          if (!item.CONSIGNEE) {
            this.response['Status'] = false;
            this.response['Message'] = "Vui lòng cung cấp lại tên đại lý";
            return this.response;
          }
          if (!item.CREATE_BY) {
            this.response['Status'] = false;
            this.response['Message'] = "Vui lòng cung cấp lại tên người tạo";
            return this.response;
          }
          if (item.CLASS_CODE === 1) {
            obj = {
              VOYAGEKEY: item.VOYAGEKEY,
              CLASS_CODE: 1,
              TRANSPORTIDENTITY: item.TRANSPORTIDENTITY,
              NUMBEROFJOURNEY: item.NUMBEROFJOURNEY,
              ARRIVALDEPARTURE: moment(item.ARRIVALDEPARTURE, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss'),
              CNTRNO: item.CNTRNO,
              CNTRSZTP: item.CNTRSZTP,
              BILLOFLADING: item.HOUSE_BILL,
              BOOKING_NO: item.BOOKING_NO,
              ITEM_TYPE_CODE_CNTR: item.ITEM_TYPE_CODE_CNTR,
              HOUSE_BILL: item.HOUSE_BILL,
              LOT_NO: item.LOT_NO,
              SHIPMARKS: item.SHIPMARKS,
              CUSTOMER_NAME: item.CUSTOMER_NAME,
              ITEM_TYPE_CODE: item.ITEM_TYPE_CODE,
              COMMODITYDESCRIPTION: item.COMMODITYDESCRIPTION,
              CARGO_PIECE: item.CARGO_PIECE,
              UNIT_CODE: item.UNIT_CODE,
              CARGO_WEIGHT: item.CARGO_WEIGHT,
              CBM: item.CBM,
              DECLARE_NO: item.DECLARE_NO,
              NOTE: item.NOTE,
              CONSIGNEE: item.CONSIGNEE,
              CREATE_BY: item.CREATE_BY,
              CREATE_DATE: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
            };
            try {
              insertData.push(obj);
              return;
            } catch {
              this.response['Status'] = false;
              this.response['Message'] = "Không thể lưu mới dữ liệu, nguyên nhân bạn cung cấp dữ liệu chưa đúng hoặc độ dài vượt quá ký tự!";
              return this.response;
            }
          } else {
            obj = {
              VOYAGEKEY: item.VOYAGEKEY,
              CLASS_CODE: 2,
              TRANSPORTIDENTITY: item.TRANSPORTIDENTITY,
              NUMBEROFJOURNEY: item.NUMBEROFJOURNEY,
              ARRIVALDEPARTURE: moment(item.ARRIVALDEPARTURE, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss'),
              CNTRNO: item.CNTRNO,
              CNTRSZTP: item.CNTRSZTP,
              ITEM_TYPE_CODE_CNTR: item.ITEM_TYPE_CODE_CNTR,
              BOOKING_FWD: item.BOOKING_FWD,
              BILLOFLADING: item.BILLOFLADING,
              BOOKING_NO: item.BOOKING_NO,
              LOT_NO: item.LOT_NO,
              SHIPMARKS: item.SHIPMARKS,
              CUSTOMER_NAME: item.CUSTOMER_NAME,
              ITEM_TYPE_CODE: item.ITEM_TYPE_CODE,
              COMMODITYDESCRIPTION: item.COMMODITYDESCRIPTION,
              CARGO_PIECE: Number(item.CARGO_PIECE),
              UNIT_CODE: item.UNIT_CODE,
              CARGO_WEIGHT: parseFloat(item.CARGO_WEIGHT),
              CBM: parseFloat(item.CBM),
              DECLARE_NO: item.DECLARE_NO,
              NOTE: item.NOTE,
              CONSIGNEE: item.CONSIGNEE,
              CREATE_BY: item.CREATE_BY,
              CREATE_DATE: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
            };
            try {
              insertData.push(obj);
            } catch {
              this.response['Status'] = false;
              this.response['Payload'] = [];
              this.response['Message'] = "Không thể lưu mới dữ liệu!";
              return this.response;
            }
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
            let temp: any = await this.DT_CNTR_MNF_LDRepository.find({
              where: {
                CNTRNO: item.CNTRNO,
                VOYAGEKEY: item.VOYAGEKEY
              },
              fields: ['CNTRSZTP']
            });
            let updateObj: any = {
              ID: item.ID,
              VOYAGEKEY: item.VOYAGEKEY,
              CLASS_CODE: item.CLASS_CODE,
              TRANSPORTIDENTITY: item.TRANSPORTIDENTITY,
              NUMBEROFJOURNEY: item.NUMBEROFJOURNEY,
              ARRIVALDEPARTURE: moment(item.ARRIVALDEPARTURE, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss'),
              CNTRNO: item.CNTRNO,
              CNTRSZTP: temp[0]?.CNTRSZTP ?? null,
              BILLOFLADING: item.BILLOFLADING,
              BOOKING_NO: item.BOOKING_NO,
              ITEM_TYPE_CODE_CNTR: item.ITEM_TYPE_CODE_CNTR,
              HOUSE_BILL: item.HOUSE_BILL,
              LOT_NO: item.LOT_NO,
              SHIPMARKS: item.SHIPMARKS,
              CUSTOMER_NAME: item.CUSTOMER_NAME,
              ITEM_TYPE_CODE: item.ITEM_TYPE_CODE,
              COMMODITYDESCRIPTION: item.COMMODITYDESCRIPTION,
              CARGO_PIECE: Number(item.CARGO_PIECE),
              UNIT_CODE: item.UNIT_CODE,
              CARGO_WEIGHT: parseFloat(item.CARGO_WEIGHT),
              CBM: parseFloat(item.CBM),
              DECLARE_NO: item.DECLARE_NO,
              NOTE: item.NOTE,
              CONSIGNEE: item.CONSIGNEE,
              UPDATE_BY: item.UPDATE_BY,
              UPDATE_DATE: moment().format("YYYY-MM-DD HH:mm:ss"),
            };
            await updateData.push(updateObj);
            return;
          } catch {
            this.response['Status'] = false;
            this.response['Message'] = "Không thể lưu mới dữ liệu, nguyên nhân bạn cung cấp dữ liệu chưa đúng hoặc độ dài vượt quá ký tự!";
            return this.response;
          }
        default:
          this.response['Status'] = false;
          this.response['Message'] = "Vui lòng cung cấp trạng thái!";
          return this.response;
      }
    });


    await Promise.all(promises);
    // update lại nếu user chọn đại lí khác khi chưa nạp dữ liệu
    if (insertData.length) {
      let flag: boolean = false;
      await this.dtPackageMnfLD.find({
        where: {
          VOYAGEKEY: insertData[0].VOYAGEKEY,
          CNTRNO: insertData[0].CNTRNO
        }
      })
        .then(data => {
          if (data.length && data[0].CONSIGNEE !== insertData[0].CONSIGNEE) {
            flag = true;
          }
        })
      if (flag) {
        await this.dtPackageMnfLD.updateAll({ CONSIGNEE: insertData[0].CONSIGNEE }, {
          VOYAGEKEY: insertData[0].VOYAGEKEY,
          CNTRNO: insertData[0].CNTRNO
        })
      }
    }

    try {
      if (insertData.length) {
        let checks = insertData.map((item: any) => {
          if (item.HOUSE_BILL) {
            return [
              { VOYAGEKEY: item.VOYAGEKEY },
              { HOUSE_BILL: item.HOUSE_BILL },
              { CLASS_CODE: item.CLASS_CODE }
            ];
          }
          if (item.BOOKING_FWD) {
            return [
              { VOYAGEKEY: item.VOYAGEKEY },
              { BOOKING_FWD: item.BOOKING_FWD },
              { CLASS_CODE: item.CLASS_CODE }
            ];
          }
        });

        const checkCode: any = await this.dtPackageMnfLD.find({
          where: {
            or: checks.map((data: any) => {
              return { and: data }
            })
          }
        });
        if (checkCode.length) {
          if (checkCode[0].HOUSE_BILL) {
            this.response['Status'] = false;
            this.response['Payload'] = [];
            this.response['Message'] = "Hiện tại thông tin house_bill này đã được đăng ký từ trước!";
            return this.response;
          }
          if (checkCode[0].BOOKING_FWD) {
            this.response['Status'] = false;
            this.response['Payload'] = [];
            this.response['Message'] = "Hiện tại thông tin booking_no này đã được đăng ký từ trước!";
            return this.response;
          }
        } else {
          this.response['Status'] = true;
          this.response['Payload'] = await this.dtPackageMnfLD.createAll(insertData);
          this.response['Message'] = 'Lưu dữ liệu thành công!';
          return this.response;
        }
      } else {
        this.response['Status'] = false;
        this.response['Payload'] = [];
        this.response['Message'] = 'Không có dữ liệu để thêm mới hoặc độ dài ký tự vượt quá giới hạn cho phép!';
      }

      if (updateData.length) {
        return Promise.all(updateData.map(async (item: any) => {
          await this.dtPackageMnfLD.updateById(item.ID, item)
          this.response['Status'] = true;
          this.response['Payload'].push(item);
          this.response['Message'] = 'Lưu dữ liệu thành công!';
        }))
          .then(() => {
            return this.response;
          });
      } else {
        this.response['Status'] = false;
        this.response['Payload'] = [];
        this.response['Message'] = 'Không có dữ liệu để cập nhật hoặc độ dài ký tự vượt quá giới hạn cho phép!';
      }
    } catch (err) {
      this.response['Status'] = false;
      this.response['Payload'] = [];
      this.response['Message'] = 'Lỗi do dữ liệu bạn cung cấp chưa đúng hoặc độ dài vượt quá ký tự';
      return this.response;
    }
    return this.response;
  }

  @post('/dt-package-mnf-ld/view', spec)
  async view(
    @requestBody() dtPackage: DT_PACKAGE_MNF_LD,
  ): Promise<any> {
    if (!dtPackage.VOYAGEKEY) {
      this.response['Status'] = false;
      this.response['Message'] = 'Vui lòng cung cấp key tàu!'
      return this.response;
    }
    if (!(dtPackage.CLASS_CODE === 1 || dtPackage.CLASS_CODE === 2)) {
      this.response['Status'] = false;
      this.response['Message'] = 'Vui lòng cung cấp hướng nhập hoặc xuất!'
      return this.response;
    }
    if (!dtPackage.CNTRNO && dtPackage.CLASS_CODE === 1) {
      this.response['Status'] = false;
      this.response['Message'] = 'Vui lòng cung cấp số container!'
      return this.response;
    }
    let obj: any = {
      VOYAGEKEY: dtPackage.VOYAGEKEY,
      CLASS_CODE: dtPackage.CLASS_CODE,
      ITEM_TYPE_CODE: dtPackage.ITEM_TYPE_CODE,
    };
    dtPackage.CNTRNO ? obj['CNTRNO'] = dtPackage.CNTRNO : '';
    dtPackage.CNTRSZTP ? obj['CNTRSZTP'] = dtPackage.CNTRSZTP : '';
    await this.dtPackageMnfLD.find({
      include: [
        { relation: 'consigneeInfo' }
      ],
      where: obj,
      order: ['CREATE_DATE DESC']
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
    return this.response;
  }

  //ThachHD(*Note)-Xoá dữ liệu bảng kê
  @post('/dt-package-mnf-ld/delete', spec)
  async delete(
    @requestBody() dtPackageMnfLD: DT_PACKAGE_MNF_LD[],
  ): Promise<any> {
    return Promise.all(dtPackageMnfLD.map(async item => {
      if (!item.ID) {
        this.response['Status'] = false;
        this.response['Message'] = "Vui lòng cung cấp lại số ID!";
        return this.response;
      }
      let whereObj = {
        [item.CLASS_CODE === 1 ? 'BILLOFLADING' : 'BOOKING_NO']: item[item.CLASS_CODE === 1 ? "HOUSE_BILL" : "BOOKING_NO"],
        VOYAGEKEY: item.VOYAGEKEY,
        CNTRNO: item.CNTRNO,
      };
      try {
        await this.dtPackageMnfLD.deleteById(item.ID)
          .then(() => {
            this.response['Status'] = true;
            this.response['Message'] = "Xóa dữ liệu thành công!";
            return this.response;
          });
        await this.DT_CNTR_MNF_LDRepository.deleteAll(Object(whereObj))
          .then(() => {
            this.response['Status'] = true;
            this.response['Message'] = "Xóa dữ liệu thành công!";
            return this.response;
          });
      } catch {
        this.response['Status'] = false;
        this.response['Message'] = "Xóa dữ liệu không thành công!";
      }
    })).then(() => {
      return this.response;
    })
  }

  @post('/dt-package-mnf-ld/get', spec)
  async getViaBillOrCont(
    @requestBody() dtpackageReq: JSONObject
  ): Promise<any> {
    if (!dtpackageReq.VOYAGEKEY) {
      this.response['Status'] = false;
      this.response['Message'] = 'Vui lòng cung cấp lại mã tàu chuyến!';
      return this.response
    }
    let whereObj: any = { VOYAGEKEY: dtpackageReq.VOYAGEKEY };
    dtpackageReq.BILLOFLADING ? whereObj['BILLOFLADING'] = dtpackageReq.BILLOFLADING : '';
    dtpackageReq.CNTRNO ? whereObj['CNTRNO'] = dtpackageReq.CNTRNO : '';
    dtpackageReq.CLASS_CODE ? whereObj['CLASS_CODE'] = dtpackageReq.CLASS_CODE : '';
    if (!(dtpackageReq.CNTRNO)) {
      this.response['Status'] = false;
      this.response['Message'] = 'Vui lòng cung số container!';
      return this.response
    }
    if (!(dtpackageReq.CLASS_CODE === 1 || dtpackageReq.CLASS_CODE === 2)) {
      this.response['Status'] = false;
      this.response['Message'] = "Vui lòng cung cấp hướng nhập/xuất!";
      return this.response;
    }

    let checkCont: any = await this.dtOrderRepo.find({
      where: whereObj
    })
      .then((data) => {
        if (data.length === 0) {
          return false
        } else if ((data.filter((item) => item.GATE_CHK === false).length !== 0)) {
          return true
        } else {
          return false
        }
      })
    if (checkCont) {
      this.response['Status'] = false;
      this.response['Message'] = `Số Container : ${dtpackageReq.CNTRNO} đã làm lệnh !`;
      return this.response
    }
    let _data = await this.dtPackageMnfLD.find({
      include: [
        {
          relation: "contInfor",
          scope: {
            fields: ["BOOKING_NO", "CNTRSZTP", "ITEM_TYPE_CODE"]
          }
        }
      ],
      where: whereObj
    })
      .then((data: any) => {
        if (data.length) {
          let arr = data.map((data: any) => {
            let obj = {
              ARRIVALDEPARTURE: data.ARRIVALDEPARTURE,
              BILLOFLADING: data.BILLOFLADING,
              BOOKING_FWD: data.BOOKING_FWD,
              BOOKING_NO: data.contInfor.BOOKING_NO,
              CARGO_PIECE: data.CARGO_PIECE,
              CARGO_WEIGHT: data.CARGO_WEIGHT,
              CBM: data.CBM,
              CLASS_CODE: data.CLASS_CODE,
              CNTRNO: data.CNTRNO,
              CNTRSZTP: data.contInfor.CNTRSZTP,
              COMMODITYDESCRIPTION: data.COMMODITYDESCRIPTION,
              CREATE_BY: data.CREATE_BY,
              CREATE_DATE: data.CREATE_DATE,
              CUSTOMER_NAME: data.CUSTOMER_NAME,
              DECLARE_NO: data.DECLARE_NO,
              HOUSE_BILL: data.HOUSE_BILL,
              ID: data.ID,
              ITEM_TYPE_CODE: data.ITEM_TYPE_CODE,
              ITEM_TYPE_CODE_CNTR: data.contInfor.ITEM_TYPE_CODE,
              LOT_NO: data.LOT_NO,
              NOTE: data.NOTE,
              NUMBEROFJOURNEY: data.NUMBEROFJOURNEY,
              ROWGUID: data.ROWGUID,
              SHIPMARKS: data.SHIPMARKS,
              TRANSPORTIDENTITY: data.TRANSPORTIDENTITY,
              UNIT_CODE: data.UNIT_CODE,
              UPDATE_BY: data.UPDATE_BY,
              UPDATE_DATE: data.UPDATE_DATE,
              VOYAGEKEY: data.VOYAGEKEY,
            }
            return obj;
          });

          this.response['Status'] = true;
          this.response['Payload'] = arr;
          this.response['Message'] = "Truy vấn dữ liệu thành công!";
          return this.response;
        } else {
          this.response['Status'] = false;
          this.response['Payload'] = data;
          this.response['Message'] = "Không tìm thấy dữ liệu!";
          return this.response;
        }
      })
      .catch((err: any) => {
        this.response['Status'] = false;
        this.response['Payload'] = err;
        this.response['Message'] = 'Truy vấn không thành công!';
        return this.response;
      });
    if (_data.Payload && dtpackageReq.CLASS_CODE === 2) {
      let tempBookingFWD: any = _data.Payload.map((e: any) => e.BOOKING_FWD)
      let arrTLHQ: any = await this.dtPackageStockRepo.find({
        where: {
          TLHQ: { neq: 1 },
          BOOKING_FWD: { inq: tempBookingFWD },
        }
      })
        .then(data => {
          if (data.length) {
            return data.map(item => item.BOOKING_FWD)
          } else {
            return []
          }
        })
        .catch(err => {
          return console.log(err)
        })
      if (arrTLHQ.length) {
        this.response['Status'] = false;
        this.response['Payload'] = arrTLHQ;
        this.response['Message'] = `Vui lòng thanh lí hải quan cho số Booking_FWD: ${arrTLHQ}!`
        return this.response
      }
    }
    return _data
  }

  //Thoilc(*Note)-Load dữ liệu Lệnh xuất kho hàng nhập
  @post('/dt-package-mnf-ld/getInEx', spec)
  async getInEx(
    @requestBody() dtpackageReq: DT_PACKAGE_MNF_LD
  ): Promise<any> {
    if (!dtpackageReq.VOYAGEKEY) {
      this.response['Status'] = false;
      this.response['Message'] = 'Vui lòng cung cấp lại mã tàu chuyến!';
      return this.response;
    }
    if (!dtpackageReq.BOOKING_FWD) {
      this.response['Status'] = false;
      this.response['Message'] = 'Vui lòng cung cấp lại số booking_fwd!';
      return this.response;
    }

    let whereObj: any = {
      VOYAGEKEY: dtpackageReq.VOYAGEKEY,
      METHOD_CODE: 'XKX'
    };
    dtpackageReq.BOOKING_FWD ? whereObj['BOOKING_FWD'] = dtpackageReq.BOOKING_FWD : '';
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
      this.response['Message'] = `Số BOOKING_FWD : ${dtpackageReq.BOOKING_FWD} đã làm lệnh !`;
      return this.response
    }
    return await this.dtPackageMnfLD.find({
      include: [
        {
          relation: 'consigneeInfo',
          scope: {
            fields: ['ACC_TYPE', 'CUSTOMER_CODE']
          }
        }
      ],
      where: whereObj
    })
      .then((data: any) => {
        if (data.length) {
          this.response['Status'] = true;
          this.response['Payload'] = data.map((p: any) => mapDataWithKey('packageMNF', p));
          this.response['Message'] = "Truy vấn dữ liệu thành công!";
          return this.response;
        } else {
          this.response['Status'] = false;
          this.response['Payload'] = [];
          this.response['Message'] = "Không tìm thấy dữ liệu!";
          return this.response;
        }
      })
      .catch((err: any) => {
        this.response['Status'] = false;
        this.response['Payload'] = err;
        this.response['Message'] = 'Truy vấn không thành công!';
        return this.response;
      });
  }
}

