import {JSONObject} from '@loopback/core';
import {
  repository
} from '@loopback/repository';
import {getModelSchemaRef, post, requestBody} from '@loopback/rest';
import moment from 'moment';
import {BS_GATE} from '../models';
import {BsGateRepository} from '../repositories';

const spec = {
  responses: {
    '200': {
      description: 'BS_GATE detail list of filter',
      content: {
        'application/json': {
          schema: {},
        }
      }
    }
  }
}

export class BsGateController {
  constructor(
    @repository(BsGateRepository)
    public bsGateRepository: BsGateRepository,
  ) { }

  public response: any = {
    Status: false,
    Payload: [],
    Message: ""
  };

  //Thoilc(*Note)-Hiển thị cổng
  @post('/bs-gates/view', spec)
  async view(): Promise<BS_GATE[]> {
    return this.bsGateRepository.find();
  }

  //Thoilc(*Note)-Cập nhật và thêm mới cổng
  @post('/bs-gates/InsertAndUpdate', spec)
  async createUpdate(
    @requestBody() bsGate: JSONObject[]
  ): Promise<any> {
    return Promise.all(bsGate.map(async (item: any) => {
      switch (item.status) {
        case 'insert':
          if (!item.GATE_CODE) {
            this.response['Status'] = false;
            this.response['Message'] = 'Vui lòng cung cấp mã loại khách hàng!'
            return this.response;
          }
          if (!item.GATE_NAME) {
            this.response['Status'] = false;
            this.response['Message'] = 'Vui lòng cung cấp lại tên cổng!'
            return this.response;
          }
          if (!item.CREATE_BY) {
            this.response['Status'] = false;
            this.response['Message'] = 'Vui lòng cung cấp lại tên người tạo!'
            return this.response;
          }
          // ------- check exist gate code --------
          let checkCode = await this.bsGateRepository.find({
            where: {
              GATE_CODE: item.GATE_CODE
            }
          });
          if (checkCode.length > 0) {
            this.response['Status'] = false;
            this.response['Message'] = "Mã cổng đã tồn tại!";
            return this.response;
          }
          let obj: any = {
            GATE_CODE: item.GATE_CODE,
            GATE_NAME: item.GATE_NAME,
            CREATE_BY: item.CREATE_BY,
            CREATE_DATE: moment().format("YYYY-MM-DD HH:mm:ss"),
          };
          try {
            return await this.bsGateRepository.create(obj)
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
            return await this.bsGateRepository.updateById(item.ID, item)
              .then(() => {
                this.response['Status'] = true;
                this.response['Payload'].push(item);
                this.response['Message'] = "Lưu dữ liệu thành công!";
                return this.response;
              })
          } catch (err) {
            this.response['Status'] = false;
            this.response['Payload'] = err
            this.response['Message'] = "Không thể lưu mới dữ liệu!";
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

  //Thoilc(*Note)-Xoá cổng
  @post('/bs-gates/delete', spec)
  async delete(
    @requestBody.array(getModelSchemaRef(BS_GATE)) bsGate: BS_GATE[]
  ): Promise<any> {
    return Promise.all(bsGate.map(async (item: any) => {
      if (!item.ID) {
        this.response['Status'] = false;
        this.response['Message'] = "Vui lòng cung cấp lại số ID!";
        return this.response;
      }
      try {
        return await this.bsGateRepository.deleteById(item.ID)
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
