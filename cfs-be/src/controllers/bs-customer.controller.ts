import {JSONObject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {post, requestBody} from '@loopback/rest';
import moment from 'moment';
import {BS_CUSTOMER} from '../models';
import {BS_CUSTOMERRepository} from '../repositories';

const spec = {
  responses: {
    '200': {
      description: 'BS_CUSTOMER list with filter',
      content: {
        'application/json': {
          schema: {},
        },
      },
    }
  }
}


export class BS_CUSTOMERController {
  constructor(
    @repository(BS_CUSTOMERRepository)
    public bsCustomerRepository: BS_CUSTOMERRepository,
  ) { }
  public response: any = {
    Status: false,
    Payload: [],
    Message: ""
  };
  //ThachHD(*Note)- view dữ liệu dm loại khách hàng
  @post('/bs-customer/view', spec)
  async view(): Promise<BS_CUSTOMER[]> {
    return this.bsCustomerRepository.find();
  }

  //ThachHD(*Note)- view dữ liệu dm loại khách hàng
  @post('/bs-customer/viewCode', spec)
  async viewCode(): Promise<BS_CUSTOMER[]> {
    return this.bsCustomerRepository.find({
      fields: ['ID', 'CUSTOMER_CODE', 'CUSTOMER_NAME']
    });
  }

  // ThạchHD(*note) - Xóa dữ liệu khách hàng
  @post('/bs-customer/delete', spec)
  async delete(
    @requestBody() customer: BS_CUSTOMER[],
  ): Promise<any> {
    return Promise.all(customer.map(async item => {
      if (!item.ID) {
        this.response['Status'] = false;
        this.response['Message'] = "Vui lòng cung cấp lại số ID!";
        return this.response;
      }
      try {
        return await this.bsCustomerRepository.deleteById(item.ID)
          .then(() => {
            this.response['Status'] = true;
            this.response['Message'] = "Xóa dữ liệu thành công!";
            return this.response;
          })
      } catch {
        this.response['Status'] = false;
        this.response['Message'] = "Xóa dữ liệu không thành công!";
      }
    })).then(() => {
      return this.response;
    })
  }

  //ThachHD(*Note)-thêm và chỉnh sửa dữ liệu khách hàng
  @post('/bs-customer/insertAndUpdate', spec)
  async insertAndUpdate(
    @requestBody() json: JSONObject[],
  ): Promise<any> {
    return Promise.all(json.map(async (item: any) => {
      switch (item.status) {
        case 'insert':
          if (!item.CREATE_BY) {
            this.response['Status'] = false;
            this.response['Message'] = 'Vui lòng cung cấp lại tên người tạo!'
            return this.response;
          }
          if (!item.CUSTOMER_TYPE_CODE) {
            this.response['Status'] = false;
            this.response['Message'] = 'Vui lòng cung cấp lại mã loại khách hàng!'
            return this.response;
          }
          if (!item.CUSTOMER_CODE) {
            this.response['Status'] = false;
            this.response['Message'] = 'Vui lòng cung cấp lại mã khách hàng!'
            return this.response;
          }
          if (!item.CUSTOMER_NAME) {
            this.response['Status'] = false;
            this.response['Message'] = 'Vui lòng cung cấp lại tên khách hàng!'
            return this.response;
          }
          if (!(item.ACC_TYPE.toUpperCase() === 'CAS' || item.ACC_TYPE.toUpperCase() === 'CRE')) {
            this.response['Status'] = false;
            this.response['Message'] = 'Vui lòng cung cấp lại loại thanh toán!'
            return this.response;
          }
          if (!item.TAX_CODE) {
            this.response['Status'] = false;
            this.response['Message'] = 'Vui lòng cung cấp lại mã số thuế!'
            return this.response;
          }
          if (!(item.IS_ACTIVE === true || item.IS_ACTIVE === false)) {
            this.response['Status'] = false;
            this.response['Message'] = 'Vui lòng cung cấp lại trạng thái!'
            return this.response;
          }
          // ------- check customer code --------
          let checkCode = await this.bsCustomerRepository.find({
            where: {
              CUSTOMER_CODE: item.CUSTOMER_CODE
            }
          });
          if (checkCode.length > 0) {
            this.response['Status'] = false;
            this.response['Message'] = "Mã khách hàng đã tồn tại!";
            return this.response;
          }
          let obj: any = {
            CUSTOMER_TYPE_CODE: item.CUSTOMER_TYPE_CODE,
            CUSTOMER_CODE: item.CUSTOMER_CODE,
            CUSTOMER_NAME: item.CUSTOMER_NAME,
            ACC_TYPE: item.ACC_TYPE.toUpperCase() === 'CAS' ? 'CAS' : 'CRE',
            ADDRESS: item.ADDRESS,
            TAX_CODE: item.TAX_CODE,
            EMAIL: item.EMAIL,
            IS_ACTIVE: item.IS_ACTIVE === true ? 1 : 0,
            CREATE_BY: item.CREATE_BY,
            CREATE_DATE: moment().format("YYYY-MM-DD HH:mm:ss")
          }
          try {
            return await this.bsCustomerRepository.create(obj)
              .then(data => {
                this.response['Status'] = true;
                this.response['Payload'].push(data);
                this.response['Message'] = "Lưu dữ liệu thành công!";
                return this.response;
              })
          } catch {
            this.response['Status'] = false;
            this.response['Message'] = "Không thể lưu mới dữ liệu!";
            return this.response;
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
            return await this.bsCustomerRepository.updateById(item.ID, item)
              .then(() => {
                this.response['Status'] = true;
                this.response['Payload'].push(item);
                this.response['Message'] = "Lưu dữ liệu thành công!";
                return this.response;
              })
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
    })).then(returnValue => {
      return this.response;
    });
  }
}
