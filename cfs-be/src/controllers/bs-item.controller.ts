import {JSONObject} from '@loopback/core';
import {
  repository
} from '@loopback/repository';
import {getModelSchemaRef, HttpErrors, post, requestBody} from '@loopback/rest';
import moment from 'moment';
import {BS_ITEM} from '../models';
import {BsItemRepository} from '../repositories';

const spec = {
  responses: {
    '200': {
      description: 'BS_ITEM detail list of filter',
      content: {
        'application/json': {
          schema: {},
        }
      }
    }
  }
}

export class BsItemController {
  constructor(
    @repository(BsItemRepository)
    public bsItemRepository: BsItemRepository,
  ) { }

  public response: any = {
    Status: false,
    Payload: [],
    Message: ""
  };

  //Thoilc(*Note)-Hiển thị hàng hoá
  @post('/bs-items/view', spec)
  async view(): Promise<BS_ITEM[]> {
    return this.bsItemRepository.find({
      fields: ['ID', 'ITEM_CODE', 'ITEM_NAME', 'UNIT', 'L', 'W', 'H', 'WAREHOUSE_CODE', 'CUSTOMER_CODE', 'STOCK_DAYS', 'WEIGHT']
    });
  }

  //Thoilc(*Note)-Cập nhật và thêm mới hàng hoá
  @post('/bs-items/insertAndUpdate', spec)
  async createUpdate(
    @requestBody() bsItem: JSONObject[]
  ): Promise<any> {
    return Promise.all(bsItem.map(async (item: any) => {
      switch (item.status) {
        case 'insert':
          if (!item.ITEM_CODE) {
            this.response['Status'] = false;
            this.response['Message'] = "Vui lòng cung cấp lại mã hàng hoá";
            return this.response;
          }
          if (!item.ITEM_NAME) {
            this.response['Status'] = false;
            this.response['Message'] = "Vui lòng cung cấp lại tên hàng hoá";
            return this.response;
          }
          if (!item.UNIT) {
            this.response['Status'] = false;
            this.response['Message'] = "Vui lòng cung cấp lại đơn vị tính";
            return this.response;
          }
          if (!item.L) {
            this.response['Status'] = false;
            this.response['Message'] = "Vui lòng cung cấp lại chiều dài";
            return this.response;
          }

          if (!item.W) {
            this.response['Status'] = false;
            this.response['Message'] = "Vui lòng cung cấp lại chiều rộng";
            return this.response;
          }

          if (!item.H) {
            this.response['Status'] = false;
            this.response['Message'] = "Vui lòng cung cấp lại chiều cao";
            return this.response;
          }

          if (!item.WAREHOUSE_CODE) {
            this.response['Status'] = false;
            this.response['Message'] = "Vui lòng cung cấp lại mã kho";
            return this.response;
          }
          if (!item.CUSTOMER_CODE) {
            this.response['Status'] = false;
            this.response['Message'] = "Vui lòng cung cấp lại mã khách hàng";
            return this.response;
          }
          if (!item.STOCK_DAYS) {
            this.response['Status'] = false;
            this.response['Message'] = "Vui lòng cung cấp lại ngày tồn kho";
            return this.response;
          }
          if (!item.WEIGHT) {
            this.response['Status'] = false;
            this.response['Message'] = "Vui lòng cung cấp lại trọng lượng";
            return this.response;
          }
          if (!item.CREATE_BY) {
            this.response['Status'] = false;
            this.response['Message'] = "Vui lòng cung cấp lại tên người tạo";
            return this.response;
          }
          let obj: any = {
            ITEM_CODE: item.ITEM_CODE,
            ITEM_NAME: item.ITEM_NAME,
            UNIT: item.UNIT,
            L: item.L > 0 ? item.L : undefined,
            W: item.W > 0 ? item.W : undefined,
            H: item.H > 0 ? item.H : undefined,
            WAREHOUSE_CODE: item.WAREHOUSE_CODE,
            CUSTOMER_CODE: item.CUSTOMER_CODE,
            STOCK_DAYS: item.STOCK_DAYS > 0 ? item.STOCK_DAYS : undefined,
            WEIGHT: item.WEIGHT > 0 ? item.WEIGHT : undefined,
            CREATE_BY: item.CREATE_BY,
            CREATE_DATE: moment().format("YYYY-MM-DD HH:mm:ss"),
          };
          if (!obj.L) {
            this.response['Status'] = false;
            this.response['Message'] = "Vui lòng xem lại chiều dài bắt buộc > 0";
            return this.response;
          }
          if (!obj.W) {
            this.response['Status'] = false;
            this.response['Message'] = "Vui lòng xem lại chiều rộng bắt buộc > 0";
            return this.response;
          }
          if (!obj.H) {
            this.response['Status'] = false;
            this.response['Message'] = "Vui lòng xem lại chiều cao bắt buộc > 0";
            return this.response;
          }

          if (!obj.STOCK_DAYS) {
            this.response['Status'] = false;
            this.response['Message'] = "Vui lòng cung cấp số ngày tồn kho bắt buộc > 0";
            return this.response;
          }
          if (!obj.WEIGHT) {
            this.response['Status'] = false;
            this.response['Message'] = "Vui lòng cung cấp lại trọng lượng bắt buộc > 0";
            return this.response;
          }
          // ------- check exist customer type code --------
          let checkCode = await this.bsItemRepository.find({
            where: {
              ITEM_CODE: item.ITEM_CODE
            }
          });

          if (checkCode.length > 0) {
            this.response['Status'] = false;
            this.response['Message'] = "Mã hàng hoá đã tồn tại!";
            return this.response;
          }
          // -----------------------------------------------
          try {
            return await this.bsItemRepository.create(obj)
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
          if (item.ID === null) {
            this.response['Status'] = false;
            this.response['Message'] = "Vui lòng cung cấp lại số ID";
            return this.response;
          }
          if (item.UPDATE_BY === null) {
            this.response['Status'] = false;
            this.response['Message'] = "Vui lòng cung cấp lại tên người cập nhật";
            return this.response;
          }
          item.UPDATE_DATE = moment().format("YYYY-MM-DD HH:mm:ss");
          try {
            return await this.bsItemRepository.updateById(item.ID, item)
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

  //Thoilc(*Note)-Xoá hàng hoá
  @post('/bs-items/delete', spec)
  async delete(
    @requestBody.array(getModelSchemaRef(BS_ITEM)) bsItem: BS_ITEM[]
  ): Promise<any> {
    return Promise.all(bsItem.map(async item => {
      try {
        if (!item.ID) {
          this.response['Status'] = false;
          this.response['Message'] = "Vui lòng cung cấp lại số ID";
          return this.response;
        }
        return await this.bsItemRepository.deleteById(item.ID)
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
