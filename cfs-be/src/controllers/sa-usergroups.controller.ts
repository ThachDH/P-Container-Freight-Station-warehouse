import {JSONObject} from '@loopback/core';
import {
  repository
} from '@loopback/repository';
import {post, requestBody} from '@loopback/rest';
import moment from 'moment';
import {SA_USERGROUPS} from '../models/sa-usergroups.model';
import {SA_USERGROUPSRepository} from '../repositories/sa-usergroups.repository';

const spec = {
  responses: {
    '200': {
      description: 'Group user list of filter',
      content: {
        'application/json': {
          schema: {},
        }
      }
    }
  }
}
export class SA_USERGROUPSController {
  constructor(
    @repository(SA_USERGROUPSRepository)
    public SA_USERGROUPSRepository: SA_USERGROUPSRepository,
  ) { }

  public response: any = {
    Status: false,
    Payload: [],
    Message: ""
  };

  //Thoilc(*Note)-Thêm dữ liệu nhóm người dùng
  @post('/sa-usergroups/insertAndUpdate', spec)
  // @authenticate({strategy: 'jwt', options: {required: ['frmNew_UsrManagement', 'IS_ADD_NEW']}})
  async create(
    @requestBody() grpUser: SA_USERGROUPS[],
  ): Promise<any> {
    return Promise.all(grpUser.map(async (item: any) => {
      switch (item.status) {
        case 'insert':
          if (!item.USER_GROUP_CODE) {
            this.response['Status'] = false;
            this.response['Message'] = "Vui lòng cung cấp lại mã người dùng";
            return this.response;
          }
          if (!item.USER_GROUP_RANK) {
            this.response['Status'] = false;
            this.response['Message'] = "Vui lòng cung cấp lại phân cấp nhóm";
            return this.response;
          }
          if (!item.CREATE_BY) {
            this.response['Status'] = false;
            this.response['Message'] = "Vui lòng cung cấp lại tên người dùng";
            return this.response;
          }
          let obj: any = {
            USER_GROUP_CODE: item.USER_GROUP_CODE,
            USER_GROUP_NAME: item.USER_GROUP_NAME,
            USER_GROUP_RANK: item.USER_GROUP_RANK > 0 ? item.USER_GROUP_RANK : 0,
            APP_CODE: item.APP_CODE,
            CREATE_BY: item.CREATE_BY,
            CREATE_DATE: moment().format("YYYY-MM-DD HH:mm:ss"),
          };
          try {
            return await this.SA_USERGROUPSRepository.create(obj)
              .then((data: any) => {
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
            this.response['Message'] = 'Vui lòng cung cấp lại số ID!';
            return this.response
          }
          if (!item.UPDATE_BY) {
            this.response['Status'] = false;
            this.response['Message'] = 'Vui lòng cung cấp lại tên người cập nhật!';
            return this.response
          }
          item.UPDATE_DATE = moment().format("YYYY-MM-DD HH:mm:ss");
          try {
            return await this.SA_USERGROUPSRepository.updateById(item.ID, item)
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
          this.response['Status'] = false;
          this.response['Message'] = "Vui lòng cung cấp lại trạng thái!";
          return this.response;
      }
    }))
      .then(() => {
        return this.response;
      });
  }

  //Thoilc(*Note)-Hiển thị nhóm người dùng
  @post('/sa-usergroups/view', spec)
  // @authenticate({strategy: 'jwt', options: {required: ['frmNew_UsrManagement', 'IS_VIEW']}})
  async view(): Promise<SA_USERGROUPS[]> {
    this.response['Payload'] = await this.SA_USERGROUPSRepository.find({
      fields: ["ID", "USER_GROUP_CODE", "USER_GROUP_NAME", "USER_GROUP_RANK", "APP_CODE"]
    });
    this.response['Status'] = true;
    return this.response;
  }

  //Thoilc(*Note)-Hiển thị nhóm người dùng theo rank
  @post('/sa-usergroups/getItem', spec)
  // @authenticate({strategy: 'jwt', options: {required: ['frmNew_UsrManagement', 'IS_VIEW']}})
  async getItem(
    @requestBody() userGroup: JSONObject
  ): Promise<SA_USERGROUPS[]> {
    if (!userGroup.USER_GROUP_CODE) {
      this.response['Status'] = false;
      this.response['Message'] = "Vui lòng cung cấp lại mã nhóm!";
      return this.response;
    }
    let rank = await this.SA_USERGROUPSRepository.find({where: {USER_GROUP_CODE: String(userGroup.USER_GROUP_CODE)}}).then((data: any) => data[0].USER_GROUP_RANK);

    this.response['Payload'] = await this.SA_USERGROUPSRepository.find({
      fields: ["ID", "USER_GROUP_CODE", "USER_GROUP_NAME", "USER_GROUP_RANK", "APP_CODE"],
      where: {USER_GROUP_RANK: {gte: rank}}
    });
    this.response['Status'] = true;
    return this.response;
  }

  //Thoilc(*Note)-Xoá nhóm người dùng
  @post('/sa-usergroups/delete', spec)
  // @authenticate({strategy: 'jwt', options: {required: ['frmNew_UsrManagement', 'IS_DELETE']}})
  async delete(
    @requestBody() grpUsers: SA_USERGROUPS[],
  ): Promise<any> {
    return Promise.all(grpUsers.map(async (item: any) => {
      try {
        if (!item.ID) {
          this.response['Status'] = false;
          this.response['Message'] = "Vui lòng cung cấp lại id!";
          return this.response;
        }
        return await this.SA_USERGROUPSRepository.deleteById(item.ID)
          .then(() => {
            this.response['Status'] = true;
            this.response['Message'] = "Xóa dữ liệu thành công!";
            return this.response;
          });
      } catch {
        this.response['Status'] = false;
        this.response['Message'] = "Xóa dữ liệu không thành công!";
        return this.response;
      }
    }))
      .then(() => {
        return this.response;
      });
  }
}
