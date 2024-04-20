import {JSONObject} from '@loopback/core';
import {
  repository
} from '@loopback/repository';
import {post, requestBody} from '@loopback/rest';
import moment from 'moment';
import {CONFIG_ATTACH_SERVICERepository} from '../repositories';

const spec = {
  responses: {
    '200': {
      description: 'CONFIG_ATTACH_SERVICE detail list of filter',
      content: {
        'application/json': {
          schema: {},
        }
      }
    }
  }
}

export class CONFIG_ATTACH_SERVICEController {
  constructor(
    @repository(CONFIG_ATTACH_SERVICERepository)
    public configServiceRepository: CONFIG_ATTACH_SERVICERepository,
  ) { }

  public response: any = {
    Status: false,
    Payload: [],
    Message: ""
  };

  @post('/config-attach-services/view', spec)
  async view(
    @requestBody() dataSend: String
  ): Promise<any> {
    let arr: any = [];
    await this.configServiceRepository.find({
      where: {CUSTOMER_CODE: String(dataSend)}
    })
      .then((data: any) => {
        if (data.length > 0) {
          data.map((item: any) => {
            let obj: any = {
              ID: item.ID,
              VOYAGEKEY: item.VOYAGEKEY,
              CUSTOMER_CODE: item.CUSTOMER_CODE,
              METHOD_CODE: item.METHOD_CODE,
              ATTACH_SERVICE_CODE: item.ATTACH_SERVICE_CODE,
            };
            return arr.push(obj);
          });
          this.response['Payload'] = arr;
          this.response['Status'] = true;
          this.response['Message'] = 'Load dữ liệu thành công!'
        } else {
          this.response['Payload'] = [];
          this.response['Status'] = false;
          this.response['Message'] = 'Không có dữ liệu!'
        }
      });
    return this.response;
  }

  //Thoilc(*Note)-Thêm mới và cập nhật dịch vụ đính kèm
  @post('/config-attach-services/saveData', spec)
  async createUpdate(
    @requestBody() configService: JSONObject[]
  ): Promise<any> {
    return Promise.all(configService.map(async (item: any) => {
      switch (item.status) {
        case "insert":
          if (!item.CREATE_BY) {
            this.response['Status'] = false;
            this.response['Message'] = "Vui lòng cung cấp lại tên người tạo";
            return this.response;
          }
          let obj: any = {
            VOYAGEKEY: item.VOYAGEKEY,
            CUSTOMER_CODE: item.CUSTOMER_CODE ? item.CUSTOMER_CODE : '*',
            METHOD_CODE: item.METHOD_CODE,
            ATTACH_SERVICE_CODE: item.ATTACH_SERVICE_CODE,
            CREATE_BY: item.CREATE_BY,
            CREATE_DATE: moment().format("YYYY-MM-DD HH:mm:ss"),
          };
          try {
            return await this.configServiceRepository.create(obj)
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
        case "delete":
          try {
            if (!item.CUSTOMER_CODE) {
              this.response['Status'] = false;
              this.response['Message'] = "Vui lòng cung cấp lại đối tượng thanh toán";
              return this.response;
            }
            if (!item.METHOD_CODE) {
              this.response['Status'] = false;
              this.response['Message'] = "Vui lòng cung cấp lại mã phương án";
              return this.response;
            }
            if (!item.ATTACH_SERVICE_CODE) {
              this.response['Status'] = false;
              this.response['Message'] = "Vui lòng cung cấp lại mã dịch vụ";
              return this.response;
            }
            return await this.configServiceRepository.deleteAll({
              CUSTOMER_CODE: item.CUSTOMER_CODE,
              METHOD_CODE: item.METHOD_CODE,
              ATTACH_SERVICE_CODE: item.ATTACH_SERVICE_CODE
            })
              .then(() => {
                this.response['Status'] = true;
                this.response['Message'] = "Xóa dữ liệu thành công!";
                return this.response;
              });
          } catch {
            this.response['Status'] = false;
            this.response['Message'] = "Xóa dữ liệu không thành công!";
          }
        default:
          this.response['Status'] = false;
          this.response['Message'] = "Hiện tại không tìm thấy trạng thái thao tác!";
      }
    }))
      .then(() => {
        return this.response;
      });
  }
}
