import {JSONObject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {post, requestBody} from '@loopback/rest';
import moment from 'moment';
import {BS_CUSTOMER_TYPE} from '../models';
import {BS_CUSTOMER_TYPERepository} from '../repositories';

const spec = {
  responses: {
    '200': {
      description: 'BS_CUSTOMER_TYPE list with filter',
      content: {
        'application/json': {
          schema: {},
        },
      },
    }
  }
}

export class BsCustomerTypeController {
  constructor(
    @repository(BS_CUSTOMER_TYPERepository)
    public bsCustomerTypeRepository: BS_CUSTOMER_TYPERepository,
  ) {
  }
  public response: any = {
    Status: false,
    Payload: [],
    Message: ""
  };

  //ThachHD(*Note)- view dữ liệu dm loại khách hàng
  @post('/bs-customer-type/getCustomerType', spec)
  async view(
    @requestBody() customerType: JSONObject
  ): Promise<BS_CUSTOMER_TYPE[]> {
    return this.bsCustomerTypeRepository.find();
  }

  // ThạchHD(*note) - Xóa dữ liệu loại khách hàng
  @post('/bs-customer-type/delete', spec)
  async delete(
    @requestBody() customerType: BS_CUSTOMER_TYPE[],
  ): Promise<any> {
    return Promise.all(customerType.map(async item => {
      let ID: any = item.ID ? item.ID : null;
      try {
        return await this.bsCustomerTypeRepository.deleteById(ID)
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

  //ThachHD(*Note)-thêm và chỉnh sửa dữ liệu loại khách hàng
  @post('/bs-customer-type/insertAndUpdate', spec)
  async insertAndUpdate(
    @requestBody() json: JSONObject[],
  ): Promise<any> {
    return Promise.all(json.map(async (item: any) => {
      let status = item.status ? item.status : undefined;
      let ID: any = item.ID ? item.ID : null;
      let CUSTOMER_TYPE_CODE: any = item.CUSTOMER_TYPE_CODE ?? null;
      switch (status) {
        case 'insert':
          let obj: any = {
            CUSTOMER_TYPE_CODE: CUSTOMER_TYPE_CODE,
            CUSTOMER_TYPE_NAME: item.CUSTOMER_TYPE_NAME ? item.CUSTOMER_TYPE_NAME : null,
            CREATE_BY: item.CREATE_BY ? item.CREATE_BY : null,
            CREATE_DATE: moment().format("YYYY-MM-DD hh:mm:ss")
          };

          if (CUSTOMER_TYPE_CODE === null) {
            this.response['Status'] = false;
            this.response['Message'] = "Vui lòng nhập mã loại khách hàng!";
            return this.response;
          }
          // ------- check exist customer type code --------
          let checkCode = await this.bsCustomerTypeRepository.find({
            where: {
              CUSTOMER_TYPE_CODE: CUSTOMER_TYPE_CODE
            }
          });
          if (checkCode.length > 0) {
            this.response['Status'] = false;
            this.response['Message'] = "Mã loại khách hàng đã tồn tại!";
            return this.response;
          }
          // -----------------------------------------------

          try {
            return await this.bsCustomerTypeRepository.create(obj)
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
          item.UPDATE_DATE = moment().format("YYYY-MM-DD hh:mm:ss");
          try {
            return await this.bsCustomerTypeRepository.updateById(ID, item)
              .then(() => {
                this.response['Status'] = true;
                this.response['Payload'].push(item);
                this.response['Message'] = "Lưu dữ liệu thành công!";
                return this.response;
              });
          } catch {
            this.response['Status'] = false;
            this.response['Message'] = "Không thể lưu mới dữ liệu!";
            return this.response;
          }
        default:
          return {Status: false, Payload: item.status, message: 'Không tìm thấy trạng thái'};
      }
    }
    )).then(returnValue => {
      return this.response;
    });
  }
}
