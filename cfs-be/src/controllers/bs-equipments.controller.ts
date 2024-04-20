import {JSONObject} from '@loopback/core';
import {
  repository
} from '@loopback/repository';
import {
  getModelSchemaRef, post, requestBody
} from '@loopback/rest';
import moment from 'moment';
import { } from '../models';
import {BS_EQUIPMENTS} from '../models/bs-equipments.model';
import { } from '../repositories';
import {BsEquipmentsRepository} from '../repositories/bs-equipments.repository';

const spec = {
  responses: {
    '200': {
      description: 'BS_EQUIPMENTS detail list of filter',
      content: {
        'application/json': {
          schema: {},
        }
      }
    }
  }
}

export class BsEquipmentsController {
  constructor(
    @repository(BsEquipmentsRepository)
    public bsEquipmentsRepository: BsEquipmentsRepository,
  ) { }

  public response: any = {
    Status: false,
    Payload: [],
    Message: ""
  };

  @post('/bs-equipments/view', spec)
  async view(): Promise<BS_EQUIPMENTS[]> {
    return this.bsEquipmentsRepository.find();
  }

  //Thoilc(*Note)-Group data
  @post('/bs-equipments/getItem', spec)
  async getItem(
    @requestBody() equipment: BS_EQUIPMENTS
  ): Promise<any> {
    if (!equipment.EQU_TYPE) {
      this.response['Status'] = false;
      this.response['Message'] = 'Không có loại thiết bị!';
      return this.response;
    };

    return await this.bsEquipmentsRepository.find({
      include: [
        {
          relation: 'equimentTypeInfo',
        },
      ],
      where: {
        WAREHOUSE_CODE: equipment.WAREHOUSE_CODE,
        EQU_TYPE: equipment.EQU_TYPE
      }
    })
      .then(data => {
        if (data.length) {
          this.response['Status'] = true;
          this.response['Payload'] = data;
          this.response['Message'] = `Truy vấn dữ liệu thành công!`;
          return this.response;
        } else {
          this.response['Status'] = false;
          this.response['Payload'] = [];
          this.response['Message'] = `Truy vấn dữ liệu thất bại!`;
          return this.response;
        }
      })
      .catch(err => {
        this.response['Status'] = false;
        this.response['Payload'] = err;
        this.response['Message'] = `Phát sinh lỗi! Vui lòng liên hệ bộ phận kĩ thuật!`;
      })
  }

  @post('/bs-equipments/InsertAndUpdate', spec)
  async insertAndUpdate(
    @requestBody() bsEquipments: JSONObject[]
  ): Promise<any> {
    return Promise.all(bsEquipments.map(async (item: any) => {
      switch (item.status) {
        case 'insert':
          if (!item.EQU_TYPE) {
            this.response['Status'] = false;
            this.response['Message'] = 'Vui lòng cung cấp mã loại thiết bị!'
            return this.response;
          }
          if (!item.EQU_CODE) {
            this.response['Status'] = false;
            this.response['Message'] = 'Vui lòng cung cấp lại mã thiết bị!'
            return this.response;
          }
          if (!item.EQU_CODE_NAME) {
            this.response['Status'] = false;
            this.response['Message'] = 'Vui lòng cung cấp lại tên thiết bị!'
            return this.response;
          }
          if (!item.CREATE_BY) {
            this.response['Status'] = false;
            this.response['Message'] = 'Vui lòng cung cấp lại tên người tạo!'
            return this.response;
          }
          // ------- check exist equipment code --------
          let checkCode = await this.bsEquipmentsRepository.find({
            where: {
              EQU_CODE: item.EQU_CODE
            }
          });
          if (checkCode.length > 0) {
            this.response['Status'] = false;
            this.response['Message'] = "Mã thiết bị đã tồn tại!";
            return this.response;
          }
          let obj: any = {
            EQU_TYPE: item.EQU_TYPE,
            EQU_CODE: item.EQU_CODE,
            WAREHOUSE_CODE: item.WAREHOUSE_CODE,
            BLOCK: item.BLOCK,
            EQU_CODE_NAME: item.EQU_CODE_NAME,
            CREATE_BY: item.CREATE_BY,
            CREATE_DATE: moment().format("YYYY-MM-DD HH:mm:ss"),
          };
          try {
            return await this.bsEquipmentsRepository.create(obj)
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
            return await this.bsEquipmentsRepository.updateById(item.ID, item)
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

  @post('/bs-equipments/delete', spec)
  async delete(
    @requestBody.array(getModelSchemaRef(BS_EQUIPMENTS)) bsEquipments: BS_EQUIPMENTS[]
  ): Promise<any> {
    return Promise.all(bsEquipments.map(async (item: any) => {
      if (!item.ID) {
        this.response['Status'] = false;
        this.response['Message'] = "Vui lòng cung cấp lại số ID!";
        return this.response;
      }
      try {
        return await this.bsEquipmentsRepository.deleteById(item.ID)
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
