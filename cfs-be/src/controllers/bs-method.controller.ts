import {JSONObject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {post, requestBody} from '@loopback/rest';
import moment from 'moment';
import {mapDataWithKey} from '../general';
import {BS_METHOD} from '../models';
import {BS_METHODRepository, CONFIG_ATTACH_SERVICERepository} from '../repositories';

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

export class BS_METHODController {
  constructor(
    @repository(BS_METHODRepository)
    public bsMethodRepository: BS_METHODRepository,
    @repository(CONFIG_ATTACH_SERVICERepository)
    public configService: CONFIG_ATTACH_SERVICERepository,
  ) { }

  public response: any = {
    Status: false,
    Payload: [],
    Message: ""
  };

  //ThachHD(*Note)-Hiển thị phương án
  @post('/bs-method/view', spec)
  async view(): Promise<BS_METHOD[]> {
    let arr: any = [];
    await this.bsMethodRepository.find({
      order: ['METHOD_CODE ASC']
    })
      .then((data: any) => {
        if (data.length) {
          data.map((item: any) => {
            let obj: any = {
              ID: item.ID,
              METHOD_CODE: item.METHOD_CODE,
              METHOD_NAME: item.METHOD_NAME,
              IS_IN_OUT: item.IS_IN_OUT === "I" ? "Vào" : "Ra",
              CLASS_CODE: item.CLASS_CODE === 1 ? "Nhập" : "Xuất",
              IS_SERVICE: item.IS_SERVICE === 1 ? true : false,
            };
            return arr.push(obj);
          });
        }
      });
    this.response['Payload'] = arr;
    this.response['Status'] = true;
    this.response['Message'] = 'Load dữ liệu thành công!'
    return this.response;
  }

  @post('/bs-method/get', spec)
  async get(
    @requestBody() bsMethod: BS_METHOD,
  ): Promise<any> {
    if (!(String(bsMethod.IS_IN_OUT).toUpperCase() === "I" || String(bsMethod.IS_IN_OUT).toUpperCase() === "O" || bsMethod.IS_IN_OUT === undefined)) {
      this.response['Status'] = false;
      this.response['Message'] = "Vui lòng cung cấp lại cổng!";
      return this.response;
    }
    if (!(bsMethod.CLASS_CODE === 1 || bsMethod.CLASS_CODE === 2)) {
      this.response['Status'] = false;
      this.response['Message'] = "Vui lòng cung cấp lại hướng!";
      return this.response;
    }
    let whereObj: any = {};
    bsMethod.IS_IN_OUT ? whereObj['IS_IN_OUT'] = bsMethod.IS_IN_OUT : '';
    whereObj['CLASS_CODE'] = bsMethod.CLASS_CODE;
    return await this.bsMethodRepository.find({
      where: {
        and: [
          whereObj,
          {IS_SERVICE: false}
        ]
      }
    })
      .then(data => {
        this.response['Status'] = true;
        this.response['Payload'] = data;
        this.response['Message'] = "Truy vấn dữ liệu thành công!";
        return this.response;
      })
      .catch(err => {
        this.response['Status'] = false;
        this.response['Payload'] = err;
        this.response['Message'] = err;
        return this.response;
      })
  }

  //ThachHD(*Note)-Xoá phương án
  @post('/bs-method/delete', spec)
  async delete(
    @requestBody() bsMethod: BS_METHOD[],
  ): Promise<any> {
    return Promise.all(bsMethod.map(async item => {
      if (!item.ID) {
        this.response['Status'] = false;
        this.response['Message'] = "Vui lòng cung cấp lại số ID!";
        return this.response;
      }
      try {
        return await this.bsMethodRepository.deleteById(item.ID)
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

  //ThachHD(*Note)-Cập nhật và thêm mới phương án
  @post('/bs-method/insertAndUpdate', spec)
  async insertAndUpdate(
    @requestBody() bsMethod: BS_METHOD[]
  ): Promise<any> {
    return Promise.all(bsMethod.map(async (item: any) => {
      switch (item.status) {
        case "insert":
          if (!item.METHOD_CODE) {
            this.response['Status'] = false;
            this.response['Message'] = 'Vui lòng cung cấp lại mã phương án!'
            return this.response;
          }
          if (!item.METHOD_NAME) {
            this.response['Status'] = false;
            this.response['Message'] = 'Vui lòng cung cấp lại tên phương án!'
            return this.response;
          }
          if (!(item.IS_IN_OUT.toUpperCase() === "VÀO" || item.IS_IN_OUT.toUpperCase() === "RA")) {
            this.response['Status'] = false;
            this.response['Message'] = "Vui lòng cung cấp lại cổng!";
            return this.response;
          }
          if (!(item.CLASS_CODE.toUpperCase() === "NHẬP" || item.CLASS_CODE.toUpperCase() === "XUẤT")) {
            this.response['Status'] = false;
            this.response['Message'] = "Vui lòng cung cấp lại hướng!";
            return this.response;
          }

          if (!item.CREATE_BY) {
            this.response['Status'] = false;
            this.response['Message'] = 'Vui lòng cung cấp lại tên người tạo!'
            return this.response;
          }
          // ------- check exist equipment type --------
          let checkCode = await this.bsMethodRepository.find({
            where: {
              METHOD_CODE: item.METHOD_CODE,
            }
          });
          if (checkCode.length > 0) {
            this.response['Status'] = false;
            this.response['Message'] = "Mã phương án đã tồn tại!";
            return this.response;
          }
          //--------------------------------------------
          let obj: any = {
            METHOD_CODE: item.METHOD_CODE,
            METHOD_NAME: item.METHOD_NAME,
            IS_IN_OUT: item.IS_IN_OUT.toUpperCase() === 'VÀO' ? 'I' : 'O',
            CLASS_CODE: item.CLASS_CODE.toUpperCase() === 'NHẬP' ? 1 : 2,
            IS_SERVICE: item.IS_SERVICE,
            CREATE_BY: item.CREATE_BY,
            CREATE_DATE: moment().format("YYYY-MM-DD HH:mm:ss"),
          }
          if (obj.IS_SERVICE >= 0 && obj.IS_SERVICE <= 1) {
            try {
              return await this.bsMethodRepository.create(obj)
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
          } else {
            this.response['Status'] = false;
            this.response['Message'] = "Dịch vụ đính kèm bạn cung cấp không đúng vui lòng xem lại!";
            return this.response;
          }
        case "update":
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
          item.IS_IN_OUT = item.IS_IN_OUT === 'Vào' ? 'I' : 'O';
          item.CLASS_CODE = item.CLASS_CODE === 'Nhập' ? 1 : 2;
          item.IS_SERVICE = item.IS_SERVICE;
          item.UPDATE_DATE = moment().format("YYYY-MM-DD HH:mm:ss");
          try {
            await this.bsMethodRepository.updateById(item.ID, item)
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

          if (!item.IS_SERVICE) {
            await this.configService.deleteAll({
              and: [
                {ATTACH_SERVICE_CODE: item.METHOD_CODE}
              ]
            }
            )
          }
          return this.response
        default:
          this.response['Status'] = false;
          this.response['Message'] = "Vui lòng cung cấp lại trạng thái!";
          return this.response;
      }
    })).then(() => {
      return this.response;
    });
  }

  //Hiển thị trạng thái phương án
  @post('/bs-method/viewStatus', spec)
  async viewStatus(): Promise<any> {
    let methodStatus: any = await this.bsMethodRepository.find({
      fields: ['METHOD_CODE', 'METHOD_NAME', 'IS_IN_OUT', 'CLASS_CODE', 'IS_SERVICE'],
      where: {IS_SERVICE: 1}
    });
    let methodIsStatus: any = await this.bsMethodRepository.find({
      fields: ['METHOD_CODE', 'METHOD_NAME', 'IS_IN_OUT', 'CLASS_CODE', 'IS_SERVICE'],
      where: {IS_SERVICE: 0}
    });
    return {
      Status: true,
      Payload: {methodStatus: methodStatus, methodIsStatus: methodIsStatus},
      Message: 'Load dữ liệu thành công!'
    };
  }


  //Hiển thị trạng thái phương án
  @post('/bs-method/viewPlan', spec)
  async viewTest(
    @requestBody() bsMethod: JSONObject
  ): Promise<any> {
    if (bsMethod.CUSTOMER_CODE === '*') {
      try {
        this.response['Payload'] = await this.bsMethodRepository.find({
          include: [
            {
              relation: 'configService',
              scope: {
                fields: ['CUSTOMER_CODE', 'METHOD_CODE', 'ATTACH_SERVICE_CODE']
              }
            }
          ],
        })
          .then((data: any) => data.map((p: any) => mapDataWithKey('method', p)));
        this.response['Status'] = true;
        this.response['Message'] = "Load dữ liệu thành công!";
      } catch {
        this.response['Status'] = false;
        this.response['Message'] = "Lỗi không thể load dữ liệu!";
      }
    } else {
      let arr: any = [];
      let isCheck = await this.configService.find({
        where: {CUSTOMER_CODE: String(bsMethod.CUSTOMER_CODE)}
      })
        .then((data: any) => data.length > 0 ? true : false);
      if (isCheck) {
        let dataAll: any = await this.bsMethodRepository.find({
          include: [
            {
              relation: 'configService',
              scope: {
                fields: ['CUSTOMER_CODE', 'METHOD_CODE', 'ATTACH_SERVICE_CODE']
              }
            }
          ],
        })
          .then((data: any) => data.map((p: any) => mapDataWithKey('method', p)));
        dataAll.map((item: any) => {
          item.method_configService?.filter((itm: any) => itm.CUSTOMER_CODE === bsMethod.CUSTOMER_CODE ? arr.push(item) : false);
        });
        this.response['Payload'] = arr;
        this.response['Status'] = true;
        this.response['Message'] = "Load dữ liệu thành công!";
      } else {
        this.response['Status'] = false;
        this.response['Message'] = "Đối tượng thanh toán không tồn tại!";
      }
    }
    return this.response;
  }


  @post('/bs-method/getAllServies', spec)
  async getService(
    @requestBody() method: BS_METHOD
  ): Promise<any> {
    if (!method.METHOD_CODE) {
      this.response['Status'] = false;
      this.response['Message'] = "Vui lòng cung cấp mã phương án!";
    }
    let servicesArr: any = await this.bsMethodRepository.find({
      include: [
        {
          relation: 'configService',
          // scope: {
          //   fields: ['ATTACH_SERVICE_CODE']
          // }
        }
      ],
      where: {
        METHOD_CODE: method.METHOD_CODE
      }
    })
      .then(data => {
        if (data) {
          return data[0].configService?.map(e => e.ATTACH_SERVICE_CODE)
        } else {
          this.response['Status'] = false;
          this.response['Message'] = "Không tìm thấy dịch vụ đính kèm!";
          return this.response;
        }
      })
      .catch(err => {
        this.response['Status'] = false;
        this.response['Message'] = err;
        return this.response;
      })
    await this.bsMethodRepository.find({
      where: {
        METHOD_CODE: {inq: servicesArr}
      }
    })
      .then(data => {
        this.response['Status'] = true;
        this.response['Payload'] = data;
        this.response['Message'] = "Truy vấn dữ liệu thành công!!!"
        return this.response
      })
      .catch(err => {
        this.response['Status'] = true;
        this.response['Payload'] = err;
        this.response['Message'] = "Truy vấn dữ liệu thất bại!!!";
        return this.response
      })
    return this.response
  }

}


