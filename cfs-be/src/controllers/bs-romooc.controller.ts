import {JSONObject} from '@loopback/core';
import {
  repository
} from '@loopback/repository';
import {
  post, requestBody
} from '@loopback/rest';
import moment from 'moment';
import { } from '../models';
import {BS_ROMOOC} from '../models/bs-romooc.model';
import { } from '../repositories';
import {BS_ROMOOCRepository} from '../repositories/bs-romooc.repository';

const spec = {
  responses: {
    '200': {
      description: 'BS_ROMOOC list with filter',
      content: {
        'application/json': {
          schema: {},
        },
      },
    }
  }
}

export class BS_ROMOOCController {
  constructor(
    @repository(BS_ROMOOCRepository)
    public BS_ROMOOCRepository: BS_ROMOOCRepository,
  ) { }

  public response: any = {
    Status: false,
    Payload: [],
    Message: ""
  };

  @post('/bs-romooc/view', spec)
  async view(): Promise<BS_ROMOOC[]> {
    return this.BS_ROMOOCRepository.find();
  }

  @post('/bs-romoocs/getItem', spec)
  async getItem(
    @requestBody() bsRemooc: BS_ROMOOC,
  ): Promise<BS_ROMOOC[]> {
    let checkCode: any = await this.BS_ROMOOCRepository.find({
      fields: ["ID", "REMOOC_NO", "REMOOC_WEIGHT", "REMOOC_WEIGHT_REGIS", "REMOOC_DATE_EXP"],
      where: {REMOOC_NO: bsRemooc.REMOOC_NO}
    });
    if (checkCode.length) {
      this.response['Payload'] = checkCode
      this.response['Status'] = true;
      this.response['Message'] = 'Load dữ liệu thành công!';
      return this.response;
    } else {
      this.response['Payload'] = []
      this.response['Status'] = false;
      this.response['Message'] = 'Không tìm thấy thông tin số remooc!';
      return this.response;
    }
  }

  @post('/bs-romooc/InsertAndUpdate', spec)
  async insertAndUpdate(
    @requestBody() bsReMooc: JSONObject[]
  ): Promise<any> {
    return Promise.all(bsReMooc.map(async (item: any) => {
      switch (item.status) {
        case 'insert':
          if (!item.REMOOC_NO) {
            this.response['Status'] = false;
            this.response['Message'] = 'Vui lòng cung cấp số xe!'
            return this.response;
          }

          if (!item.REMOOC_WEIGHT) {
            this.response['Status'] = false;
            this.response['Message'] = 'Vui lòng cung cấp lại trọng lượng!'
            return this.response;
          }
          if (!item.REMOOC_WEIGHT_REGIS) {
            this.response['Status'] = false;
            this.response['Message'] = 'Vui lòng cung cấp lại trọng lượng đăng kiểm!'
            return this.response;
          }
          if (!item.REMOOC_DATE_EXP) {
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
          let checkCode = await this.BS_ROMOOCRepository.find({
            where: {
              REMOOC_NO: item.REMOOC_NO
            }
          });
          if (checkCode.length > 0) {
            this.response['Status'] = false;
            this.response['Message'] = "Số Romooc đã tồn tại!";
            return this.response;
          }
          let obj: any = {
            REMOOC_NO: item.REMOOC_NO,
            REMOOC_WEIGHT: Number(item.REMOOC_WEIGHT),
            REMOOC_WEIGHT_REGIS: Number(item.REMOOC_WEIGHT_REGIS),
            REMOOC_DATE_EXP: item.REMOOC_DATE_EXP,
            CREATE_BY: item.CREATE_BY,
            CREATE_DATE: moment().format("YYYY-MM-DD HH:mm:ss"),
          };
          try {
            return await this.BS_ROMOOCRepository.create(obj)
              .then((data: any) => {
                console.log(1)
                this.response['Status'] = true;
                this.response['Payload'].push(data);
                this.response['Message'] = "Lưu dữ liệu thành công!";
                return this.response;
              })
          } catch {
            console.log(2)
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
            return await this.BS_ROMOOCRepository.updateById(item.ID, item)
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

  @post('/bs-romooc/delete', spec)
  async delete(
    @requestBody() bsReMooc: BS_ROMOOC[]
  ): Promise<any> {
    return Promise.all(bsReMooc.map(async (item: any) => {
      if (!item.ID) {
        this.response['Status'] = false;
        this.response['Message'] = "Vui lòng cung cấp lại số ID!";
        return this.response;
      }
      try {
        return await this.BS_ROMOOCRepository.deleteById(item.ID)
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
