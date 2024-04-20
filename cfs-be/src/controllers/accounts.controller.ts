import {JSONObject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {post, requestBody} from '@loopback/rest';
import moment from 'moment';
import {ACCOUNTS} from '../models';
import {ACCOUNTSRepository} from '../repositories';

const spec = {
  responses: {
    '200': {
      description: 'ACCOUNTS list with filter',
      content: {
        'application/json': {
          schema: {},
        },
      },
    }
  }
}

export class ACCOUNTSController {
  constructor(
    @repository(ACCOUNTSRepository)
    public accountsRepository: ACCOUNTSRepository,
  ) { }

  public response: any = {
    Status: false,
    Payload: [],
    Message: ""
  };

  //ThachHD(*Note)- view dữ liệu dm loại khách hàng
  @post('/accounts/view', spec)
  async view(
    @requestBody() json: JSONObject
  ): Promise<ACCOUNTS[]> {
    return this.accountsRepository.find();
  }

  @post('/accounts/delete', spec)
  async delete(
    @requestBody() customerType: ACCOUNTS[],
  ): Promise<any> {
    return Promise.all(customerType.map(async item => {
      if (!item.ID) {
        this.response['Status'] = false;
        this.response['Message'] = "Vui lòng cung cấp lại số ID!";
        return this.response;
      }
      try {
        return await this.accountsRepository.deleteById(item.ID)
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

  @post('/accounts/insertAndUpdate', spec)
  async insertAndUpdate(
    @requestBody() bsMethod: ACCOUNTS[]
  ): Promise<any> {
    return Promise.all(bsMethod.map(async (item: any) => {
      switch (item.status) {
        case "insert":
          if (!item.ACC_CD) {
            this.response['Status'] = false;
            this.response['Message'] = 'Vui lòng cung cấp lại mã hình thức!'
            return this.response;
          }
          if (!item.ACC_NO) {
            this.response['Status'] = false;
            this.response['Message'] = 'Vui lòng cung cấp lại tên hình thức!'
            return this.response;
          }
          if (!item.ACC_NAME) {
            this.response['Status'] = false;
            this.response['Message'] = 'Vui lòng cung cấp lại diễn giải!'
            return this.response;
          }
          if (!item.ACC_TYPE) {
            this.response['Status'] = false;
            this.response['Message'] = 'Vui lòng cung cấp lại loại hình thức!'
            return this.response;
          }
          if (!item.CREATE_BY) {
            this.response['Status'] = false;
            this.response['Message'] = 'Vui lòng cung cấp lại tên người tạo!'
            return this.response;
          }
          let obj: any = {
            ACC_CD: item.ACC_CD,
            ACC_NO: item.ACC_NO,
            ACC_NAME: item.ACC_NAME,
            ACC_TYPE: item.ACC_TYPE,
            CREATE_BY: item.CREATE_BY,
            CREATE_DATE: moment().format("YYYY-MM-DD HH:mm:ss"),
          }
          try {
            return await this.accountsRepository.create(obj)
              .then((data: any) => {
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
        case "update":
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
            return await this.accountsRepository.updateById(item.ID, item)
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
