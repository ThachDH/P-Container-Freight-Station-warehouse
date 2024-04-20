import {JSONObject} from '@loopback/core';
import {
  repository
} from '@loopback/repository';
import {post, requestBody} from '@loopback/rest';
import moment from 'moment';
import { SA_MENURepository } from '../repositories/sa-menu.repository';
import {SA_ACCESSRIGHTRepository} from '../repositories/sa-accessright.repository';

const spec = {
  responses: {
    '200': {
      description: 'AccessRight list with filter',
      content: {
        'application/json': {
          schema: {},
        }
      }
    }
  }
}

export class SA_ACCESSRIGHTController {
  constructor(
    @repository(SA_ACCESSRIGHTRepository)
    public SA_ACCESSRIGHTRepository: SA_ACCESSRIGHTRepository,
    @repository(SA_MENURepository)
    public SA_MENURepository: SA_MENURepository,
  ) { }

  public response: any = {
    Status: false,
    Payload: [],
    Message: ""
  };

  //Thoilc(*Note)-View ds phân quyền
  @post('/sa-accessrights/view', spec)
  // @authenticate({strategy: 'jwt', options: {required: ['frmNew_UsrManagement', 'IS_VIEW']}})
  async view(
    @requestBody() accessRights: JSONObject
  ): Promise<any> {
    this.response['Payload'] = await this.SA_ACCESSRIGHTRepository.find({
      fields: ['USER_GROUP_CODE', 'GROUP_MENU_CODE', 'GROUP_MENU_NAME', 'MENU_CODE', 'MENU_NAME', 'IS_VIEW', 'IS_ADD_NEW', 'IS_MODIFY', 'IS_DELETE'],
      where: {
        USER_GROUP_CODE: String(accessRights.USER_GROUP_CODE)
      },
    });
    this.response['Message'] = "Load dữ liệu thành công!";
    this.response['Status'] = true;
    return this.response;
  }

  //Thoilc(*Note)-Insert and Update
  @post('/sa-accessrights/insertAndUpdate', spec)
  // @authenticate({strategy: 'jwt', options: {required: ['frmNew_UsrManagement', 'IS_ADD_NEW']}})
  async createInUp(
    @requestBody()
    accessRights: JSONObject[],
  ): Promise<any> {
    return Promise.all(accessRights.map(async (item: any) => {
      let GROUP_MENU_NAME: any = await this.SA_MENURepository.findOne({
        where: {PARENT_CODE: item.PARENT_CODE}
      })
        .then((dt: any) => dt.MENU_NAME);

      await this.SA_ACCESSRIGHTRepository.find({
        where: {
          and: [
            {USER_GROUP_CODE: item.USER_GROUP_CODE},
            {MENU_CODE: item.MENU_CODE},
          ]
        }
      })
        .then(async (data: any) => {
          if (data.length) {
            try {
              let ID: any = data.map((p: any) => p.ID);
              item.UPDATE_BY = item.CREATE_BY;
              item.UPDATE_DATE = moment().format("YYYY-MM-DD HH:mm:ss");
              let obj: any = {
                ID: ID,
                MENU_NAME: item.MENU_NAME,
                IS_VIEW: item.IS_VIEW ? 1 : 0,
                IS_MODIFY: item.IS_MODIFY ? 1 : 0,
                IS_DELETE: item.IS_DELETE ? 1 : 0,
                IS_ADD_NEW: item.IS_ADD_NEW ? 1 : 0,
                UPDATE_BY: item.CREATE_BY,
                UPDATE_DATE: moment().format("YYYY-MM-DD HH:mm:ss")
              };
              return await this.SA_ACCESSRIGHTRepository.updateById(obj.ID, obj)
                .then(() => {
                  this.response['Status'] = true;
                  this.response['Message'] = "Lưu dữ liệu thành công!";
                  return this.response;
                });
            } catch {
              this.response['Status'] = false;
              this.response['Message'] = "Không thể lưu mới dữ liệu!";
              return this.response;
            }
          } else {
            if (!item.USER_GROUP_CODE) {
              this.response['Status'] = false;
              this.response['Message'] = "Vui lòng cung cấp lại mã nhóm tài khoản";
              return this.response;
            }
            if (!item.MENU_CODE) {
              this.response['Status'] = false;
              this.response['Message'] = "Vui lòng cung cấp lại mã danh mục";
              return this.response;
            }
            if (!item.CREATE_BY) {
              this.response['Status'] = false;
              this.response['Message'] = "Vui lòng cung cấp lại tên người dùng";
              return this.response;
            }
            // ------- check exist gate code --------
            let checkCode = await this.SA_ACCESSRIGHTRepository.find({
              where: {
                and: [
                  {MENU_CODE: item.MENU_CODE},
                  {USER_GROUP_CODE: item.USER_GROUP_CODE}
                ]
              }
            });
            if (checkCode.length > 0) {
              this.response['Status'] = false;
              this.response['Message'] = "Mã danh mục đã tồn tại!";
              return this.response;
            }
            let obj: any = {
              USER_GROUP_CODE: item.USER_GROUP_CODE,
              GROUP_MENU_CODE: item.PARENT_CODE ? item.PARENT_CODE : item.MENU_CODE,
              GROUP_MENU_NAME: GROUP_MENU_NAME ? item.MENU_NAME : GROUP_MENU_NAME,
              MENU_CODE: item.MENU_CODE,
              MENU_NAME: item.MENU_NAME ? item.MENU_NAME : null,
              IS_VIEW: item.IS_VIEW ? 1 : 0,
              IS_ADD_NEW: item.IS_ADD_NEW ? 1 : 0,
              IS_MODIFY: item.IS_MODIFY ? 1 : 0,
              IS_DELETE: item.IS_DELETE ? 1 : 0,
              CREATE_BY: item.CREATE_BY,
              CREATE_DATE: moment().format("YYYY-MM-DD HH:mm:ss"),
            };
            try {
              return await this.SA_ACCESSRIGHTRepository.create(obj)
                .then((itm: any) => {
                  this.response['Status'] = true;
                  this.response['Payload'].push(itm);
                  this.response['Message'] = "Lưu dữ liệu thành công!";
                  return this.response;
                });
            } catch {
              this.response['Status'] = false;
              this.response['Message'] = "Không thể lưu mới dữ liệu!";
              return this.response;
            }
          }
        });
    }))
      .then(() => {
        return this.response;
      });
  }
}
