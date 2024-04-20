import {JSONObject} from '@loopback/core';
import {
  repository
} from '@loopback/repository';
import {
  getModelSchemaRef, post, requestBody
} from '@loopback/rest';
import moment from 'moment';
import { } from '../models';
import {BS_EQUIPMENTS_TYPE} from '../models/bs-equipments-type.model';
import { } from '../repositories';
import {BsEquipmentsTypeRepository} from '../repositories/bs-equipments-type.repository';

const spec = {
  responses: {
    '200': {
      description: 'BS_EQUIPMENTS_TYPE detail list of filter',
      content: {
        'application/json': {
          schema: {},
        }
      }
    }
  }
}

export class BsEquipmentsTypeController {
  constructor(
    @repository(BsEquipmentsTypeRepository)
    public bsEquipmentsTypeRepository: BsEquipmentsTypeRepository,
  ) { }
  public response: any = {
    Status: false,
    Payload: [],
    Message: ""
  };

  @post('/bs-equipments-types/view', spec)
  async view(): Promise<BS_EQUIPMENTS_TYPE[]> {
    return this.bsEquipmentsTypeRepository.find();
  }

  @post('/bs-equipments-types/InsertAndUpdate', spec)
  async insertAndUpdate(
    @requestBody() bsEquipments: JSONObject[]
  ): Promise<any> {
    return Promise.all(bsEquipments.map(async (item: any) => {
      switch (item.status) {
        case 'insert':
          if (!item.EQU_TYPE) {
            this.response['Status'] = false;
            this.response['Message'] = 'Vui lòng cung cấp lại mã loại thiết bị!'
            return this.response;
          }
          if (!item.EQU_TYPE_NAME) {
            this.response['Status'] = false;
            this.response['Message'] = 'Vui lòng cung cấp lại tên loại thiết bị!'
            return this.response;
          }
          if (!item.CREATE_BY) {
            this.response['Status'] = false;
            this.response['Message'] = 'Vui lòng cung cấp lại tên người tạo!'
            return this.response;
          }
          let obj: any = {
            EQU_TYPE: item.EQU_TYPE,
            EQU_TYPE_NAME: item.EQU_TYPE_NAME,
            CREATE_BY: item.CREATE_BY,
            CREATE_DATE: moment().format("YYYY-MM-DD HH:mm:ss"),
          };
          // ------- check exist equipment type --------
          let checkCode = await this.bsEquipmentsTypeRepository.find({
            where: {
              EQU_TYPE: item.EQU_TYPE
            }
          });
          if (checkCode.length > 0) {
            this.response['Status'] = false;
            this.response['Message'] = "Mã loại thiết bị đã tồn tại!";
            return this.response;
          }
          try {
            return await this.bsEquipmentsTypeRepository.create(obj)
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
            return await this.bsEquipmentsTypeRepository.updateById(item.ID, item)
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

  @post('/bs-equipments-types/delete', spec)
  async delete(
    @requestBody.array(getModelSchemaRef(BS_EQUIPMENTS_TYPE)) bsEquipments: BS_EQUIPMENTS_TYPE[]
  ): Promise<any> {
    return Promise.all(bsEquipments.map(async (item: any) => {
      if (!item.ID) {
        this.response['Status'] = false;
        this.response['Message'] = "Vui lòng cung cấp lại số ID!";
        return this.response;
      }
      try {
        return await this.bsEquipmentsTypeRepository.deleteById(item.ID)
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
