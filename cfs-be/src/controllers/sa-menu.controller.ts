import {JSONObject} from '@loopback/core';
import {
  repository
} from '@loopback/repository';
import {post, requestBody} from '@loopback/rest';
import moment from 'moment';
import {SA_MENU} from '../models/sa-menu.model';
import { SA_ACCESSRIGHTRepository } from '../repositories/sa-accessright.repository';
import {SA_MENURepository} from '../repositories/sa-menu.repository';

const spec = {
  responses: {
    '200': {
      description: 'Menu list with filter',
      content: {
        'application/json': {
          schema: {},
        }
      }
    }
  }
}

export class SA_MENUController {
  constructor(
    @repository(SA_MENURepository)
    public SA_MENURepository: SA_MENURepository,
    @repository(SA_ACCESSRIGHTRepository)
    public SA_ACCESSRIGHTRepository: SA_ACCESSRIGHTRepository,
  ) { }

  public response: any = {
    Status: false,
    Payload: [],
    Message: ""
  };

  // //Thoilc(*Note)-View ds phân quyền
  // @post('/sa-menus/viewMenu', spec)
  // // @authenticate({strategy: 'jwt', options: {required: ['frmUser', 'IsView']}})
  // async viewThree(): Promise<SA_MENU[]> {
  //   this.response['Payload'] = await this.SA_MENURepository.find({
  //     fields: ['PARENT_CODE', 'MENU_CODE', 'MENU_NAME', 'IS_VISIBLE', 'ORDER_BY']
  //   });
  //   this.response['Status'] = true;
  //   return this.response;
  // }

  //Thoilc(*Note)-View dữ liệu menu
  @post('/sa-menus/view', spec)
  async view(
    @requestBody() menus: JSONObject
  ): Promise<any> {
    let accRights: any = await this.SA_ACCESSRIGHTRepository.find({
      where: {
        and: [
          {
            USER_GROUP_CODE: String(menus.USER_GROUP_CODE)
          },
          {
            IS_VIEW: true
          },
        ]
      }
    });

    let lstMenu: any = await this.SA_MENURepository.find({
      where: {
        IS_VISIBLE: true
      }
    });

    let arr: any = [];
    lstMenu.map((itmMenu: any) => {
      accRights.map((itmAccRight: any) => {
        if (itmMenu.MENU_CODE === itmAccRight.MENU_CODE) {
          return arr.push(itmMenu);
        }
      });
    });

    let arrHeaderMenu: any = [];
    await this.SA_MENURepository.find({
    })
      .then((data: any) => data.map((itm: any) => !itm.PARENT_CODE ? arrHeaderMenu.push(itm) : []));
    let dataAll: any = arrHeaderMenu.concat(arr);
    this.response['Payload'] = dataAll;
    this.response['Status'] = true;
    this.response['Message'] = "Load dữ liệu thành công!";
    return this.response;
  }

  @post('/sa-menus/viewTest', spec)
  async viewTest(
    @requestBody() menus: JSONObject
  ): Promise<any> {
    let accRights: any = await this.SA_ACCESSRIGHTRepository.find({
      where: {
        and: [
          {
            USER_GROUP_CODE: String(menus.USER_GROUP_CODE)
          },
          {
            IS_VIEW: true
          },
        ]
      }
    });

    let lstMenu: any = await this.SA_MENURepository.find({
      where: {
        IS_VISIBLE: true
      }
    });

    let arr: any = [];
    lstMenu.map((itmMenu: any) => {
      accRights.map((itmAccRight: any) => {
        if (itmMenu.MENU_CODE === itmAccRight.MENU_CODE) {
          return arr.push(itmMenu);
        }
      });
    });

    let arrHeaderMenu: any = [];
    await this.SA_MENURepository.find({
    })
      .then((data: any) => data.map((itm: any) => !itm.PARENT_CODE ? arrHeaderMenu.push(itm) : []));

    let dataAll: any = arrHeaderMenu.concat(arr);
    return dataAll;
  }

  //Thoilc(*Note)-View dữ liệu menu theo ParrentID
  @post('/sa-menus/viewParentID', spec)
  async viewParrentID(): Promise<any> {
    let arrParent: any = [];
    await this.SA_MENURepository.find({
      fields: ['MENU_CODE', 'MENU_NAME', 'PARENT_CODE']
    })
      .then((data: any) => data.map((item: any) => !item.PARENT_CODE ? arrParent.push(item) : ''));
    this.response['Payload'] = arrParent;
    this.response['Status'] = true;
    return this.response;
  }

  //Thoilc(*Note)-Xoá dữ liệu menu
  @post('/sa-menus/delete', spec)
  // @authenticate({strategy: 'jwt', options: {required: ['frmMenuManage', 'IsDelete']}})
  async delete(
    @requestBody() menus: JSONObject[]
  ): Promise<any> {
    return Promise.all(menus.map(async (item: any) => {
      if (!item.ID) {
        this.response['Status'] = false;
        this.response['Message'] = "Vui lòng cung cấp lại số ID!";
        return this.response;
      }
      try {
        let isCheck = await this.SA_MENURepository.find({
          where: {ID: item.ID}
        })
          .then((data: any) => {
            return data.map(async (itm: any) => {
              return await this.SA_MENURepository.find({
                where: {PARENT_CODE: itm.MENU_CODE}
              })
                .then((subData: any) => {
                  if (subData.length > 0) {
                    return true;
                  }
                  return false;
                })
            });
          });
        if (!isCheck) {
          return await this.SA_MENURepository.deleteById(item.ID)
            .then(() => {
              this.response['Status'] = true;
              this.response['Message'] = "Xóa dữ liệu thành công!";
              return this.response;
            })
        } else {
          this.response['Status'] = false;
          this.response['Message'] = "Hiện tại danh mục menu con nằm trong menu cha!";
          return this.response;
        }
      } catch {
        this.response['Status'] = false;
        this.response['Message'] = "Xóa dữ liệu không thành công!";
      }
    })).then((value) => {
      return this.response;
    })
  }

  //Thoilc(*Note)-Cập nhật dữ liệu menu
  @post('/sa-menus/updateInfor', spec)
  // @authenticate({strategy: 'jwt', options: {required: ['frmNew_UsrManagement', 'IS_MODIFY']}})
  async update(
    @requestBody() menu: JSONObject
  ): Promise<any> {
    try {
      if (!menu.ID) {
        this.response['Status'] = false;
        this.response['Message'] = "Vui lòng cung cấp lại ID!";
        return this.response;
      }
      return await this.SA_MENURepository.updateById(Number(menu.ID), menu)
        .then(() => {
          this.response['Status'] = true;
          this.response['Payload'] = menu;
          this.response['Message'] = "Lưu dữ liệu thành công!";
          return this.response;
        });
    } catch {
      this.response['Status'] = false;
      this.response['Message'] = "Cập nhật không thành công!";
      return this.response;
    }
  }

  //Thoilc(*Note)-Thêm dữ liệu menu
  @post('/sa-menus/insert', spec)
  // @authenticate({strategy: 'jwt', options: {required: ['frmNew_UsrManagement', 'IS_ADD_NEW']}})
  async create(
    @requestBody() menu: JSONObject
  ): Promise<SA_MENU> {
    this.response['Payload'] = await this.SA_MENURepository.create(menu)
      .then(data => {
        return data;
      });
    this.response['Status'] = true;
    this.response['Message'] = "Lưu dữ liệu thành công!";
    return this.response;
  }

  //Thoilc(*Note)-Thêm mới dữ liệu menu
  @post('/sa-menus/insertAndUpdate', spec)
  async insertAndUpdate(
    @requestBody() menus: JSONObject[],
  ): Promise<any> {
    return Promise.all(menus.map(async (item: any) => {
      switch (item.status) {
        case 'insert':
          if (!item.MENU_CODE) {
            this.response['Status'] = false;
            this.response['Message'] = "Vui lòng cung cấp lại mã danh mục";
            return this.response;
          }
          if (!item.MENU_NAME) {
            this.response['Status'] = false;
            this.response['Message'] = "Vui lòng cung cấp lại tên danh mục";
            return this.response;
          }
          if (!item.VIEW_CLASS) {
            this.response['Status'] = false;
            this.response['Message'] = "Vui lòng cung cấp lại class component";
            return this.response;
          }
          if (!item.VIEW_PAGE) {
            this.response['Status'] = false;
            this.response['Message'] = "Vui lòng cung cấp lại tên trang";
            return this.response;
          }
          if (!item.ORDER_BY) {
            this.response['Status'] = false;
            this.response['Message'] = "Vui lòng cung cấp lại số thứ tự danh mục";
            return this.response;
          }
          if (!item.CREATE_BY) {
            this.response['Status'] = false;
            this.response['Message'] = "Vui lòng cung cấp lại tên người tạo";
            return this.response;
          }

          let obj: any = {
            GROUP_MENU_CODE: item.GROUP_MENU_CODE,
            GROUP_MENU_NAME: item.GROUP_MENU_NAME,
            PARENT_CODE: item.PARENT_CODE,
            MENU_CODE: item.MENU_CODE,
            MENU_NAME: item.MENU_NAME,
            MENU_ICON: item.MENU_ICON,
            VIEW_CLASS: item.VIEW_CLASS,
            VIEW_PAGE: item.VIEW_PAGE,
            IS_VISIBLE: item.IS_VISIBLE ? 1 : 0,
            ORDER_BY: item.ORDER_BY,
            CREATE_BY: item.CREATE_BY,
            CREATE_DATE: moment().format("YYYY-MM-DD hh:mm:ss")
          };
          // ------- check exist customer type code --------
          let checkCode = await this.SA_MENURepository.find({
            where: {
              MENU_CODE: String(item.MENU_CODE)
            }
          });

          if (checkCode.length > 0) {
            this.response['Status'] = false;
            this.response['Message'] = "Mã danh mục đã tồn tại!";
            return this.response;
          }
          // -----------------------------------------------
          try {
            return await this.SA_MENURepository.create(obj)
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
            return await this.SA_MENURepository.updateById(Number(item.ID), item)
              .then(() => {
                this.response['Status'] = true;
                this.response['Payload'].push(menus);
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
    })).then(() => {
      return this.response;
    });
  }

  @post('/sa-menus/viewMenu', spec)
  async viewMenu(): Promise<SA_MENU[]> {
    this.response['Payload'] = await this.SA_MENURepository.find({
      order: ['ORDER_BY']
    })
      .then(data => {
        return data;
      });
    this.response['Status'] = true;
    this.response['Message'] = "Lưu dữ liệu thành công!";
    return this.response;
  }
}
