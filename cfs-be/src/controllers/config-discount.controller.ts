import {JSONObject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {getModelSchemaRef, post, requestBody} from '@loopback/rest';
import moment from 'moment';
import {CONFIG_DISCOUNT} from '../models/config-discount.model';
import {BS_CUSTOMERRepository} from '../repositories/bs-customer.repository';
import {BsItemTypeRepository} from '../repositories/bs-item-type.repository';
import {BS_METHODRepository} from '../repositories/bs-method.repository';
import {CONFIG_DISCOUNTRepository} from '../repositories/config-discount.repository';
import {CURRENCY_TYPERepository} from '../repositories/currency-type.repository';
import {TrfCodesRepository} from '../repositories/trf-codes.repository';

const spec = {
  responses: {
    '200': {
      description: 'CONFIG_DISCOUNT detail list of filter',
      content: {
        'application/json': {
          schema: {},
        }
      }
    }
  }
}

export class CONFIG_DISCOUNTController {
  constructor(
    @repository(CONFIG_DISCOUNTRepository)
    public CONFIG_DISCOUNTRepository: CONFIG_DISCOUNTRepository,
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
  ) { }

  public response: any = {
    Status: false,
    Payload: [],
    Message: ""
  };

  //Thoilc(*Note)-Hiển thị Code
  @post('/config-discounts/viewCode', spec)
  async view(): Promise<any> {
    let confDiscount: any = await this.CONFIG_DISCOUNTRepository.execute(`
     select NAME, FROM_DATE, TO_DATE
     from CONFIG_DISCOUNT
     group by NAME, FROM_DATE, TO_DATE`);
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
      Payload: {confDiscount: confDiscount, trfCode: trfCode, bsMethod: bsMethod, bsItemType: bsItemType, bsCurrent: bsCurrent},
      Message: 'Load dữ liệu thành công!'
    };
  }

  //Thoilc(*Note)-Hiển thị mẫu cấu hình giảm giá
  @post('/config-discounts/viewConfDisTemp', spec)
  async viewConfDis(
    @requestBody() CONFIG_DISCOUNT: CONFIG_DISCOUNT
  ): Promise<CONFIG_DISCOUNT[]> {
    return this.CONFIG_DISCOUNTRepository.find({
      include: [
        {
          relation: 'customerName',
          scope: {
            fields: ['CUSTOMER_NAME']
          }
        }
      ],
      where: {NAME: {like: '%' + CONFIG_DISCOUNT.NAME + '%'}}
    })
      .then((data: any) => {
        const arr: any = [];
        if (data.length) {
          data.map((item: any) => {
            let obj: any = {
              ID: item.ID,
              NAME: item.NAME,
              TRF_CODE: item.TRF_CODE,
              TRF_DESC: item.TRF_DESC,
              CLASS_CODE: item.CLASS_CODE,
              METHOD_CODE: item.METHOD_CODE,
              ITEM_TYPE_CODE: item.ITEM_TYPE_CODE,
              CURRENCY_CODE: item.CURRENCY_CODE,
              AMT_RT: item.AMT_RT,
              VAT: item.VAT,
              INCLUDE_VAT: item.INCLUDE_VAT,
              FROM_DATE: item.FROM_DATE,
              TO_DATE: item.TO_DATE,
              ACC_TYPE: item.ACC_TYPE,
              CUSTOMER_CODE: item.CUSTOMER_CODE,
              CUSTOMER_NAME: item.customerName ? item.customerName.CUSTOMER_NAME : '✶',
              CREATE_BY: item.CREATE_BY,
              CREATE_DATE: item.CREATE_DATE,
            }
            return arr.push(obj);
          });
          this.response['Status'] = true;
          this.response['Payload'] = arr;
          this.response['Message'] = "Load dữ liệu thành công!!"
          return this.response
        }
      })
      .catch((err: any) => {
        this.response['Status'] = false;
        this.response['Payload'] = err;
        this.response['Message'] = "Load dữ liệu thất bại!!"
        return this.response
      })
  }

  //Thoilc(*Note)-Xoá cấu hình giảm giá
  @post('/config-discounts/delete', spec)
  async delete(
    @requestBody.array(getModelSchemaRef(CONFIG_DISCOUNT)) bsContractBlock: CONFIG_DISCOUNT[]
  ): Promise<any> {
    return Promise.all(bsContractBlock.map(async item => {
      try {
        if (!item.ID) {
          this.response['Status'] = false;
          this.response['Message'] = "Vui lòng cung cấp lại số ID";
          return this.response;
        }
        return await this.CONFIG_DISCOUNTRepository.deleteById(item.ID)
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
  @post('/config-discounts/insertAndUpdate', spec)
  async createUpdate(
    @requestBody() CONFIG_DISCOUNT: JSONObject[]
  ): Promise<any> {
    return Promise.all(CONFIG_DISCOUNT.map(async (item: any) => {
      try {
        if (!item.TRF_CODE) {
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
          METHOD_CODE: item.METHOD_CODE,
          CLASS_CODE: String(item.CLASS_CODE),
          ITEM_TYPE_CODE: item.ITEM_TYPE_CODE,
          CURRENCY_CODE: item.CURRENCY_CODE,
          AMT_RT: item.AMT_RT,
          VAT: item.VAT,
          INCLUDE_VAT: item.INCLUDE_VAT,
          FROM_DATE: item.FROM_DATE,
          TO_DATE: item.TO_DATE,
          ACC_TYPE: item.ACC_TYPE,
          CUSTOMER_CODE: item.CUSTOMER_CODE,
          NAME: item.FROM_DATE + '-' + item.TO_DATE + '-' + item.CUSTOMER_CODE,
        };
        // ------- check exist customer type code --------
        let checkCode = await this.CONFIG_DISCOUNTRepository.find({
          where: {
            NAME: obj.NAME
          }
        });
        if (checkCode.length) {
          return await this.CONFIG_DISCOUNTRepository.find({
            where: {
              and: [
                {TRF_CODE: obj.TRF_CODE},
                {CLASS_CODE: obj.CLASS_CODE},
                {METHOD_CODE: obj.METHOD_CODE},
                {ITEM_TYPE_CODE: obj.ITEM_TYPE_CODE}
              ]
            }
          })
            .then(async (data: any) => {
              if (data.length) {
                return Promise.all(await data.map(async (itm1: any) => {
                  obj.ACC_TYPE = item.ACC_TYPE;
                  obj.UPDATE_BY = item.CREATE_BY;
                  obj.UPDATE_DATE = moment().format("YYYY-MM-DD HH:mm:ss");
                  return await this.CONFIG_DISCOUNTRepository.updateById(item.ID, obj)
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
                return await this.CONFIG_DISCOUNTRepository.create(obj)
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
        return await this.CONFIG_DISCOUNTRepository.create(obj)
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
}
