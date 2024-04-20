import {JSONObject} from '@loopback/core';
import {
  repository
} from '@loopback/repository';
import {post, requestBody} from '@loopback/rest';
import moment from 'moment';
import {API_TOSRepository} from '../repositories';

const spec = {
  responses: {
    '200': {
      description: 'DT_VESSEL_VISIT list of filter',
      content: {
        'application/json': {
          schema: {},
        }
      }
    }
  }
}
export class ApiTosController {
  constructor(
    @repository(API_TOSRepository)
    public API_TOSRepo: API_TOSRepository,
  ) { }
  public response: any = {
    Status: false,
    Payload: [],
    Message: ""
  };

  @post('/api-tos/view', spec)
  async view(
    @requestBody() dataReq: JSONObject
  ): Promise<any> {
    if (!dataReq.FROM_DATE || !dataReq.TO_DATE) {
      this.response['Status'] = false;
      this.response['Message'] = `Vui lòng gửi từ ngày đến ngày!`
      return this.response;
    }
    let whereObj: any = {}
    let FROM_DATE = dataReq._from ? moment(String(dataReq.FROM_DATE)).utcOffset(-8).format('YYYY-MM-DD HH:mm:ss') : '';
    let TO_DATE = dataReq._to ? moment(String(dataReq.TO_DATE)).utcOffset(12).format('YYYY-MM-DD HH:mm:ss') : '';
    FROM_DATE && TO_DATE ? whereObj['CREATE_TIME'] = {
      between: [FROM_DATE, TO_DATE]
    } : '';
    dataReq.MES_STATUS === false || dataReq.MES_STATUS === true ? whereObj['MES_STATUS'] = dataReq.MES_STATUS : '';
    dataReq.FUNCTION_PATCH ? whereObj['FUNCTION_PATCH'] = dataReq.FUNCTION_PATCH : '';
    return await this.API_TOSRepo.find({
      where: whereObj
    })
      .then(data => {
        if (data.length) {
          this.response['Status'] = true;
          this.response['Payload'] = data;
          this.response['Message'] = "Nạp dữ liệu thành công!";
          return this.response;
        } else {
          this.response['Status'] = false;
          this.response['Payload'] = [];
          this.response['Message'] = "Không có dữ liệu cần tìm!";
          return this.response;
        }
      })
      .catch(err => {
        this.response['Status'] = false;
        this.response['Payload'] = err;
        this.response['Message'] = "Phát sinh lỗi! Vui lòng liên hệ bộ phận kĩ thuật!";
        return this.response;
      })
  }
}
