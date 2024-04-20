import {JSONObject} from '@loopback/core';
import {
  repository
} from '@loopback/repository';
import {post, requestBody} from '@loopback/rest';
import moment from 'moment';
import {CONFIG_MIN_VALUE} from '../models';
import {CONFIG_MIN_VALUERepository} from '../repositories';
const spec = {
  responses: {
    '200': {
      description: 'CONFIG_MIN_VALUE detail list of filter',
      content: {
        'application/json': {
          schema: {},
        }
      }
    }
  }
}

export class CONFIG_MIN_VALUEController {
  constructor(
    @repository(CONFIG_MIN_VALUERepository)
    public CONFIG_MIN_VALUERepo: CONFIG_MIN_VALUERepository,
  ) { }

  public response: any = {
    Status: false,
    Payload: [],
    Message: ""
  };

  @post('/config-min-value/view', spec)
  async view(): Promise<CONFIG_MIN_VALUE[]> {
    return this.CONFIG_MIN_VALUERepo.find()
      .then(data => {
        if (data.length) {
          this.response['Status'] = true;
          this.response['Payload'] = data;
          this.response['Message'] = `Truy vấn dữ liệu thành công!`
          return this.response
        } else {
          this.response['Status'] = false;
          this.response['Payload'] = [];
          this.response['Message'] = `Không tìm thấy dữ liệu!`
          return this.response
        }
      })
      .catch(err => {
        this.response['Status'] = false;
        this.response['Payload'] = [];
        this.response['Message'] = `Phát sinh lỗi! Vui lòng liên hệ bộ phận kĩ thuật!`;
        return this.response
      })
  }

  @post('/config-min-value/insertAndUpdate', spec)
  async createUpdate(
    @requestBody() req: JSONObject[]
  ): Promise<any> {
    if (!req.length) {
      this.response['Status'] = false;
      this.response['Message'] = `Không có dữ liệu được cập nhật!`;
      return this.response;
    }
    return Promise.all(req.map(async (item: any) => {
      switch (item.status) {
        case 'insert':
          if (!item.CNTRSZTP) {
            this.response['Status'] = false;
            this.response['Message'] = "Vui lòng cung cấp lại kích cỡ ISO!";
            return this.response;
          }
          if (!item.UNIT_INVOICE) {
            this.response['Status'] = false;
            this.response['Message'] = "Vui lòng cung cấp lại đơn vị hóa đơn!";
            return this.response;
          }
          if (!String(item.MIN_VALUE)) {
            this.response['Status'] = false;
            this.response['Message'] = "Vui lòng cung cấp lại giá trị tối thiểu!";
            return this.response;
          }
          if (!item.CREATE_BY) {
            this.response['Status'] = false;
            this.response['Message'] = "Vui lòng cung cấp lại tên người tạo";
            return this.response;
          }
          let obj = {
            CNTRSZTP: item.CNTRSZTP,
            UNIT_INVOICE: item.UNIT_INVOICE,
            MIN_VALUE: item.MIN_VALUE,
            CREATE_BY: item.CREATE_BY,
            CREATE_DATE: moment().format("YYYY-MM-DD HH:mm:ss"),
          }
          return await this.CONFIG_MIN_VALUERepo.create(obj)
            .then(data => {
              this.response['Status'] = true;
              this.response['Payload'].push(data);
              this.response['Message'] = "Lưu dữ liệu thành công!";
              return this.response;
            })
            .catch(err => {
              this.response['Status'] = false;
              this.response['Payload'] = err;
              this.response['Message'] = "Độ dài kí tự quá giới hạn cho phép!";
              return this.response;
            })
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
            return await this.CONFIG_MIN_VALUERepo.updateById(item.ID, item)
              .then(() => {
                this.response['Status'] = true;
                this.response['Payload'].push(item);
                this.response['Message'] = "Lưu dữ liệu thành công!";
                return this.response;
              })
          } catch (err) {
            this.response['Status'] = false;
            this.response['Payload'] = err
            this.response['Message'] = "Độ dài kí tự quá giới hạn cho phép!";
            return this.response;
          }
        default:
          this.response['Status'] = false;
          this.response['Message'] = "Vui lòng cung cấp lại trạng thái!";
          return this.response;
      }
    })).then(() => {
      return this.response;
    });
  }

  @post('/config-min-value/delete', spec)
  async delete(
    @requestBody() req: JSONObject[]
  ): Promise<any> {
    return Promise.all(req.map(async (item: any) => {
      if (!item.ID) {
        this.response['Status'] = false;
        this.response['Message'] = "Vui lòng cung cấp lại số ID!";
        return this.response;
      }
      try {
        return await this.CONFIG_MIN_VALUERepo.deleteById(item.ID)
          .then(() => {
            this.response['Status'] = true;
            this.response['Message'] = "Xóa dữ liệu thành công!";
            return this.response;
          })
      } catch (err) {
        this.response['Status'] = false;
        this.response['Payload'] = err
        this.response['Message'] = "Xóa dữ liệu không thành công!";
      }
    })).then((value) => {
      return this.response;
    })
  }
}
