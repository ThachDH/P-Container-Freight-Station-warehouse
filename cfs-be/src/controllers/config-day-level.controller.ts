
import {repository} from '@loopback/repository';
import {post, requestBody} from '@loopback/rest';
import moment from 'moment';
import {CONFIG_DAY_LEVEL} from '../models';
import {CONFIG_DAY_LEVELRepository} from '../repositories';
const spec = {
  responses: {
    '200': {
      description: 'BS_GATE detail list of filter',
      content: {
        'application/json': {
          schema: {},
        }
      }
    }
  }
}

export class ConfigDayLevelController {
  constructor(
    @repository(CONFIG_DAY_LEVELRepository)
    public CONFIG_DAY_LEVELRepo: CONFIG_DAY_LEVELRepository,
  ) { }
  public response: any = {
    Status: false,
    Payload: [],
    Message: ""
  };

  @post('/config-day-level/viewName', spec)
  async viewName(): Promise<any> {
    return this.CONFIG_DAY_LEVELRepo.find({
      fields: ['NAME'],
      order: ['CREATE_DATE DESC']

    })
      .then(data => {
        if (data.length) {
          let temp: any = data.map(e => e.NAME);
          temp = [...new Set(temp)];
          temp = temp.map((e: any) => {
            return {NAME: e}
          })
          this.response['Status'] = true;
          this.response['Payload'] = temp;
          this.response['Message'] = 'Truy vấn dữ liệu thành công!';
          return this.response;
        } else {
          this.response['Status'] = false;
          this.response['Payload'] = [];
          this.response['Status'] = 'Không tìm thấy dữ liệu!';
          return this.response;
        }
      })
      .catch(err => {
        this.response['Status'] = false;
        this.response['Payload'] = err;
        this.response['Status'] = 'Phát sinh lỗi! Vui lòng liên hệ bộ phận kĩ thuật!';
        return this.response;
      })
  }


  @post('/config-day-level/view', spec)
  async view(
    @requestBody() dataReq: CONFIG_DAY_LEVEL
  ): Promise<any> {
    if (!dataReq.NAME) {
      this.response['Status'] = false;
      this.response['Message'] = "Vui lòng cung cấp lại mẫu!!";
      return this.response;
    }
    return this.CONFIG_DAY_LEVELRepo.find({
      include: [
        {
          relation: 'customerName',
          scope: {
            fields: ['CUSTOMER_NAME']
          }
        }
      ],
      where: {
        NAME: dataReq.NAME
      }
    })
      .then(data => {
        let arr: any = []
        data.map((item: any) => {
          let obj: any = {
            ID: item.ID,
            NAME: item.NAME,
            TRF_CODE: item.TRF_CODE,
            TRF_DESC: item.TRF_DESC,
            DAY_LEVEL: item.DAY_LEVEL,
            CLASS_CODE: item.CLASS_CODE,
            CUSTOMER_CODE: item.CUSTOMER_CODE,
            CUSTOMER_NAME: item.customerName?.CUSTOMER_NAME,
            METHOD_CODE: item.METHOD_CODE,
            ITEM_TYPE_CODE: item.ITEM_TYPE_CODE,
            CURRENCY_CODE: item.CURRENCY_CODE,
            AMT_RT: item.AMT_RT,
            VAT: item.VAT,
            INCLUDE_VAT: item.INCLUDE_VAT,
            FROM_DATE: item.FROM_DATE,
            TO_DATE: item.TO_DATE,
            ACC_TYPE: item.ACC_TYPE,
            CREATE_BY: item.CREATE_BY,
            CREATE_DATE: item.CREATE_DATE,
            UPDATE_BY: item.UPDATE_BY,
            UPDATE_DATE: item.UPDATE_DATE,
          }
          return arr.push(obj)
        })
        this.response['Status'] = true;
        this.response['Payload'] = arr;
        this.response['Message'] = "Truy vấn dữ liệu thành công!!"
        return this.response
      })
      .catch(err => {
        this.response['Status'] = false;
        this.response['Payload'] = err;
        this.response['Message'] = "Truy vấn ngày thời gian nhập kho thất bại!!"
        return this.response
      })
  }

  @post('/config-day-level/delete', spec)
  async delete(
    @requestBody() freeDays: CONFIG_DAY_LEVEL[],
  ): Promise<any> {
    return Promise.all(freeDays.map(async item => {
      if (!item.ID) {
        this.response['Status'] = false;
        this.response['Message'] = "Vui lòng cung cấp lại số ID!";
        return this.response;
      }
      try {
        return await this.CONFIG_DAY_LEVELRepo.deleteById(item.ID)
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
    });
  }

  @post('/config-day-level/insertAndUpdate', spec)
  async insertAndUpdate(
    @requestBody() freeDays: CONFIG_DAY_LEVEL[],
  ): Promise<any> {
    return Promise.all(freeDays.map(async (item: any) => {
      try {
        if (!item.TRF_CODE) {
          this.response['Status'] = false;
          this.response['Message'] = 'Vui lòng cung cấp lại mã biểu cước!'
          return this.response;
        }
        if (!item.TRF_DESC) {
          this.response['Status'] = false;
          this.response['Message'] = 'Vui lòng cung cấp lại diễn giải!'
          return this.response;
        }
        if (!(item.CLASS_CODE === "1" || item.CLASS_CODE === "2" || item.CLASS_CODE === '✶')) {
          this.response['Status'] = false;
          this.response['Message'] = "Vui lòng cung cấp hướng";
          return this.response;
        }
        if (!item.CUSTOMER_CODE) {
          this.response['Status'] = false;
          this.response['Message'] = 'Vui lòng cung cấp lại mã khách hàng!'
          return this.response;
        }
        if (!item.METHOD_CODE) {
          this.response['Status'] = false;
          this.response['Message'] = 'Vui lòng cung cấp lại phương án!'
          return this.response;
        }
        if (!item.ITEM_TYPE_CODE) {
          this.response['Status'] = false;
          this.response['Message'] = 'Vui lòng cung cấp lại loại hàng hóa!'
          return this.response;
        }
        if (!item.CURRENCY_CODE) {
          this.response['Status'] = false;
          this.response['Message'] = 'Vui lòng cung cấp lại loại tiền!'
          return this.response;
        }
        if (!item.FROM_DATE) {
          this.response['Status'] = false;
          this.response['Message'] = "Vui lòng cung cấp từ ngày";
          return this.response;
        }
        if (!item.TO_DATE) {
          this.response['Status'] = false;
          this.response['Message'] = "Vui lòng cung cấp đến ngày";
          return this.response;
        }
        if (!item.ACC_TYPE) {
          this.response['Status'] = false;
          this.response['Message'] = 'Vui lòng cung cấp lại loại thanh toán(CAS or CRE)!'
          return this.response;
        }
        if (!item.CREATE_BY) {
          this.response['Status'] = false;
          this.response['Message'] = 'Vui lòng cung cấp lại tên người tạo!'
          return this.response;
        }

        let obj: any = {
          TRF_CODE: item.TRF_CODE,
          TRF_DESC: item.TRF_DESC,
          DAY_LEVEL: item.DAY_LEVEL,
          CLASS_CODE: item.CLASS_CODE,
          CUSTOMER_CODE: item.CUSTOMER_CODE,
          METHOD_CODE: item.METHOD_CODE,
          ITEM_TYPE_CODE: item.ITEM_TYPE_CODE,
          CURRENCY_CODE: item.CURRENCY_CODE,
          AMT_RT: item.AMT_RT,
          VAT: item.VAT,
          INCLUDE_VAT: item.INCLUDE_VAT,
          FROM_DATE: item.FROM_DATE,
          TO_DATE: item.TO_DATE,
          ACC_TYPE: item.ACC_TYPE,
          CREATE_BY: item.CREATE_BY,
          CREATE_DATE: item.CREATE_DATE,
          UPDATE_BY: item.UPDATE_BY,
          UPDATE_DATE: item.UPDATE_DATE,
          NAME: item.FROM_DATE + '-' + item.TO_DATE + '-' + item.CUSTOMER_CODE,
        }

        let checkName = await this.CONFIG_DAY_LEVELRepo.find({
          where: {
            NAME: obj.NAME
          }
        })

        if (checkName.length) {
          return await this.CONFIG_DAY_LEVELRepo.find({
            where: {
              and: [
                {TRF_CODE: obj.TRF_CODE},
                {CLASS_CODE: obj.CLASS_CODE},
                {METHOD_CODE: obj.METHOD_CODE},
                {ITEM_TYPE_CODE: obj.ITEM_TYPE_CODE}
              ]
            }
          })
            .then(async (data: any) => {
              if (data.length) {
                return Promise.all(await data.map(async (itm1: any) => {
                  obj.ACC_TYPE = item.ACC_TYPE;
                  obj.UPDATE_BY = item.CREATE_BY;
                  obj.UPDATE_DATE = moment().format("YYYY-MM-DD HH:mm:ss");
                  return await this.CONFIG_DAY_LEVELRepo.updateById(item.ID, obj)
                    .then(() => {
                      this.response['Status'] = true;
                      this.response['Payload'].push(itm1);
                      this.response['Message'] = "Lưu dữ liệu thành công!";
                      return this.response;
                    });
                }));
              } else {
                obj.CREATE_BY = item.CREATE_BY;
                obj.CREATE_DATE = moment().format("YYYY-MM-DD HH:mm:ss");
                return await this.CONFIG_DAY_LEVELRepo.create(obj)
                  .then((data: any) => {
                    this.response['Status'] = true;
                    this.response['Payload'].push(data);
                    this.response['Message'] = "Lưu dữ liệu thành công!";
                    return this.response;
                  });
              }
            });

        }
        obj.CREATE_BY = item.CREATE_BY;
        obj.CREATE_DATE = moment().format("YYYY-MM-DD HH:mm:ss");
        return await this.CONFIG_DAY_LEVELRepo.create(obj)
          .then((data: any) => {
            this.response['Status'] = true;
            this.response['Payload'].push(data);
            this.response['Message'] = "Lưu dữ liệu thành công!";
            return this.response;
          });
      } catch (err) {
        this.response['Status'] = false;
        this.response['Payload'] = err
        this.response['Message'] = "Không thể lưu mới dữ liệu!";
        return this.response;
      }
    })).then(() => {
      return this.response;
    });
  }

}
