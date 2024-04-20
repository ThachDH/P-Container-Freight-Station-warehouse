import {JSONObject} from '@loopback/core';
import {
  repository
} from '@loopback/repository';
import {
  getModelSchemaRef, HttpErrors, post, requestBody
} from '@loopback/rest';
import moment from 'moment';
import {BS_UNIT} from '../models';
import {BsUnitRepository} from '../repositories';

const spec = {
  responses: {
    '200': {
      description: 'BS_UNIT list with filter',
      content: {
        'application/json': {
          schema: {},
        },
      },
    }
  }
}

export class BsUnitController {
  constructor(
    @repository(BsUnitRepository)
    public bsUnitRepository: BsUnitRepository,

  ) { }

  public response: any = {
    Status: false,
    Payload: [],
    Message: ""
  };

  //Thoilc(*Note)-Hiển thị đơn vị tính
  @post('/bs-units/view', spec)
  async view(): Promise<BS_UNIT[]> {
    return this.bsUnitRepository.find({
      fields: ['ID', 'UNIT_CODE', 'UNIT_NAME']
    });
  }

  //Thoilc(*Note)-Hiển thị đơn vị tính
  @post('/bs-units/viewCode', spec)
  async viewCode(): Promise<BS_UNIT[]> {
    return this.bsUnitRepository.find({
      fields: ['UNIT_CODE']
    });
  }
  //Thoilc(*Note)-Cập nhật và thêm mới đơn vị tính
  @post('/bs-units/insertAndUpdate', spec)
  async insertAndUpdate(
    @requestBody() bsUnit: JSONObject[],
  ): Promise<any> {
    return Promise.all(bsUnit.map(async (item: any) => {
      switch (item.status) {
        case 'insert':
          if (!item.UNIT_CODE) {
            this.response['Status'] = false;
            this.response['Message'] = "Vui lòng cung cấp lại mã đơn vị tính";
            return this.response;
          }
          if (!item.UNIT_NAME) {
            this.response['Status'] = false;
            this.response['Message'] = "Vui lòng cung cấp lại tên đơn vị tính";
            return this.response;
          }
          if (!item.CREATE_BY) {
            this.response['Status'] = false;
            this.response['Message'] = "Vui lòng cung cấp lại tên người tạo";
            return this.response;
          }
          let obj: any = {
            UNIT_CODE: (item.UNIT_CODE).length <= 3 ? item.UNIT_CODE : undefined,
            UNIT_NAME: item.UNIT_NAME,
            CREATE_BY: item.CREATE_BY,
            CREATE_DATE: moment().format("YYYY-MM-DD hh:mm:ss")
          };
          // ------- check exist customer type code --------
          let checkCode = await this.bsUnitRepository.find({
            where: {
              UNIT_CODE: item.UNIT_CODE
            }
          });
          if (checkCode.length > 0) {
            this.response['Status'] = false;
            this.response['Message'] = "Mã biểu cước đã tồn tại!";
            return this.response;
          }
          // -----------------------------------------------
          if (!obj.UNIT_CODE) {
            this.response['Status'] = false;
            this.response['Message'] = "Mã đơn vị phải nhỏ hơn 3 ký tự";
            return this.response;
          }
          try {
            return await this.bsUnitRepository.create(obj)
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
            this.response['Message'] = "Vui lòng cung cấp lại số ID";
            return this.response;
          }
          if (!item.UPDATE_BY) {
            this.response['Status'] = false;
            this.response['Message'] = "Vui lòng cung cấp lại tên người cập nhật";
            return this.response;
          }
          item.UPDATE_DATE = moment().format("YYYY-MM-DD hh:mm:ss");
          try {
            console.log(item.ID);
            return await this.bsUnitRepository.updateById(item.ID, item)
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
          throw new HttpErrors.Forbidden("ERROR");
      }
    })).then(() => {
      return this.response;
    });
  }

  //Thoilc(*Note)-Xoá đơn vị tính
  @post('/bs-units/delete', spec)
  async delete(
    @requestBody.array(getModelSchemaRef(BS_UNIT)) trfCode: BS_UNIT[],
  ): Promise<any> {
    return Promise.all(trfCode.map(async item => {
      try {
        if (!item.ID) {
          this.response['Status'] = false;
          this.response['Message'] = "Vui lòng cung cấp lại số ID";
          return this.response;
        }
        return await this.bsUnitRepository.deleteById(item.ID)
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
}
