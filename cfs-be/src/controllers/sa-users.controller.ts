import {JWTService} from '@loopback/authentication-jwt';
import {inject, JSONObject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {post, requestBody} from '@loopback/rest';
import {SecurityBindings, UserProfile} from '@loopback/security';
import moment from 'moment';
import {SA_MyUserService} from '../middeware/sa-user-service';
import {SA_USERS} from '../models/sa-users.model';
import {SA_USERGROUPSRepository} from '../repositories/sa-usergroups.repository';
import {
  SA_Credentials,
  SA_USERSRepository
} from '../repositories/sa-users.repository';
import {
  SA_GroupFunctionInfor,
  SA_PasswordHasherBindings,
  SA_TokenServiceBindings,
  SA_UserServiceBindings
} from '../sa-key';
import {BcryptHasher} from '../services/sa-hash.password';

const _login = {
  responses: {
    '200': {
      description: 'Token',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              token: {
                type: 'string',
              },
            },
          },
        },
      },
    },
  },
};

const _signup = {
  responses: {
    '200': {
      description: 'User',
      content: {
        schema: {
          type: 'object',
          properties: {
            token: {
              type: 'string',
            },
          },
        },
      },
    },
  },
};

const spec = {
  responses: {
    '200': {
      description: 'Users list of filter',
      content: {
        'application/json': {
          schema: {},
        },
      },
    },
  },
};

export class SA_USERSController {
  constructor(
    @repository(SA_USERSRepository)
    public SA_USERSRepository: SA_USERSRepository,
    @inject(SA_PasswordHasherBindings.PASSWORD_HASHER)
    public hasher: BcryptHasher,
    @inject(SA_UserServiceBindings.USER_SERVICE)
    public userService: SA_MyUserService,
    @inject(SA_TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: JWTService,
    @inject(SecurityBindings.USER, {optional: true})
    public user: UserProfile,
    @inject(SA_GroupFunctionInfor.GROUP_FUNCTION)
    public groupFunc: SA_MyUserService,
    @repository(SA_USERGROUPSRepository)
    public SA_USERGROUPSRepository: SA_USERGROUPSRepository,
  ) { }

  public response: any = {
    Status: false,
    Payload: [],
    Message: '',
  };

  //Thoilc(*Note)-View dữ liệu người dùng
  @post('/sa-users/view', spec)
  // @authenticate({strategy: 'jwt', options: {required: ['frmNew_UsrManagement', 'IS_VIEW']}})
  async view(): Promise<any> {
    let User: any = await this.SA_USERSRepository.find({
      fields: [
        'ID',
        'Name',
        'USER_NUMBER',
        'USER_NAME',
        'BIRTHDAY',
        'ADDRESS',
        'TELPHONE',
        'EMAIL',
        'USER_GROUP_CODE',
        'USER_GROUP_NAME',
        'IS_ACTIVE',
        'REMARK',
      ],
    });

    let GroupUser: any = await this.SA_USERGROUPSRepository.find({
      fields: [
        'ID',
        'USER_GROUP_CODE',
        'USER_GROUP_NAME',
        'USER_GROUP_RANK',
        'APP_CODE',
      ],
    });

    return {
      Status: true,
      Payload: {User: User, GroupUser: GroupUser},
      Message: 'Load dữ liệu thành công!',
    };
  }

  @post('/sa-users/getUser', spec)
  async getUser(@requestBody() userGroup: JSONObject): Promise<any> {
    let whereObj: any = {};
    userGroup.IS_ACTIVE === 'all'
      ? ''
      : (whereObj['IS_ACTIVE'] = userGroup.IS_ACTIVE);
    (userGroup.USER_GROUP_CODE === '' || !userGroup.USER_GROUP_CODE) ? '' : whereObj['USER_GROUP_CODE'] = userGroup.USER_GROUP_CODE;
    return await this.SA_USERSRepository.find({
      fields: [
        'ID',
        'Name',
        'USER_NAME',
        'ADDRESS',
        'TELPHONE',
        'EMAIL',
        'USER_GROUP_CODE',
        'USER_GROUP_NAME',
        'IS_ACTIVE',
      ],
      where: whereObj,
    })
      .then((data: any) => {
        if (data.length) {
          this.response['Status'] = true;
          this.response['Payload'] = data;
          this.response['Message'] = 'Load dữ liệu thành công!';
          return this.response;
        } else {
          this.response['Status'] = false;
          this.response['Payload'] = [];
          this.response['Message'] = 'Không tìm thấy dữ liệu!';
          return this.response;
        }
      })
      .catch((err: any) => {
        this.response['Status'] = false;
        this.response['Payload'] = [];
        this.response['Message'] =
          'Phát sinh lỗi! Vui lòng liên hệ bộ phận kỹ thuật!';
        return this.response;
      });
  }

  //Thoilc(*Note)-Đăng nhập
  @post('/sa-users/login', _login)
  async login(
    @requestBody() credentials: SA_Credentials,
  ): Promise<{token: string}> {
    let userData = await this.userService.verifyCredentials(credentials);
    let Permissions = await this.userService.verifyPermissions(
      userData.USER_GROUP_CODE ?? '',
    );
    let userProfile = await this.userService.convertToUserProfile(
      userData,
      Permissions ?? [],
    );
    const token = await this.jwtService.generateToken(userProfile);
    return Promise.resolve({
      token: token,
      USER_NAME: userData.USER_NAME
    });
  }

  //Thoilc(*Note)-Đăng ký tài khoản
  //Trong vòng map nếu có async - await ko thể push dữ liệu vào được
  @post('/sa-users/signupAndUpdate', _signup)
  // @authenticate({strategy: 'jwt', options: {required: ['frmNew_UsrManagement', 'IS_ADD_NEW']}})
  async signup(
    @requestBody() userData: SA_USERS[]
  ): Promise<any> {
    return Promise.all(userData.map(async (item: any) => {
      switch (item.status) {
        case 'insert':
          if (!item.Name) {
            this.response['Status'] = false;
            this.response['Message'] = "Vui lòng cung cấp lại tên người dùng";
            return this.response;
          }
          if (!item.Pass) {
            this.response['Status'] = false;
            this.response['Message'] = "Vui lòng cung cấp lại mật khẩu";
            return this.response;
          }
          if (!item.USER_NAME) {
            this.response['Status'] = false;
            this.response['Message'] = "Vui lòng cung cấp lại họ tên người dùng";
            return this.response;
          }
          if (!item.USER_GROUP_CODE) {
            this.response['Status'] = false;
            this.response['Message'] = "Vui lòng cung cấp lại mã nhóm người dùng";
            return this.response;
          }
          if (!item.CREATE_BY) {
            this.response['Status'] = false;
            this.response['Message'] = "Vui lòng cung cấp lại tên người dùng";
            return this.response;
          }
          let checkCode: any = await this.SA_USERSRepository.find({
            where: {Name: item.Name.toUpperCase()}
          });
          if (!checkCode.length) {
            let obj: any = {
              Name: item.Name.toUpperCase(),
              USER_NAME: item.USER_NAME,
              // USER_NUMBER: item.USER_NUMBER,
              Pass: (await this.hasher.hashPassword(String(item.Pass))).toUpperCase(),
              // BIRTHDAY: item.BIRTHDAY,
              ADDRESS: item.ADDRESS,
              TELPHONE: item.TELPHONE,
              EMAIL: item.EMAIL,
              USER_GROUP_CODE: item.USER_GROUP_CODE,
              // USER_GROUP_NAME: item.USER_GROUP_NAME,
              IS_ACTIVE: item.IS_ACTIVE ? 1 : 0,
              // REMARK: item.REMARK,
              CREATE_BY: item.CREATE_BY,
              CREATE_DATE: moment().format("YYYY-MM-DD HH:mm:ss"),
            };
            try {
              return await this.SA_USERSRepository.create(obj)
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
          } else {
            this.response['Status'] = false;
            this.response['Message'] = "Người dùng đã được tạo trước đó, vui lòng kiểm tra lại!";
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
          let objUpdate: any = {
            ID: item.ID,
            USER_NAME: item.USER_NAME,
            USER_GROUP_CODE: item.USER_GROUP_CODE,
            // Pass: (await this.hasher.hashPassword(String(item.Pass))).toUpperCase(),
            // USER_NUMBER: item.USER_NUMBER,
            // BIRTHDAY: moment(item.BIRTHDAY, 'DD/MM/YYYY[T]HH:mm').format('YYYY-MM-DD HH:mm:ss'),
            ADDRESS: item.ADDRESS,
            TELPHONE: item.TELPHONE,
            EMAIL: item.EMAIL,
            IS_ACTIVE: item.IS_ACTIVE ? 1 : 0,
            // REMARK: item.REMARK,
            UPDATE_BY: item.UPDATE_BY,
            UPDATE_DATE: moment().format("YYYY-MM-DD HH:mm:ss")
          };
          item.Name ? objUpdate['Name'] = item.Name : '';
          item.Pass ? objUpdate['Pass'] = (await this.hasher.hashPassword(String(item.Pass))).toUpperCase() : '';
          item.UPDATE_DATE = moment().format("YYYY-MM-DD HH:mm:ss");
          try {
            return await this.SA_USERSRepository.updateById(objUpdate.ID, objUpdate)
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

  //Thoilc(*Note)-Xoá dữ liệu người dùng
  @post('/sa-users/delete', spec)
  // @authenticate({strategy: 'jwt', options: {required: ['frmNew_UsrManagement', 'IS_DELETE']}})
  async delete(@requestBody() userData: SA_USERS[]): Promise<any> {
    return Promise.all(
      userData.map(async item => {
        try {
          if (!item.ID) {
            this.response['Status'] = false;
            this.response['Message'] = 'Vui lòng cung cấp lại id!';
            return this.response;
          }
          if (item.IS_ACTIVE) {
            this.response['Status'] = false;
            this.response['Message'] = 'Người dùng đang sử dụng!';
            return this.response;
          }
          if (!item.USER_GROUP_CODE) {
            this.response['Status'] = false;
            this.response['Message'] = 'Vui lòng cung cấp lại nhóm tài khoản!';
            return this.response;
          }
          if (item.IS_ACTIVE === false) {
            let GrpRank = await this.SA_USERGROUPSRepository.find({
              where: {USER_GROUP_CODE: item.USER_GROUP_CODE},
            }).then((data: any) => data.map((itm: any) => itm.USER_GROUP_RANK));
            if (GrpRank) {
              return await this.SA_USERSRepository.deleteById(
                Number(item.ID),
              ).then(() => {
                this.response['Status'] = true;
                this.response['Message'] = 'Xóa dữ liệu thành công!';
                return this.response;
              });
            } else {
              this.response['Status'] = false;
              this.response['Message'] =
                'Hiện tại bạn không thuộc quyền quản trị!';
              return this.response;
            }
          }
        } catch {
          this.response['Status'] = false;
          this.response['Message'] = 'Xóa dữ liệu không thành công!';
          return this.response;
        }
      }),
    ).then(() => {
      return this.response;
    });
  }

  //Thoilc(*Note)-Thay đổi mật khẩu
  @post('/sa-users/updatePwd', spec)
  async registry(
    @requestBody() usr: JSONObject,
  ): Promise<any> {
    let Name = usr.Name ? usr.Name : null;
    let PassOld = usr.PassOld ? usr.PassOld : null;
    let PassNew = usr.PassNew ? usr.PassNew : null;

    if (!Name) {
      return {Status: false, message: 'Vui lòng thử lại do chưa cung cấp tên đăng nhập'};
    }

    if (!PassNew) {
      return {Status: false, message: 'Vui lòng cung cấp mật khẩu mới'};
    }
    const foundUser = await this.SA_USERSRepository.findOne({
      where: {
        Name: String(usr.Name),
      }
    });

    if (!foundUser) {
      return {Status: false, message: 'Không tìm thấy người dùng'};
    }

    const passwordMatched = await this.hasher.comparePassword(String(PassOld), foundUser.Pass);
    if (!passwordMatched) {
      return {Status: false, message: 'Mật khẩu cũ hiện tại không đúng'};
    }

    PassNew = await (
      await this.hasher.hashPassword(String(PassNew))
    ).toUpperCase();

    if (passwordMatched) {
      return await this.SA_USERSRepository.updateById(foundUser.ID, {Pass: PassNew})
        .then(() => {
          return {Status: true, message: 'Thay đổi mật khẩu thành công'};
        })
        .catch(err => {
          return {Status: false, message: 'Lỗi không thể thay đổi mật khẩu, vui lòng thử lại lần nữa' + err};
        });
    }
  }
}
