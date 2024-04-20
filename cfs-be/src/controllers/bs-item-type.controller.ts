import {JSONObject} from '@loopback/core';
import {
  repository
} from '@loopback/repository';
import {
  getModelSchemaRef, HttpErrors, post, requestBody
} from '@loopback/rest';
import moment from 'moment';
import {BS_ITEM_TYPE} from '../models';
import {BsItemTypeRepository} from '../repositories';

const spec = {
  responses: {
    '200': {
      description: 'BS_ITEM_TYPES detail list of filter',
      content: {
        'application/json': {
          schema: {},
        }
      }
    }
  }
}

export class BsItemTypeController {
  constructor(
    @repository(BsItemTypeRepository)
    public bsItemTypeRepository: BsItemTypeRepository,
  ) { }

  public response: any = {
    Status: false,
    Payload: [],
    Message: ""
  };

  //Thoilc(*Note)-Hiển thị loại hàng hoá
  @post('/bs-item-types/view', spec)
  async view(): Promise<BS_ITEM_TYPE[]> {
    return this.bsItemTypeRepository.find({
      fields: ['ID', 'ITEM_TYPE_CODE', 'ITEM_TYPE_NAME'],
      order: ['ITEM_TYPE_CODE ASC']
    });
  }

  //Thoilc(*Note)-Hiển thị mã loại hàng hoá
  @post('/bs-item-types/viewCode', spec)
  async viewCode(): Promise<BS_ITEM_TYPE[]> {
    return this.bsItemTypeRepository.find({
      fields: ['ITEM_TYPE_CODE']
    });
  }

  //Thoilc(*Note)-Cập nhật và thêm mới loại hàng hoá
  @post('/bs-item-types/insertAndUpdate', spec)
  async createUpdate(
    @requestBody() bsItemType: JSONObject[]
  ): Promise<any> {
    return Promise.all(bsItemType.map(async (item: any) => {
      switch (item.status) {
        case 'insert':
          if (!item.ITEM_TYPE_CODE) {
            this.response['Status'] = false;
            this.response['Message'] = "Vui lòng cung cấp lại mã loại hàng hoá";
            return this.response;
          }
          if (!item.ITEM_TYPE_NAME) {
            this.response['Status'] = false;
            this.response['Message'] = "Vui lòng cung cấp lại tên loại hàng hoá";
            return this.response;
          }
          if (!item.CREATE_BY) {
            this.response['Status'] = false;
            this.response['Message'] = "Vui lòng cung cấp lại tên người tạo";
            return this.response;
          }
          let obj: any = {
            ITEM_TYPE_CODE: item.ITEM_TYPE_CODE,
            ITEM_TYPE_NAME: item.ITEM_TYPE_NAME,
            CREATE_BY: item.CREATE_BY,
            CREATE_DATE: moment().format("YYYY-MM-DD HH:mm:ss"),
          };
          // ------- check exist customer type code --------
          let checkCode = await this.bsItemTypeRepository.find({
            where: {
              ITEM_TYPE_CODE: item.ITEM_TYPE_CODE
            }
          });

          if (checkCode.length > 0) {
            this.response['Status'] = false;
            this.response['Message'] = "Mã loại hàng hoá đã tồn tại!";
            return this.response;
          }
          // -----------------------------------------------
          try {
            return await this.bsItemTypeRepository.create(obj)
              .then(data => {
                this.response['Status'] = true;
                this.response['Payload'].push(data);
                this.response['Message'] = "Lưu dữ liệu thành công!";
                return this.response;
              });
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
          item.UPDATE_DATE = moment().format("YYYY-MM-DD HH:mm:ss");
          try {
            return await this.bsItemTypeRepository.updateById(item.ID, item)
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
    }))
      .then(() => {
        return this.response;
      });
  }

  //Thoilc(*Note)-Xoá loại hàng hoá
  @post('/bs-item-types/delete', spec)
  async delete(
    @requestBody.array(getModelSchemaRef(BS_ITEM_TYPE)) bsItemType: BS_ITEM_TYPE[]
  ): Promise<any> {
    return Promise.all(bsItemType.map(async item => {
      try {
        if (!item.ID) {
          this.response['Status'] = false;
          this.response['Message'] = "Vui lòng cung cấp lại số ID";
          return this.response;
        }
        return await this.bsItemTypeRepository.deleteById(item.ID)
          .then(() => {
            this.response['Status'] = true;
            this.response['Message'] = "Xóa dữ liệu thành công!";
            return this.response;
          });
      } catch {
        this.response['Status'] = false;
        this.response['Message'] = "Xóa dữ liệu không thành công!";
      }
    })).then(() => {
      return this.response;
    });
  }
}
