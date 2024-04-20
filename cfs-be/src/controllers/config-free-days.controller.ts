import {repository} from '@loopback/repository';
import {post, requestBody} from '@loopback/rest';
import moment from 'moment';
import {CONFIG_FREE_DAYS} from '../models';
import {CONFIG_FREE_DAYSRepository, DtPackageStockRepository} from '../repositories';
const spec = {
  responses: {
    '200': {
      description: 'BS_METHOD list with filter',
      content: {
        'application/json': {
          schema: {},
        },
      },
    }
  }
}

export class CONFIG_FREE_DAYSController {
  constructor(
    @repository(CONFIG_FREE_DAYSRepository)
    public freeDaysRepo: CONFIG_FREE_DAYSRepository,
    @repository(DtPackageStockRepository)
    public packageStockRepo: DtPackageStockRepository
  ) { }

  public response: any = {
    Status: false,
    Payload: [],
    Message: ""
  };

  // API Load all Time-In from dt-package stock
  @post('/config-free-days/viewAllTimeIn', spec)
  async get(): Promise<any> {
    return await this.packageStockRepo.find({
      fields: ['TIME_IN']
    })
      .then(data => {
        this.response['Status'] = true;
        this.response['Payload'] = data;
        this.response['Message'] = "Truy vấn ngày thời gian nhập kho thành công!!"
        return this.response
      })
      .catch(err => {
        this.response['Status'] = false;
        this.response['Payload'] = err;
        this.response['Message'] = "Truy vấn ngày thời gian nhập kho thất bại!!"
        return this.response
      })
  }

  @post('/config-free-days/view', spec)
  async view(
    @requestBody() freeDays: CONFIG_FREE_DAYS,
  ): Promise<any> {
    if (!freeDays.NAME) {
      this.response['Status'] = false;
      this.response['Message'] = "Vui lòng cung cấp lại mẫu!!";
      return this.response;
    }
    return this.freeDaysRepo.find({
      include: [
        {
          relation: 'customerName',
          scope: {
            fields: ['CUSTOMER_NAME']
          }
        }
      ],
      where: {
        NAME: freeDays.NAME
      }
    })
      .then(data => {
        let arr: any = []
        data.map((item: any) => {
          let obj: any = {
            ID: item.ID,
            NAME: item.NAME,
            CUSTOMER_CODE: item.CUSTOMER_CODE,
            ITEM_TYPE_CODE: item.ITEM_TYPE_CODE,
            APPLY_DATE: item.APPLY_DATE,
            EXPIRE_DATE: item.EXPIRE_DATE,
            CLASS_CODE: item.CLASS_CODE,
            START_TIME: item.START_TIME,
            FREE_DAYS: item.FREE_DAYS,
            ACC_TYPE: item.ACC_TYPE,
            CREATE_BY: item.CREATE_BY,
            CREATE_DATE: item.CREATE_DATE,
            UPDATE_BY: item.UPDATE_BY,
            UPDATE_DATE: item.UPDATE_DATE,
            CUSTOMER_NAME: item.customerName ? item.customerName.CUSTOMER_NAME : '✶'
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

  @post('/config-free-days/delete', spec)
  async delete(
    @requestBody() freeDays: CONFIG_FREE_DAYS[],
  ): Promise<any> {
    return Promise.all(freeDays.map(async item => {
      if (!item.ID) {
        this.response['Status'] = false;
        this.response['Message'] = "Vui lòng cung cấp lại số ID!";
        return this.response;
      }
      try {
        return await this.freeDaysRepo.deleteById(item.ID)
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

  @post('/config-free-days/insertAndUpdate', spec)
  async insertAndUpdate(
    @requestBody() freeDays: CONFIG_FREE_DAYS[],
  ): Promise<any> {
    return Promise.all(freeDays.map(async (item: any) => {
      try {
        if (!item.CUSTOMER_CODE) {
          this.response['Status'] = false;
          this.response['Message'] = 'Vui lòng cung cấp lại mã khách hàng!'
          return this.response;
        }
        if (!item.ITEM_TYPE_CODE) {
          this.response['Status'] = false;
          this.response['Message'] = 'Vui lòng cung cấp lại mã loại hàng hóa!'
          return this.response;
        }
        if (!item.APPLY_DATE) {
          this.response['Status'] = false;
          this.response['Message'] = 'Vui lòng cung cấp lại thời gian áp dụng!'
          return this.response;
        }
        if (!item.EXPIRE_DATE) {
          this.response['Status'] = false;
          this.response['Message'] = 'Vui lòng cung cấp lại thời gian hết hạn!'
          return this.response;
        }
        if (!item.CLASS_CODE) {
          this.response['Status'] = false;
          this.response['Message'] = 'Vui lòng cung cấp lại hướng!'
          return this.response;
        }
        if (!item.START_TIME) {
          this.response['Status'] = false;
          this.response['Message'] = 'Vui lòng cung cấp lại môc thời gian tính miễn lưu!'
          return this.response;
        }
        if (!item.FREE_DAYS) {
          this.response['Status'] = false;
          this.response['Message'] = 'Vui lòng cung cấp lại số thời gian tính miễn lưu!'
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
          CUSTOMER_CODE: item.CUSTOMER_CODE,
          ITEM_TYPE_CODE: item.ITEM_TYPE_CODE,
          APPLY_DATE: item.APPLY_DATE,
          EXPIRE_DATE: item.EXPIRE_DATE,
          CLASS_CODE: item.CLASS_CODE,
          START_TIME: item.START_TIME,
          FREE_DAYS: item.FREE_DAYS,
          ACC_TYPE: item.ACC_TYPE,
          CREATE_BY: item.CREATE_BY,
          CREATE_DATE: moment().format("YYYY-MM-DD HH:mm:ss"),
          NAME: `${item.CUSTOMER_CODE}-${moment(item.APPLY_DATE).format('DD/MM/YYYY')}-${moment(item.EXPIRE_DATE).format('DD/MM/YYYY')}`
        }

        let checkName = await this.freeDaysRepo.find({
          where: {
            NAME: obj.NAME
          }
        })

        if (checkName.length) {
          return await this.freeDaysRepo.find({
            where: {
              and: [
                {CUSTOMER_CODE: obj.CUSTOMER_CODE},
                {CLASS_CODE: obj.CLASS_CODE},
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
                  return await this.freeDaysRepo.updateById(item.ID, obj)
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
                return await this.freeDaysRepo.create(obj)
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
        return await this.freeDaysRepo.create(obj)
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
  @post('/config-free-days/viewName', spec)
  async viewName(
    @requestBody() freeDays: CONFIG_FREE_DAYS,
  ): Promise<any> {
    return this.freeDaysRepo.execute(`
    select NAME from CONFIG_FREE_DAYS
    group by NAME
    `)
      .then(data => {
        this.response['Status'] = true;
        this.response['Payload'] = data;
        this.response['Message'] = "Truy vấn mẫu thành công!!"
        return this.response
      })
      .catch(err => {
        this.response['Status'] = false;
        this.response['Payload'] = err;
        this.response['Message'] = "Truy vấn mẫu thất bại!!"
        return this.response
      })
  }
}
