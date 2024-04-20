import {JSONObject} from '@loopback/core';
import {
  repository
} from '@loopback/repository';
import {post, requestBody} from '@loopback/rest';
import moment from 'moment';
import { } from '../models';
import {BS_TRUCK} from '../models/bs-truck.model';
import {JOB_GATERepository} from '../repositories';
import {BS_TRUCKRepository} from '../repositories/bs-truck.repository';
const spec = {
  responses: {
    '200': {
      description: 'BS_TRUCK list with filter',
      content: {
        'application/json': {
          schema: {},
        },
      },
    }
  }
}

export class BS_TRUCKController {
  constructor(
    @repository(BS_TRUCKRepository)
    public BS_TRUCKRepository: BS_TRUCKRepository,
    @repository(JOB_GATERepository)
    public jobGateRepo: JOB_GATERepository,
  ) { }

  public response: any = {
    Status: false,
    Payload: [],
    Message: ""
  };

  @post('/bs-trucks/view', spec)
  async view(): Promise<BS_TRUCK[]> {
    return this.BS_TRUCKRepository.find();
  }

  @post('/bs-trucks/getItem', spec)
  async getItem(
    @requestBody() bsTruck: BS_TRUCK,
  ): Promise<any> {
    if (!bsTruck.TRUCK_NO) {
      this.response['Status'] = false;
      this.response['Message'] = `Vui lòng cung cấp số xe!`;
      return this.response;
    }
    let flag: boolean = false;
    let checkCode: any = await this.BS_TRUCKRepository.find({
      fields: ["ID", "TRUCK_NO", "WEIGHT_REGIS", "WEIGHT_REGIS_ALLOW", "TRUCK_DATE_EXP"],
      where: {TRUCK_NO: bsTruck.TRUCK_NO}
    });
    await this.jobGateRepo.find({
      where: {
        TRUCK_NO: String(bsTruck.TRUCK_NO)
      }
    })
      .then((data: any) => {
        if (data.length > 0) {
          data.map((item: any) => {
            if (item.IS_SUCCESS_OUT === false) {
              flag = true;
              this.response['Status'] = false;
              this.response['Payload'] = [];
              this.response['Message'] = `Số xe ${bsTruck.TRUCK_NO} chưa ra cổng!`
            }
          })
        }
      })
      .catch(err => {
        this.response['Status'] = false;
        this.response['Payload'] = err;
        this.response['Message'] = `Phát sinh lỗi! Vui lòng liên hệ bộ phận kĩ thuật!`
        return this.response;
      })
    if (flag) {
      return this.response;
    }
    if (checkCode.length) {
      this.response['Payload'] = checkCode
      this.response['Status'] = true;
      this.response['Message'] = 'Load dữ liệu thành công!';
      return this.response;
    } else {
      this.response['Payload'] = []
      this.response['Status'] = false;
      this.response['Message'] = 'Không tìm thấy số xe!';
      return this.response;
    }
  }

  @post('/bs-trucks/InsertAndUpdate', spec)
  async insertAndUpdate(
    @requestBody() bsTruck: JSONObject[]
  ): Promise<any> {
    return Promise.all(bsTruck.map(async (item: any) => {
      switch (item.status) {
        case 'insert':
          if (!item.TRUCK_NO) {
            this.response['Status'] = false;
            this.response['Message'] = 'Vui lòng cung cấp số xe!'
            return this.response;
          }

          if (!item.WEIGHT_REGIS_ALLOW) {
            this.response['Status'] = false;
            this.response['Message'] = 'Vui lòng cung cấp lại trọng lượng!'
            return this.response;
          }
          if (!item.WEIGHT_REGIS) {
            this.response['Status'] = false;
            this.response['Message'] = 'Vui lòng cung cấp lại trọng lượng đăng kiểm!'
            return this.response;
          }
          if (!item.TRUCK_DATE_EXP) {
            this.response['Status'] = false;
            this.response['Message'] = 'Vui lòng cung cấp lại hạn đăng kiểm đầu kéo!'
            return this.response;
          }
          if (!item.CREATE_BY) {
            this.response['Status'] = false;
            this.response['Message'] = 'Vui lòng cung cấp lại tên người tạo!'
            return this.response;
          }
          // ------- check exist truck no --------
          let checkCode = await this.BS_TRUCKRepository.find({
            where: {
              TRUCK_NO: item.TRUCK_NO
            }
          });
          if (checkCode.length > 0) {
            this.response['Status'] = false;
            this.response['Message'] = "Số xe đã tồn tại!";
            return this.response;
          }
          let obj: any = {
            TRUCK_NO: item.TRUCK_NO,
            WEIGHT_REGIS_ALLOW: item.WEIGHT_REGIS_ALLOW,
            WEIGHT_REGIS: item.WEIGHT_REGIS,
            TRUCK_DATE_EXP: item.TRUCK_DATE_EXP,
            CREATE_BY: item.CREATE_BY,
            CREATE_DATE: moment().format("YYYY-MM-DD HH:mm:ss"),
          };
          try {
            return await this.BS_TRUCKRepository.create(obj)
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
            return await this.BS_TRUCKRepository.updateById(item.ID, item)
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

  @post('/bs-trucks/delete', spec)
  async delete(
    @requestBody() bsTruck: BS_TRUCK[]
  ): Promise<any> {
    return Promise.all(bsTruck.map(async (item: any) => {
      if (!item.ID) {
        this.response['Status'] = false;
        this.response['Message'] = "Vui lòng cung cấp lại số ID!";
        return this.response;
      }
      try {
        return await this.BS_TRUCKRepository.deleteById(item.ID)
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
}
