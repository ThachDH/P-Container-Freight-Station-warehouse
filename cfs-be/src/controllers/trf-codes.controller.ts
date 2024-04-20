import {JSONObject} from '@loopback/core';
import {
  repository
} from '@loopback/repository';
import {
  getModelSchemaRef,
  HttpErrors,
  post, requestBody
} from '@loopback/rest';
import moment from 'moment';
import {TRF_CODES} from '../models';
import {TrfCodesRepository} from '../repositories';

const spec = {
  responses: {
    '200': {
      description: 'TRF_CODES list with filter',
      content: {
        'application/json': {
          schema: {},
        },
      },
    }
  }
}

export class TrfCodesController {
  constructor(
    @repository(TrfCodesRepository)
    public trfCodesRepository: TrfCodesRepository,
  ) { }

  public response: any = {
    Status: false,
    Payload: [],
    Message: ""
  };

  //Thoilc(*Note)-Hiển thị biểu cước
  @post('/trf-codes/view', spec)
  async view(): Promise<TRF_CODES[]> {
    return this.trfCodesRepository.find();
  }

  //Thoilc(*Note)-Hiển thị biểu cước Code
  @post('/trf-codes/viewCode', spec)
  async viewCode(): Promise<TRF_CODES[]> {
    return this.trfCodesRepository.find({
      fields: ['TRF_CODE', 'TRF_DESC']
    });
  }

  //Thoilc(*Note)-Cập nhật và thêm mới biểu cước
  @post('/trf-codes/insertAndUpdate', spec)
  async insertAndUpdate(
    @requestBody() trfCode: JSONObject[],
  ): Promise<any> {
    return Promise.all(trfCode.map(async (item: any) => {
      switch (item.status) {
        case 'insert':
          if (!item.TRF_CODE) {
            this.response['Status'] = false;
            this.response['Message'] = "Vui lòng cung cấp lại mã biểu cước";
            return this.response;
          }
          if (!item.TRF_DESC) {
            this.response['Status'] = false;
            this.response['Message'] = "Vui lòng cung cấp lại diễn giải";
            return this.response;
          }
          if (!item.INV_UNIT) {
            this.response['Status'] = false;
            this.response['Message'] = "Vui lòng cung cấp lại đơn vị tính";
            return this.response;
          }
          if (!(item.VAT_CHK === 0 || item.VAT_CHK === 1)) {
            this.response['Status'] = false;
            this.response['Message'] = "Vui lòng cung cấp lại thuế";
            return this.response;
          }
          if (!item.CREATE_BY) {
            this.response['Status'] = false;
            this.response['Message'] = "Vui lòng cung cấp lại tên người tạo";
            return this.response;
          }

          let obj: any = {
            TRF_CODE: item.TRF_CODE,
            TRF_DESC: item.TRF_DESC,
            INV_UNIT: item.INV_UNIT,
            REVENUE_ACC: item.REVENUE_ACC,
            VAT_CHK: item.VAT_CHK,
            CREATE_BY: item.CREATE_BY,
            CREATE_DATE: moment().format("YYYY-MM-DD hh:mm:ss")
          };
          // ------- check exist customer type code --------
          let checkCode = await this.trfCodesRepository.find({
            where: {
              TRF_CODE: item.TRF_CODE
            }
          });
          if (checkCode.length > 0) {
            this.response['Status'] = false;
            this.response['Message'] = "Mã biểu cước đã tồn tại!";
            return this.response;
          }
          // -----------------------------------------------
          try {
            return await this.trfCodesRepository.create(obj)
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
          item.UPDATE_DATE = moment().format("YYYY-MM-DD hh:mm:ss");
          try {
            return await this.trfCodesRepository.updateById(item.ID, item)
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

  //Thoilc(*Note)-Xoá biểu cước
  @post('/trf-codes/delete', spec)
  async delete(
    @requestBody.array(getModelSchemaRef(TRF_CODES)) trfCode: TRF_CODES[],
  ): Promise<any> {
    return Promise.all(trfCode.map(async item => {
      try {
        if (!item.ID) {
          this.response['Status'] = false;
          this.response['Message'] = "Vui lòng cung cấp lại số ID";
          return this.response;
        }
        return await this.trfCodesRepository.deleteById(item.ID)
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
