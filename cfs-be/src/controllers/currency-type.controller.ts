import {JSONObject} from '@loopback/core';
import {
  repository
} from '@loopback/repository';
import {getModelSchemaRef, post, requestBody} from '@loopback/rest';
import moment from 'moment';
import {CURRENCY} from '../models';
import {CURRENCY_TYPERepository} from '../repositories';

const spec = {
  responses: {
    '200': {
      description: 'CURRENCY detail list of filter',
      content: {
        'application/json': {
          schema: {},
        }
      }
    }
  }
}

export class CurrencyTypeController {
  constructor(
    @repository(CURRENCY_TYPERepository)
    public currencyTypeRepository: CURRENCY_TYPERepository,
  ) { }

  public response: any = {
    Status: false,
    Payload: [],
    Message: ""
  };

  //ThachHD(*Note)-Hiển thị dữ liệu loại tiền tệ
  @post('/currency-type/view', spec)
  async view(): Promise<CURRENCY[]> {
    return this.currencyTypeRepository.find();
  }

  //ThachHD(*Note)-Hiển thị dữ liệu mã loại tiền tệ
  @post('/currency-type/viewCode', spec)
  async viewCode(): Promise<CURRENCY[]> {
    return this.currencyTypeRepository.find({
      fields: ['CURRENCY_CODE']
    });
  }

  //ThachHD(*Note)-Xoá dữ liệu loại tiền tệ
  @post('/currency-type/delete', spec)
  async delete(
    @requestBody.array(getModelSchemaRef(CURRENCY)) currency: CURRENCY[]
  ): Promise<any> {
    return Promise.all(currency.map(async (item: any) => {
      if (!item.ID) {
        this.response['Status'] = false;
        this.response['Message'] = "Vui lòng cung cấp lại số ID!";
        return this.response;
      }
      try {
        return await this.currencyTypeRepository.deleteById(item.ID)
          .then(() => {
            this.response['Status'] = true;
            this.response['Message'] = "Xóa dữ liệu thành công!";
            return this.response;
          })
      } catch {
        this.response['Status'] = false;
        this.response['Message'] = "Xóa dữ liệu không thành công!";
      }
    })).then((value) => {
      return this.response;
    })
  }

  //ThachHD(*Note)-Cập nhật và thêm mới dữ liệu loại tiền tệ
  @post('/currency-type/InsertAndUpdate', spec)
  async createUpdate(
    @requestBody() currency: JSONObject[]
  ): Promise<any> {
    return Promise.all(currency.map(async (item: any) => {
      switch (item.status) {
        case 'insert':
          if (!item.CURRENCY_CODE) {
            this.response['Status'] = false;
            this.response['Message'] = 'Vui lòng cung cấp mã loại tiền!'
            return this.response;
          }
          if (!item.CURRENCY_NAME) {
            this.response['Status'] = false;
            this.response['Message'] = 'Vui lòng cung cấp tên loại tiền!'
            return this.response;
          }
          if (!item.CREATE_BY) {
            this.response['Status'] = false;
            this.response['Message'] = 'Vui lòng cung cấp lại tên người tạo!'
            return this.response;
          }
          // ------- check exist gate code --------
          let checkCode = await this.currencyTypeRepository.find({
            where: {
              CURRENCY_CODE: item.CURRENCY_CODE
            }
          });
          if (checkCode.length > 0) {
            this.response['Status'] = false;
            this.response['Message'] = "Mã loại tiền đã tồn tại!";
            return this.response;
          }
          let obj: any = {
            CURRENCY_CODE: item.CURRENCY_CODE,
            CURRENCY_NAME: item.CURRENCY_NAME,
            CREATE_BY: item.CREATE_BY,
            CREATE_DATE: moment().format("YYYY-MM-DD HH:mm:ss"),
          };
          try {
            return await this.currencyTypeRepository.create(obj)
              .then((data: any) => {
                this.response['Status'] = true;
                this.response['Payload'].push(data);
                this.response['Message'] = "Lưu dữ liệu thành công!";
                return this.response;
              })
          } catch {
            this.response['Status'] = false;
            this.response['Message'] = "Không thể lưu mới dữ liệu!";
          }
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
            return await this.currencyTypeRepository.updateById(item.ID, item)
              .then(() => {
                this.response['Status'] = true;
                this.response['Payload'].push(item);
                this.response['Message'] = "Lưu dữ liệu thành công!";
                return this.response;
              })
          } catch {
            this.response['Status'] = false;
            this.response['Message'] = "Không thể lưu mới dữ liệu!";
          }
        default:
      }
    }))
      .then(() => {
        return this.response;
      });
  }
}
