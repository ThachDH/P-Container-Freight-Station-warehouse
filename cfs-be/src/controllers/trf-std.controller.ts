import { JSONObject } from '@loopback/core';
import {
  repository
} from '@loopback/repository';
import {
  getModelSchemaRef, post, requestBody
} from '@loopback/rest';
import moment from 'moment';
import { checkContSize, roundMoney } from '../general';
import { TRF_STD } from '../models/trf-std.model';
import { BS_CUSTOMERRepository, BS_METHODRepository, BsItemTypeRepository, CONFIG_DAY_LEVELRepository, CONFIG_DISCOUNTRepository, CONFIG_FREE_DAYSRepository, CONFIG_MIN_VALUERepository, CURRENCY_TYPERepository, DtPackageStockRepository, TrfCodesRepository } from '../repositories';
import { TrfStdRepository } from '../repositories/trf-std.repository';

const spec = {
  responses: {
    '200': {
      description: 'TRF_STD detail list of filter',
      content: {
        'application/json': {
          schema: {},
        }
      }
    }
  }
}

export class TrfStdController {
  constructor(
    @repository(CONFIG_DISCOUNTRepository)
    public configDiscountRepo: CONFIG_DISCOUNTRepository,
    @repository(TrfStdRepository)
    public trfStdRepository: TrfStdRepository,
    @repository(TrfCodesRepository)
    public trfCodeRepository: TrfCodesRepository,
    @repository(BS_METHODRepository)
    public bsMethodRepository: BS_METHODRepository,
    @repository(BsItemTypeRepository)
    public bsItemTypeRepository: BsItemTypeRepository,
    @repository(CURRENCY_TYPERepository)
    public bsCurrencyRepository: CURRENCY_TYPERepository,
    @repository(BS_CUSTOMERRepository)
    public bsCustomerRepo: BS_CUSTOMERRepository,
    @repository(CONFIG_FREE_DAYSRepository)
    public CONFIG_FREE_DAYSRepo: CONFIG_FREE_DAYSRepository,
    @repository(DtPackageStockRepository)
    public dtPackageStockRepo: DtPackageStockRepository,
    @repository(CONFIG_DAY_LEVELRepository)
    public CONFIG_DAY_LEVELRepo: CONFIG_DAY_LEVELRepository,
    @repository(CONFIG_MIN_VALUERepository)
    public CONFIG_MIN_VALUERepo: CONFIG_MIN_VALUERepository,
  ) { }

  public response: any = {
    Status: false,
    Payload: [],
    Message: ""
  };

  //Thoilc(*Note)-Hiển thị Code
  @post('/trf-stds/viewCode', spec)
  async test(): Promise<any> {
    let trfStd: any = await this.trfStdRepository.execute(`
    select TRF_TEMP, TRF_NAME, FROM_DATE, TO_DATE
    from TRF_STD
    group by TRF_TEMP, TRF_NAME, FROM_DATE, TO_DATE`);
    let trfCode: any = await this.trfCodeRepository.find({
      fields: ['ID', 'TRF_CODE', 'TRF_DESC']
    });
    let bsMethod: any = await this.bsMethodRepository.find({
      fields: ['ID', 'METHOD_CODE']
    });
    let bsItemType: any = await this.bsItemTypeRepository.find({
      fields: ['ID', 'ITEM_TYPE_CODE']
    });
    let bsCurrent: any = await this.bsCurrencyRepository.find({
      fields: ['ID', 'CURRENCY_CODE']
    });

    return {
      Status: true,
      Payload: { trfStd: trfStd, trfCode: trfCode, bsMethod: bsMethod, bsItemType: bsItemType, bsCurrent: bsCurrent },
      Message: 'Load dữ liệu thành công!'
    };
  }

  //Thoilc(*Note)-Hiển thị biểu cước chuẩn
  @post('/trf-stds/view', spec)
  async view(): Promise<TRF_STD[]> {
    return this.trfStdRepository.find();
  }

  //Thoilc(*Note)-Hiển thị mẫu biểu cước
  //(*Note)Sự khác nhau giữa inq và like
  //inq::được sử dụng để tìm kiếm tất cả các bản ghi trong "Model"
  //like::được sử dụng để tìm kiếm các bản ghi có giá trị của trường fieldName
  @post('/trf-stds/viewTrfTemp', spec)
  async viewTrfTemp(
    @requestBody() trfStd: TRF_STD
  ): Promise<TRF_STD[]> {
    return this.trfStdRepository.find({
      // where: {TRF_TEMP: {inq: ['N', trfStd.TRF_TEMP]}}
      where: { TRF_TEMP: { like: '%' + trfStd.TRF_TEMP + '%' } }
    });
  }

  //Thoilc(*Note)-Xoá biểu cước chuẩn
  @post('/trf-stds/delete', spec)
  async delete(
    @requestBody.array(getModelSchemaRef(TRF_STD)) bsContractBlock: TRF_STD[]
  ): Promise<any> {
    return Promise.all(bsContractBlock.map(async item => {
      try {
        if (!item.ID) {
          this.response['Status'] = false;
          this.response['Message'] = "Vui lòng cung cấp lại số ID";
          return this.response;
        }
        return await this.trfStdRepository.deleteById(item.ID)
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
    });
  }


  //Thoilc(*Note)-Cập nhật và thêm mới biểu cước chuẩn
  @post('/trf-stds/insertAndUpdate', spec)
  async createUpdate(
    @requestBody() trfStd: JSONObject[]
  ): Promise<any> {
    return Promise.all(trfStd.map(async (item: any) => {
      try {
        if (!item.TRF_NAME) {
          this.response['Status'] = false;
          this.response['Message'] = "Vui lòng cung cấp lại tên biểu cước";
          return this.response;
        }
        if (!item.FROM_DATE) {
          this.response['Status'] = false;
          this.response['Message'] = "Vui lòng cung cấp từ ngày";
          return this.response;
        }
        if (!item.TO_DATE) {
          this.response['Status'] = false;
          this.response['Message'] = "Vui lòng cung cấp đến ngày";
          return this.response;
        }
        if (!item.TRF_CODE) {
          this.response['Status'] = false;
          this.response['Message'] = "Vui lòng cung cấp lại mã biểu cước";
          return this.response;
        }
        if (!item.TRF_DESC) {
          this.response['Status'] = false;
          this.response['Message'] = "Vui lòng cung cấp lại diễn giải";
          return this.response;
        }
        if (!(item.CLASS_CODE === "1" || item.CLASS_CODE === "2" || item.CLASS_CODE === '✶')) {
          this.response['Status'] = false;
          this.response['Message'] = "Vui lòng cung cấp hướng";
          return this.response;
        }
        if (!item.METHOD_CODE) {
          this.response['Status'] = false;
          this.response['Message'] = "Vui lòng cung cấp mã phương án";
          return this.response;
        }
        if (!item.ITEM_TYPE_CODE) {
          this.response['Status'] = false;
          this.response['Message'] = "Vui lòng cung cấp lại mã loại hàng hoá";
          return this.response;
        }
        if (!item.CURRENCY_CODE) {
          this.response['Status'] = false;
          this.response['Message'] = "Vui lòng cung cấp lại mã loại tiền";
          return this.response;
        }
        if (!item.CREATE_BY) {
          this.response['Status'] = false;
          this.response['Message'] = "Vui lòng cung cấp lại tên người tạo";
          return this.response;
        }
        let obj: any = {
          TRF_CODE: item.TRF_CODE,
          TRF_DESC: item.TRF_DESC,
          CLASS_CODE: String(item.CLASS_CODE),
          METHOD_CODE: item.METHOD_CODE,
          ITEM_TYPE_CODE: item.ITEM_TYPE_CODE,
          CURRENCY_CODE: item.CURRENCY_CODE,
          AMT_MIN20: item.AMT_MIN20,
          AMT_MIN40: item.AMT_MIN40,
          AMT_MIN45: item.AMT_MIN45,
          AMT_RT: item.AMT_RT,
          VAT: item.VAT,
          AMT_NON: item.AMT_NON,
          INCLUDE_VAT: item.INCLUDE_VAT,
          FROM_DATE: item.FROM_DATE,
          TO_DATE: item.TO_DATE,
          TRF_NAME: item.TRF_NAME,
          TRF_TEMP: item.FROM_DATE + '-' + item.TO_DATE + '-' + item.TRF_NAME,
        };
        // ------- check exist customer type code --------
        let checkCode = await this.trfStdRepository.find({
          where: {
            TRF_TEMP: obj.TRF_TEMP
          }
        });
        if (checkCode.length > 0) {
          return await this.trfStdRepository.find({
            where: {
              and: [
                { TRF_CODE: obj.TRF_CODE },
                { CLASS_CODE: obj.CLASS_CODE },
                { METHOD_CODE: obj.METHOD_CODE },
                { ITEM_TYPE_CODE: obj.ITEM_TYPE_CODE }
              ]
            }
          })
            .then(async (data: any) => {
              if (data.length > 0) {
                return Promise.all(await data.map(async (itm1: any) => {
                  obj.ID = itm1.ID;
                  obj.UPDATE_BY = item.CREATE_BY;
                  obj.UPDATE_DATE = moment().format("YYYY-MM-DD HH:mm:ss");
                  return await this.trfStdRepository.updateById(itm1.ID, obj)
                    .then(() => {
                      this.response['Status'] = true;
                      this.response['Payload'].push(itm1);
                      this.response['Message'] = "Lưu dữ liệu thành công!";
                      return this.response;
                    });
                }));
              } else {
                obj.CREATE_BY = item.CREATE_BY;
                obj.CREATE_DATE = moment().format("YYYY-MM-DD HH:mm:ss");
                return await this.trfStdRepository.create(obj)
                  .then((data: any) => {
                    this.response['Status'] = true;
                    this.response['Payload'].push(data);
                    this.response['Message'] = "Lưu dữ liệu thành công!";
                    return this.response;
                  });
              }
            });
        }
        obj.CREATE_BY = item.CREATE_BY;
        obj.CREATE_DATE = moment().format("YYYY-MM-DD HH:mm:ss");
        return await this.trfStdRepository.create(obj)
          .then((data: any) => {
            this.response['Status'] = true;
            this.response['Payload'].push(data);
            this.response['Message'] = "Lưu dữ liệu thành công!";
            return this.response;
          });
      } catch (err) {
        this.response['Status'] = false;
        this.response['Payload'] = err
        this.response['Message'] = "Không thể lưu mới dữ liệu!";
        return this.response;
      }
    }))
      .then(() => {
        return this.response;
      });
  }

  @post('/trf-stds/getToBill', spec)
  async get(
    @requestBody() jsonReq: JSONObject,
  ): Promise<any> {
    let contReq: any = jsonReq.dataSendCont;
    let servicesReq: any = jsonReq.dataSendService;

    if (!contReq) {
      this.response['Status'] = false;
      this.response['Message'] = "Vui lòng cung cấp thông tin container!!"
      return this.response;
    }
    let cbmTotals: any = {};
    for (let i = 0; i < contReq.length; i++) {
      let item = contReq[i];
      if (cbmTotals[String(item.ITEM_TYPE_CODE)]) {
        cbmTotals[String(item.ITEM_TYPE_CODE)] += item.CBM;
      } else {
        cbmTotals[String(item.ITEM_TYPE_CODE)] = item.CBM;
      }
    }

    let groupList: any = Object.keys(cbmTotals).map((key) => {
      return {
        'ITEM_TYPE_CODE': key,
        'M3': cbmTotals[key] / 1,
        'METHOD_CODE': contReq[0].METHOD_CODE,
        'CLASS_CODE': contReq[0].CLASS_CODE,
        'CNTRSZTP': contReq[0].CNTRSZTP
      };
    });

    let arr = [];
    for (let i = 0; i < groupList.length; i++) {
      let flag = false;
      let whereObj: any = {};
      whereObj['METHOD_CODE'] = groupList[i].METHOD_CODE;
      whereObj['CLASS_CODE'] = String(groupList[i].CLASS_CODE);
      whereObj['ITEM_TYPE_CODE'] = groupList[i].ITEM_TYPE_CODE;
      let tariffInfo: any = {};
      //kiểm tra xem có biểu cước ở bảng cấu hình giảm giá không
      tariffInfo = await this.configDiscountRepo.find({
        where: whereObj
      })
        .then(data => {
          let current = moment().toDate().getTime()
          data = data.filter(item => {
            let from = moment(item.FROM_DATE, 'DD/MM/YYYY').toDate().getTime()
            let to = moment(item.TO_DATE, 'DD/MM/YYYY').endOf('day').toDate().getTime()
            return current >= from && current <= to
          })
          if (data.length === 1) {
            return data[0];
          } else {
            return [];
          }
        })
        .catch(err => {
          this.response['Status'] = false;
          this.response['Payload'] = err;
          this.response['Message'] = "Không tìm thấy biểu cước phù hợp!";
          return this.response;
        })
      if (Object.values(tariffInfo).length === 0) {
        tariffInfo = await this.trfStdRepository.find({
          where: whereObj
        })
          .then(data => {
            let current = moment().toDate().getTime()
            data = data.filter(item => {
              let from = moment(item.FROM_DATE, 'DD/MM/YYYY').toDate().getTime()
              let to = moment(item.TO_DATE, 'DD/MM/YYYY').endOf('day').toDate().getTime()
              return current >= from && current <= to
            })
            if (data.length === 1) {
              flag = false;
              return data[0];
            } else {
              flag = true;
              this.response['Status'] = false;
              this.response['Message'] = "Không tìm thấy biểu cước phù hợp!!";
              return this.response;
            }
          })
          .catch(err => {
            this.response['Status'] = false;
            this.response['Payload'] = err;
            this.response['Message'] = "Không tìm thấy biểu cước phù hợp!!";
            return this.response;
          })
      }

      if (flag) {
        return this.response
      }

      //ICD3 :  Tìm giá trị tối thiểu
      let minValueInfo = await this.CONFIG_MIN_VALUERepo.find({
        where: {
          UNIT_INVOICE: "CBM",
        }
      })
        .then((data: any) => {
          return data.filter((item: any) => item.CNTRSZTP === checkContSize(String(groupList[i].CNTRSZTP)))
        })

      if (!(minValueInfo.length === 1)) {
        this.response['Status'] = false;
        this.response['Payload'] = [];
        this.response['Message'] = 'Không tìm thấy giá trị tối thiểu của Container!';
        return this.response;
      }

      // Tính toán đơn giá
      // fe gửi số lượng(đây là M3 cũng là tấn doanh thu), gửi cntrstp(kích cở ISO từ bảng DT_CNTR_MNF) để lấy loại cont mà so sánh M3
      // giá tấn doanh thu(AMT_RT này là giá bao gồm thuế), VAT từ bảng biểu cước
      let quanlity: number = Number(groupList[i].M3) > minValueInfo[0]['MIN_VALUE'] ? Number(groupList[i].M3) : minValueInfo[0]['MIN_VALUE'];
      console.log('minValueInfo[0].MIN_VALUE', minValueInfo[0]['MIN_VALUE'])
      console.log('minValueInfo[0].MIN_VALUE', minValueInfo[0].MIN_VALUE)
      let vatPrice: number = tariffInfo.AMT_RT * (tariffInfo.VAT / 100) * quanlity
      let unitPrice: number = tariffInfo.AMT_RT * (1 - (tariffInfo.VAT / 100))
      let cost: number = tariffInfo.AMT_RT * (1 - (tariffInfo.VAT / 100)) * quanlity
      let totalPrice: number = vatPrice + cost

      let tempObj: any = {
        'UNIT_RATE': roundMoney(unitPrice), 'VAT_PRICE': roundMoney(vatPrice), 'AMOUNT': roundMoney(cost),
        'TAMOUNT': roundMoney(totalPrice), 'CNTRSZTP': groupList[i].CNTRSZTP, 'QTY': (Math.round(quanlity * 100) / 100).toFixed(2)
      }
      let TariffInfo: any = Object.assign(tempObj, tariffInfo)
      arr.push(TariffInfo)
    }

    // tính tiền dịch vụ đính kèm
    for (let i = 0; i < servicesReq.length; i++) {
      let flag = false;
      let tariffInfo: any = await this.trfStdRepository.find({
        where: {
          METHOD_CODE: servicesReq[i].METHOD_CODE
        }
      })
        .then(data => {
          if (data.length === 1) {
            return data[0];
          } else {
            flag = true;
            this.response['Status'] = false;
            this.response['Message'] = "Không tìm thấy biểu cước phù hợp!!";
            return this.response;
          }
        })
        .catch(err => {
          this.response['Status'] = false;
          this.response['Payload'] = err;
          this.response['Message'] = "Không tìm thấy biểu cước phù hợp!!";
          return this.response;
        })
      if (flag) {
        return this.response
      }
      let quanlity: number = 1;

      let vatPrice: number = tariffInfo.AMT_RT * (tariffInfo.VAT / 100) * quanlity
      let unitPrice: number = tariffInfo.AMT_RT * (1 - (tariffInfo.VAT / 100))
      let cost: number = tariffInfo.AMT_RT * (1 - (tariffInfo.VAT / 100)) * quanlity
      let totalPrice: number = vatPrice + cost

      let tempObj: any = {
        'UNIT_RATE': roundMoney(unitPrice), 'VAT_PRICE': roundMoney(vatPrice), 'AMOUNT': roundMoney(cost),
        'TAMOUNT': roundMoney(totalPrice), 'QTY': (Math.round(quanlity * 100) / 100).toFixed(2)
      }
      let TariffInfo: any = Object.assign(tempObj, tariffInfo)
      arr.push(TariffInfo)
    }

    this.response['Status'] = true;
    this.response['Payload'] = arr
    this.response['Message'] = "Truy vấn dữ liệu thành công!";
    return this.response;
  }

  @post('/trf-stds/getCustomerInfo', spec)
  async getCustomerInfo(
    @requestBody() jsonReq: JSONObject,
  ): Promise<any> {
    await this.bsCustomerRepo.find({
      where: {
        CUSTOMER_CODE: String(jsonReq.CUSTOMER_CODE)
      }
    })
      .then(data => {
        if (data.length) {
          this.response['Status'] = true;
          this.response['Payload'] = data[0];
          this.response['Message'] = "Nạp dữ liệu thành công!!";
          return this.response;
        } else {
          this.response['Status'] = false;
          this.response['Payload'] = [];
          this.response['Message'] = "Không tìm thấy thông tin khách hàng!!";
          return this.response;
        }
      })
      .catch(err => {
        this.response['Status'] = false;
        this.response['Payload'] = err;
        this.response['Message'] = "Tìm khách hàng thất bại!!";
        return this.response;
      })
    return this.response
  }

  //lệnh xuất kho nhập
  @post('/trf-stds/getToBillExOrder', spec)
  async getToBillExOrder(
    @requestBody() jsonReq: JSONObject[],
  ): Promise<any> {
    let arr: any = [];
    return Promise.all(jsonReq.map(async (item: any) => {
      this.response['Status'] = true;
      if (!jsonReq.length) {
        this.response['Status'] = false;
        this.response['Message'] = "Vui lòng cung cấp House Bill!!"
        return this.response;
      }
      let numberOfFreeDays: any = await this.CONFIG_FREE_DAYSRepo.find({
        fields: ['FREE_DAYS'],
        where: {
          CLASS_CODE: "1",
          CUSTOMER_CODE: item.CUSTOMER_CODE,
          ITEM_TYPE_CODE: item.ITEM_TYPE_CODE,
        }
      })
        .then(data => {
          if (data.length === 1) {
            return data[0].FREE_DAYS;
          } else {
            return 0;
          }
        })
        .catch(err => {
          this.response['Status'] = false;
          this.response['Payload'] = err
          this.response['Message'] = "Truy vấn không thành công ngày lưu kho!";
          return this.response;
        })

      let tempEXP_DATE = moment(item.EXP_DATE, "YYYY-MM-DDTHH:mm:ss.SSSZ")
      let tempTINE_IN = moment(item.TIME_IN, "YYYY-MM-DDTHH:mm:ss.SSSZ").startOf('day')

      let numberOfStorageDays: number = tempEXP_DATE.diff(tempTINE_IN, 'days')
      if (numberOfStorageDays < 0) {
        this.response['Status'] = false;
        this.response['Payload'] = [];
        this.response['Message'] = 'Lỗi hạn lệnh nhỏ hơn thời gian nhập kho'
        return this.response
      } else {
        numberOfStorageDays += 1;
      }

      let numberOfChargeDays: number = numberOfStorageDays - Number(numberOfFreeDays)

      if (numberOfChargeDays <= 0) {
        this.response['Status'] = false;
        this.response['Message'] = `Không phát sinh phí lưu kho!`;
        return this.response;
      }
      // Tính tiền chênh lệch nếu là lô là hàng nguy hiểm và ITEM_TYPE_CODE_CNTR là thường - begin
      if ((item.ITEM_TYPE_CODE_CNTR !== 'DG' || item.ITEM_TYPE_CODE_CNTR !== 'OOG') && (item.ITEM_TYPE_CODE === 'DG' || item.ITEM_TYPE_CODE === 'OOP')) {
        let tariffInfoNormal: any = {};
        let tariffInfoDanger: any = {};
        await this.configDiscountRepo.find({
          where: {
            METHOD_CODE: 'NKN',
            CLASS_CODE: '1',
            ITEM_TYPE_CODE: { inq: [item.ITEM_TYPE_CODE_CNTR, item.ITEM_TYPE_CODE] }
          }
        })
          .then(data => {
            let current = moment().toDate().getTime()
            data = data.filter(item => {
              let from = moment(item.FROM_DATE, 'DD/MM/YYYY').toDate().getTime()
              let to = moment(item.TO_DATE, 'DD/MM/YYYY').endOf('day').toDate().getTime()
              return current >= from && current <= to
            })
            let filterTarrifNormal = data.filter(dataF => dataF.ITEM_TYPE_CODE === item.ITEM_TYPE_CODE_CNTR)
            let filterTarrifDanger = data.filter(dataF => dataF.ITEM_TYPE_CODE === item.ITEM_TYPE_CODE)

            if (filterTarrifNormal.length === 1) {
              tariffInfoNormal = filterTarrifNormal[0];
            } else if (filterTarrifNormal.length > 1) {
              this.response['Status'] = false;
              this.response['Message'] = `Không tìm thấy biểu cước hàng ${item.ITEM_TYPE_CODE_CNTR} trong cấu hình giảm giá không phù hợp!`;
              return this.response;
            }
            if (filterTarrifDanger.length === 1) {
              tariffInfoDanger = filterTarrifDanger[0]
            } else if (filterTarrifDanger.length > 1) {
              this.response['Status'] = false;
              this.response['Message'] = `Không tìm thấy biểu cước hàng ${item.ITEM_TYPE_CODE} trong cấu hình giảm giá không phù hợp!`;
              return this.response;
            }
          })
          .catch(err => {
            this.response['Status'] = false;
            this.response['Payload'] = err;
            this.response['Message'] = "Không tìm thấy biểu cước phù hợp!";
            return this.response;
          })
        if (!this.response['Status']) {
          return this.response;
        }
        if (Object.values(tariffInfoNormal).length === 0 || Object.values(tariffInfoDanger).length === 0) {
          await this.trfStdRepository.find({
            where: {
              METHOD_CODE: 'NKN',
              CLASS_CODE: '1',
              ITEM_TYPE_CODE: { inq: [item.ITEM_TYPE_CODE_CNTR, item.ITEM_TYPE_CODE] }
            }
          })
            .then(data => {
              let current = moment().toDate().getTime()
              data = data.filter(item => {
                let from = moment(item.FROM_DATE, 'DD/MM/YYYY').toDate().getTime()
                let to = moment(item.TO_DATE, 'DD/MM/YYYY').endOf('day').toDate().getTime()
                return current >= from && current <= to
              })
              if (Object.values(tariffInfoNormal).length === 0) {
                let filterTarrifNormal = data.filter(dataF => dataF.ITEM_TYPE_CODE === item.ITEM_TYPE_CODE_CNTR)
                if (filterTarrifNormal.length === 1) {
                  tariffInfoNormal = filterTarrifNormal[0];
                } else {
                  this.response['Status'] = false;
                  this.response['Message'] = `Không tìm thấy biểu cước hàng ${item.ITEM_TYPE_CODE_CNTR} trong biểu cước chuẩn!`;
                  return this.response;
                }
              }
              if (Object.values(tariffInfoDanger).length === 0) {
                let filterTarrifDanger = data.filter(dataF => dataF.ITEM_TYPE_CODE === item.ITEM_TYPE_CODE)
                if (filterTarrifDanger.length === 1) {
                  tariffInfoDanger = filterTarrifDanger[0]
                } else {
                  this.response['Status'] = false;
                  this.response['Message'] = `Không tìm thấy biểu cước hàng ${item.ITEM_TYPE_CODE} trong biểu cước chuẩn!`;
                  return this.response;
                }
              }
            })
            .catch(err => {
              this.response['Status'] = false;
              this.response['Payload'] = err;
              this.response['Message'] = "Không tìm thấy biểu cước phù hợp!";
              return this.response;
            })
          if (!this.response['Status']) {
            return this.response;
          }
        }
        let tariffInfodiff: any = {
          TRF_DESC: `Phí chênh lệch hàng nguy hiểm`,
          ITEM_TYPE_CODE: tariffInfoDanger.ITEM_TYPE_CODE,
          CURRENCY_CODE: tariffInfoDanger.CURRENCY_CODE,
          AMT_RT: tariffInfoDanger.AMT_RT,
          VAT: tariffInfoDanger.VAT,
          INCLUDE_VAT: tariffInfoDanger.INCLUDE_VAT,
          ACC_TYPE: tariffInfoDanger.ACC_TYPE
        }

        let quanlity: number = Number(item.CBM / 1);

        let vatPrice: number = tariffInfodiff.AMT_RT * (tariffInfodiff.VAT / 100) * quanlity
        let unitPrice: number = tariffInfodiff.AMT_RT * (1 - (tariffInfodiff.VAT / 100))
        let cost: number = tariffInfodiff.AMT_RT * (1 - (tariffInfodiff.VAT / 100)) * quanlity
        let totalPrice: number = vatPrice + cost

        let tempObj: any = {
          'UNIT_RATE': roundMoney(unitPrice), 'VAT_PRICE': roundMoney(vatPrice), 'AMOUNT': roundMoney(cost),
          'TAMOUNT': roundMoney(totalPrice), 'CNTRSZTP': item.CNTRSZTP, 'QTY': (Math.round(quanlity * 100) / 100).toFixed(2)
        }
        let TariffInfo: any = Object.assign(tempObj, tariffInfodiff)
        arr.push(TariffInfo)
      }

      //Tính tiền chênh lệch nếu là lô là hàng nguy hiểm và ITEM_TYPE_CODE_CNTR là thường - end
      // Kiểm tra có biểu cước ở bảng cấu hình lũy tiến không.
      let tariffInfo = await this.CONFIG_DAY_LEVELRepo.find({
        where: {
          TRF_CODE: "LK",
          CLASS_CODE: '1',
          METHOD_CODE: "XKN",
          ITEM_TYPE_CODE: item.ITEM_TYPE_CODE
        },
        order: ['DAY_LEVEL DESC']
      })
        .then(data => {
          let current = moment().toDate().getTime()
          data = data.filter(item => {
            let from = moment(item.FROM_DATE, 'DD/MM/YYYY').toDate().getTime()
            let to = moment(item.TO_DATE, 'DD/MM/YYYY').endOf('day').toDate().getTime()
            return current >= from && current <= to
          })

          if (data.length < 1) {
            this.response['Status'] = false;
            this.response['Payload'] = [];
            this.response['Message'] = "Không tìm thấy biểu cước phù hợp!!";
            return this.response;
          } else {
            this.response['Status'] = true;
            return data;
          }
        })
        .catch(err => {
          this.response['Status'] = false;
          this.response['Payload'] = err;
          this.response['Message'] = "Phát sinh lỗi! Liên hệ bộ phận kỹ thuật để được hỗ trợ!!";
          return this.response;
        })
      if (!this.response['Status']) {
        return this.response;
      }

      tariffInfo = tariffInfo.filter((item: any) => item.DAY_LEVEL < numberOfChargeDays)
      let tempTotal: number = 0;
      for (let i = 0; i < tariffInfo.length; i++) {
        let numberOfDayLevel: number = numberOfChargeDays - tariffInfo[i].DAY_LEVEL - tempTotal;
        tempTotal += numberOfDayLevel;
        // Tính tiền = số ngày lưu kho tính tiền * tấn doanh thu(M3) * Giá tấn doanh thu (*AMT_RT)
        let M3 = item.CBM / 1;

        let vatPrice: number = numberOfDayLevel * tariffInfo[i].AMT_RT * (tariffInfo[i].VAT / 100) * M3
        let cost: number = numberOfDayLevel * tariffInfo[i].AMT_RT * (1 - tariffInfo[i].VAT / 100) * M3
        let unitPrice: number = tariffInfo[i].AMT_RT * (1 - tariffInfo[i].VAT / 100)
        let totalPrice: number = vatPrice + cost

        let tempObj: any = {
          'UNIT_RATE': roundMoney(unitPrice), 'VAT_PRICE': roundMoney(vatPrice), 'AMOUNT': roundMoney(cost),
          'TAMOUNT': roundMoney(totalPrice), 'QTY': (Math.round(numberOfDayLevel * M3 * 100) / 100).toFixed(2), 'numberOfFreeDays': numberOfFreeDays
        }
        let TariffInfo: any = Object.assign(tempObj, tariffInfo[i])
        arr.push(TariffInfo)
      }
    }))
      .then(() => {
        if (!arr.length) {
          return this.response
        } else {
          this.response['Status'] = true;
          this.response['Payload'] = arr
          this.response['Message'] = "Truy vấn dữ liệu thành công!";
          return this.response;
        }
      })
  }

  //Lệnh xuất kho hàng xuất
  @post('/trf-stds/getToBillExExportOrder', spec)
  async getToBillExExportOrder(
    @requestBody() jsonReq: any[],
  ): Promise<any> {
    if (jsonReq.length) {
      this.response['Status'] = false;
      this.response['Message'] = "Vui lòng cung cấp thông tin container!!"
    }
    let arr = [];
    for (let i = 0; i < jsonReq.length; i++) {
      let tempDtPackage_stock = await this.dtPackageStockRepo.find({
        where: {
          CLASS_CODE: 2,
          BOOKING_FWD: jsonReq[i].BOOKING_FWD,
          ITEM_TYPE_CODE: jsonReq[i].ITEM_TYPE_CODE,
          VOYAGEKEY: jsonReq[i].VOYAGEKEY
        }
      })
        .then(data => {
          if (data.length === 1) {
            this.response['Status'] = true;
            this.response['Payload'] = data[0];
            this.response['Message'] = 'Truy vấn thành công !!'
            return this.response;
          } else if (data.length > 1) {
            this.response['Status'] = false;
            this.response['Payload'] = data;
            this.response['Message'] = 'Số booking Container của kiện bị trùng!!'
            return this.response;
          } else {
            this.response['Status'] = false;
            this.response['Payload'] = data;
            this.response['Message'] = 'Không tìm thấy số booking của Container!!'
            return this.response;
          }
        })
        .catch(err => {
          this.response['Status'] = false;
          this.response['Payload'] = err;
          this.response['Message'] = 'Phát sinh lỗi! Liên hệ bộ phận kỹ thuật để được hỗ trợ!'
          return this.response;
        })

      if (!tempDtPackage_stock.Status) {
        return this.response
      }

      let tempTINE_IN = moment(tempDtPackage_stock.Payload.TIME_IN, "YYYY-MM-DDTHH:mm:ss.SSSZ")
      let numberOfStorageDays: number = moment().diff(tempTINE_IN, 'days')
      if (numberOfStorageDays < 0) {
        this.response['Status'] = false;
        this.response['Payload'] = [];
        this.response['Message'] = 'Lỗi thời gian nhập kho lớn hơn hiện tại!'
        return this.response
      } else {
        numberOfStorageDays += 1;
      }

      //kiểm tra cấu hình lưu kho xem có được giảm giá không
      let numberOfFreeDays: any = await this.CONFIG_FREE_DAYSRepo.find({
        fields: ['FREE_DAYS'],
        where: {
          CLASS_CODE: "2",
          CUSTOMER_CODE: jsonReq[i].CUSTOMER_CODE,
          ITEM_TYPE_CODE: jsonReq[i].ITEM_TYPE_CODE,
        }
      })
        .then(data => {
          if (data.length === 1) {
            return data[0].FREE_DAYS;
          } else if (data.length > 1) {
            this.response['Status'] = false;
            this.response['Payload'] = [];
            this.response['Message'] = `Cấu hình lưu kho của khách hàng ${jsonReq[i].CUSTOMER_CODE} bị trùng!`
            return this.response;
          } else {
            return 0;
          }
        })
        .catch(err => {
          this.response['Status'] = false;
          this.response['Payload'] = err
          this.response['Message'] = "Truy vấn không thành công ngày lưu kho!";
          return this.response;
        })
      if (!this.response['Status']) {
        return this.response
      }

      let numberOfChargeDays: number = numberOfStorageDays - Number(numberOfFreeDays)
      if (numberOfChargeDays <= 0) {
        break;
      }
      // Kiểm tra có biểu cước ở bảng cấu hình lũy tiến không.

      let tariffInfo = await this.CONFIG_DAY_LEVELRepo.find({
        where: {
          TRF_CODE: "LK",
          CLASS_CODE: '2',
          METHOD_CODE: "XKX",
          ITEM_TYPE_CODE: jsonReq[i].ITEM_TYPE_CODE
        },
        order: ['DAY_LEVEL DESC']
      })
        .then(data => {
          let current = moment().toDate().getTime()
          data = data.filter(item => {
            let from = moment(item.FROM_DATE, 'DD/MM/YYYY').toDate().getTime()
            let to = moment(item.TO_DATE, 'DD/MM/YYYY').endOf('day').toDate().getTime()
            return current >= from && current <= to
          })

          if (data.length < 1) {
            console.log('data2',data)
            this.response['Status'] = false;
            this.response['Payload'] = [];
            this.response['Message'] = "Không tìm thấy biểu cước phù hợp!";
            return this.response;
          } else {
            this.response['Status'] = true;
            return data;
          }
        })
        .catch(err => {
          this.response['Status'] = false;
          this.response['Payload'] = err;
          this.response['Message'] = "Phát sinh lỗi! Liên hệ bộ phận kỹ thuật để được hỗ trợ!!";
          return this.response;
        })
      if (!this.response['Status']) {
        return this.response;
      }

      tariffInfo = tariffInfo.filter((item: any) => item.DAY_LEVEL < numberOfChargeDays)
      let tempTotal: number = 0;
      for (let j = 0; j < tariffInfo.length; j++) {
        let numberOfDayLevel: number = numberOfChargeDays - tariffInfo[j].DAY_LEVEL - tempTotal;
        tempTotal += numberOfDayLevel;
        // Tính tiền = số ngày lưu kho tính tiền * tấn doanh thu(M3) * Giá tấn doanh thu (*AMT_RT)
        let M3 = jsonReq[i].CBM / 1;

        let vatPrice: number = numberOfDayLevel * tariffInfo[j].AMT_RT * (tariffInfo[j].VAT / 100) * M3
        let cost: number = numberOfDayLevel * tariffInfo[j].AMT_RT * (1 - tariffInfo[j].VAT / 100) * M3
        let unitPrice: number = tariffInfo[j].AMT_RT * (1 - tariffInfo[j].VAT / 100)
        let totalPrice: number = vatPrice + cost

        let tempObj: any = {
          'UNIT_RATE': roundMoney(unitPrice), 'VAT_PRICE': roundMoney(vatPrice), 'AMOUNT': roundMoney(cost),
          'TAMOUNT': roundMoney(totalPrice), 'QTY': (Math.round(numberOfDayLevel * M3 * 100) / 100).toFixed(2), 'numberOfFreeDays': numberOfFreeDays
        }
        let TariffInfo: any = Object.assign(tempObj, tariffInfo[j])
        arr.push(TariffInfo)
      }

      //nhóm các mặt hàng giống nhau lại để phân biệt hàng hóa loại thường loại ngu hiểm
      // let arrItemTypeCode: any = temparr.map(item => item.ITEM_TYPE_CODE)
      // arrItemTypeCode = new Set(arrItemTypeCode)
      // arrItemTypeCode = Array.from(arrItemTypeCode)
      // let arr = [];
      // for (let i = 0; i < arrItemTypeCode.length; i++) {
      //   let tempObj: any = {
      //     UNIT_RATE: 0,
      //     VAT_RATE: 0,
      //     AMOUNT: 0,
      //     TAMOUNT: 0,
      //     QTY: 0,
      //     numberOfStorageDays: 0,
      //     TRF_CODE: '',
      //     TRF_DESC: '',
      //     CLASS_CODE: '',
      //     METHOD_CODE: '',
      //     ITEM_TYPE_CODE: arrItemTypeCode[i],
      //     CURRENCY_CODE: '',
      //     TRF_TEMP: '',
      //   }
      //   for (let j = 0; j < temparr.length; j++) {
      //     if (arrItemTypeCode[i] === temparr[j].ITEM_TYPE_CODE) {
      //       tempObj.UNIT_RATE += Number(temparr[j].UNIT_RATE);
      //       tempObj.VAT_RATE += Number(temparr[j].VAT_RATE);
      //       tempObj.AMOUNT += Number(temparr[j].AMOUNT);
      //       tempObj.TAMOUNT += Number(temparr[j].TAMOUNT);
      //       tempObj.QTY += Number(temparr[j].QTY);
      //       tempObj.numberOfStorageDays += Number(temparr[j].numberOfStorageDays);
      //       tempObj.TRF_CODE = temparr[j].TRF_CODE;
      //       tempObj.TRF_DESC = temparr[j].TRF_DESC;
      //       tempObj.CLASS_CODE = temparr[j].CLASS_CODE;
      //       tempObj.METHOD_CODE = temparr[j].METHOD_CODE;
      //       tempObj.CURRENCY_CODE = temparr[j].CURRENCY_CODE;
      //       tempObj.TRF_TEMP = temparr[j].TRF_TEMP;
      //     }
      //   }
      //   arr.push(tempObj)
      // }
    }
    let cbmTotals: any = {};
    for (let i = 0; i < jsonReq.length; i++) {
      let item = jsonReq[i];
      if (cbmTotals[String(item.ITEM_TYPE_CODE_CNTR)]) {
        cbmTotals[String(item.ITEM_TYPE_CODE_CNTR)] += item.CBM;
      } else {
        cbmTotals[String(item.ITEM_TYPE_CODE_CNTR)] = item.CBM;
      }
    }
    let groupList: any = Object.keys(cbmTotals).map((key) => {
      return {
        'ITEM_TYPE_CODE_CNTR': key,
        'M3': cbmTotals[key] / 1,
        'CNTRSZTP': jsonReq[0].CNTRSZTP
      };
    });
    for (let i = 0; i < groupList.length; i++) {
      let flag = false;
      let whereObj: any = {};
      whereObj['METHOD_CODE'] = 'XKX';
      whereObj['TRF_CODE'] = 'XK'
      whereObj['CLASS_CODE'] = "2";
      whereObj['ITEM_TYPE_CODE'] = groupList[i].ITEM_TYPE_CODE_CNTR;
      let tariffInfo: any = {};
      //kiểm tra xem có biểu cước ở bảng cấu hình giảm giá không
      tariffInfo = await this.configDiscountRepo.find({
        where: whereObj
      })
        .then(data => {
          let current = moment().toDate().getTime()
          data = data.filter(item => {
            let from = moment(item.FROM_DATE, 'DD/MM/YYYY').toDate().getTime()
            let to = moment(item.TO_DATE, 'DD/MM/YYYY').endOf('day').toDate().getTime()
            return current >= from && current <= to
          })
          if (data.length === 1) {
            return data[0];
          } else {
            return [];
          }
        })
        .catch(err => {
          this.response['Status'] = false;
          this.response['Payload'] = err;
          this.response['Message'] = "Không tìm thấy biểu cước phù hợp!";
          return this.response;
        })
      if (Object.values(tariffInfo).length === 0) {
        tariffInfo = await this.trfStdRepository.find({
          where: whereObj
        })
          .then(data => {
            let current = moment().toDate().getTime()
            data = data.filter(item => {
              let from = moment(item.FROM_DATE, 'DD/MM/YYYY').toDate().getTime()
              let to = moment(item.TO_DATE, 'DD/MM/YYYY').endOf('day').toDate().getTime()
              return current >= from && current <= to
            })
            if (data.length === 1) {
              flag = false;
              return data[0];
            } else {
              console.log(data)
              flag = true;
              this.response['Status'] = false;
              this.response['Message'] = "Không tìm thấy biểu cước phù hợp!!";
              return this.response;
            }
          })
          .catch(err => {
            this.response['Status'] = false;
            this.response['Payload'] = err;
            this.response['Message'] = "Không tìm thấy biểu cước phù hợp!!!";
            return this.response;
          })
      }
      if (flag) {
        return this.response
      }

      //ICD3 :  Tìm giá trị tối thiểu
      let minValueInfo = await this.CONFIG_MIN_VALUERepo.find({
        where: {
          UNIT_INVOICE: "CBM",
        }
      })
        .then((data: any) => {
          return data.filter((item: any) => item.CNTRSZTP === checkContSize(String(groupList[i].CNTRSZTP)))
        })

      if (!(minValueInfo.length === 1)) {
        this.response['Status'] = false;
        this.response['Payload'] = [];
        this.response['Message'] = 'Không tìm thấy giá trị tối thiểu của Container!';
        return this.response;
      }
      // Tính toán đơn giá
      // fe gửi số lượng(đây là M3 cũng là tất doanh thu), gửi cntrstp(kích cở ISO từ bảng DT_CNTR_MNF) để lấy loại cont mà so sánh M3
      // giá tấn doanh thu(AMT_RT này là giá bao gồm thuế), VAT từ bảng biểu cước
      let QTY: number = Number(groupList[i].M3) > minValueInfo[0]['MIN_VALUE'] ? Number(groupList[i].M3) : minValueInfo[0]['MIN_VALUE'];

      let VAT_PRICE: number = tariffInfo.AMT_RT * (tariffInfo.VAT / 100) * QTY;
      let UNIT_RATE: number = tariffInfo.AMT_RT * (1 - (tariffInfo.VAT / 100));
      let AMOUNT: number = tariffInfo.AMT_RT * (1 - (tariffInfo.VAT / 100)) * QTY;
      let TAMOUNT: number = VAT_PRICE + AMOUNT;

      let tempObj: any = { 'UNIT_RATE': roundMoney(UNIT_RATE), 'VAT_PRICE': roundMoney(VAT_PRICE), 'AMOUNT': roundMoney(AMOUNT), 'TAMOUNT': roundMoney(TAMOUNT), 'CNTRSZTP': groupList[i].CNTRSZTP, 'QTY': (Math.round(QTY * 100) / 100).toFixed(2) }
      let TariffInfo: any = Object.assign(tempObj, tariffInfo)
      arr.push(TariffInfo)
    }
    this.response['Status'] = true;
    this.response['Payload'] = arr
    this.response['Message'] = "Truy vấn dữ liệu thành công!";
    return this.response;
  }
}
