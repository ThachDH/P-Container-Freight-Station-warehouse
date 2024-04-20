import {JSONObject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {post, requestBody} from '@loopback/rest';
import moment from 'moment';
import {BS_WAREHOUSE} from '../models/bs-warehouse.model';
import {BS_WareHouseRepository} from '../repositories/bs-warehouse.repository';

const spec = {
  responses: {
    '200': {
      description: 'BS_WAREHOUSE detail list of filter',
      content: {
        'application/json': {
          schema: {},
        }
      }
    }
  }
}

export class BsWareHouseController {
  constructor(
    @repository(BS_WareHouseRepository)
    public bsWareHouseRepository: BS_WareHouseRepository,
  ) {
  }
  public response: any = {
    Status: false,
    Payload: [],
    Message: ""
  };

  //ThachHD(*Note)- view dữ liệu dm loại khách hàng
  @post('/bs-warehouse/view', spec)
  async view(
    @requestBody() dataReq: JSONObject
  ): Promise<BS_WAREHOUSE[]> {
    this.response['Status'] = true;
    this.response['Payload'] = await this.bsWareHouseRepository.find({
      fields: ["ID", "WAREHOUSE_CODE", "WAREHOUSE_NAME", "ACREAGE"]
    });
    return this.response;
  }

  // ThạchHD(*note) - Xóa dữ liệu loại khách hàng
  @post('/bs-warehouse/delete', spec)
  async delete(
    @requestBody() wareHouse: BS_WAREHOUSE[],
  ): Promise<any> {
    return Promise.all(wareHouse.map(async item => {
      let ID: any = item.ID ? item.ID : null;
      try {
        return await this.bsWareHouseRepository.deleteById(ID)
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

  //ThachHD(*Note)-thêm và chỉnh sửa dữ liệu loại khách hàng
  @post('/bs-warehouse/saveData', spec)
  async insertAndUpdate(
    @requestBody() json: JSONObject[],
  ): Promise<any> {
    return Promise.all(json.map(async (item: any) => {
      let status = item.status ? item.status : undefined;
      let ID: any = item.ID ? item.ID : null;
      let WAREHOUSE_CODE: any = item.WAREHOUSE_CODE ?? null;
      let ACREAGE: any = item.ACREAGE ?? null;
      switch (status) {
        case 'insert':
          let obj: any = {
            WAREHOUSE_CODE: WAREHOUSE_CODE,
            WAREHOUSE_NAME: item.WAREHOUSE_NAME ? item.WAREHOUSE_NAME : null,
            ACREAGE: ACREAGE,
            CREATE_BY: item.CREATE_BY ? item.CREATE_BY : null,
            CREATE_DATE: moment().format("YYYY-MM-DD hh:mm:ss")
          };

          if (WAREHOUSE_CODE === null) {
            this.response['Status'] = false;
            this.response['Message'] = "Vui lòng nhập mã kho!";
            return this.response;
          }
          // ------- check exist customer type code --------
          let checkCode = await this.bsWareHouseRepository.find({
            where: {
              WAREHOUSE_CODE: WAREHOUSE_CODE
            }
          });

          if (checkCode.length > 0) {
            this.response['Status'] = false;
            this.response['Message'] = "Mã kho đã tồn tại!";
            return this.response;
          }

          // -----------------------------------------------

          try {
            return await this.bsWareHouseRepository.create(obj)
              .then(data => {
                this.response['Status'] = true;
                this.response['Payload'].push(data);
                this.response['Message'] = "Lưu dữ liệu thành công!";
                return this.response;
              })
          } catch (err) {
            this.response['Status'] = false;
            this.response['Payload'] = err;
            this.response['Message'] = "Không thể lưu mới dữ liệu!";
          }

        case 'update':
          item.UPDATE_DATE = moment().format("YYYY-MM-DD hh:mm:ss");
          try {
            return await this.bsWareHouseRepository.updateById(ID, item)
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
          return {Status: false, Payload: item.status, message: 'Không tìm thấy trạng thái'};
      }
    }
    )).then(returnValue => {
      return this.response;
    });
  }
}
