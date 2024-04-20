
import {UserService} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {securityId, UserProfile} from '@loopback/security';
import {SA_USERS} from '../models/sa-users.model';
import {SA_ACCESSRIGHTRepository} from '../repositories/sa-accessright.repository';
import {SA_USERGROUPSRepository} from '../repositories/sa-usergroups.repository';
import {SA_Credentials, SA_USERSRepository} from '../repositories/sa-users.repository';
import {SA_PasswordHasherBindings} from '../sa-key';
import {BcryptHasher} from '../services/sa-hash.password';

//Thoilc(*Note)-Middeware check thông tin
export class SA_MyUserService implements UserService<SA_USERS, SA_Credentials> {
  constructor(
    @repository(SA_USERSRepository)
    public userRepository: SA_USERSRepository,
    @repository(SA_USERGROUPSRepository)
    public userrolesRepository: SA_USERGROUPSRepository,
    @repository(SA_ACCESSRIGHTRepository)
    public SA_ACCESSRIGHTRepository: SA_ACCESSRIGHTRepository,
    @inject(SA_PasswordHasherBindings.PASSWORD_HASHER)
    public hasher: BcryptHasher,
  ) { }

  convertToUserProfile(user: SA_USERS, permissions: string[] = []): UserProfile {
    return {
      [securityId]: user.USER_NAME!.toString(),
      USER_ID: user.Name,
      ID: user.ID,
      roles: user.USER_GROUP_CODE,
      permissions: permissions.concat(permissions),
    };
  }

  //Thoilc(*Note)-Kiểm tra chứng thực
  async verifyCredentials(credentials: SA_Credentials): Promise<SA_USERS> {
    const foundUser = await this.userRepository.findOne({
      where: {
        and: [
          {Name: credentials.Name},
          {IS_ACTIVE: {eq: true}}
        ]
      },
    });
    if (!foundUser) {
      throw new HttpErrors.NotFound('Đăng nhập không thành công!');
    }

    const passwordMatched = await this.hasher.comparePassword(
      credentials.Pass,
      String(foundUser.Pass),
    );

    if (!passwordMatched)
      throw new HttpErrors.Unauthorized('password is not valid');
    return foundUser;
  }

  //Thoilc(*Note)-Kiểm tra quyền dựa trên ds nhóm
  async verifyPermissions(groupUser: string): Promise<string[]> {
    // push permissions to user
    const foundPermissions = await this.userrolesRepository.find({
      where: {
        USER_GROUP_CODE: groupUser,
      },
    });

    let result: Array<string> = [];
    foundPermissions.forEach((item: any) => {
      if (item.USER_GROUP_CODE) result.push(item.USER_GROUP_CODE ?? '');
    });
    return result;
  }

  // //Thoilc(*Note)-Lấy dữ liệu thông tin nhóm thuộc user login
  async groupFunctionInfor(groupUser: string) {
    const foundGroup = await this.SA_ACCESSRIGHTRepository.find({
      where: {
        GROUP_MENU_CODE: groupUser
      }
    })
      .then((data: any) => {
        let _lst: any = [];
        data.map((item: any) => {
          _lst.push(item.MENU_CODE);
        })
        return _lst;
      });
    // console.log(foundGroup);
    return Promise.resolve(foundGroup);
  }

  // //Thoilc(*Note)-View thông tin phân quyền isAdd/isDelete/isUpdate/isInsert
  async viewGroupFunction(groupUser: string) {
    let foundPermission = await this.SA_ACCESSRIGHTRepository.find({
      where: {GROUP_MENU_CODE: groupUser}
    })
      .then((data: any) => {
        return data.map((item: any) => {
          let _obj: any = {};
          _obj['IS_VIEW'] = item.IS_VIEW;
          _obj['IS_MODIFY'] = item.IS_MODIFY;
          _obj['IS_DELETE'] = item.IS_DELETE;
          _obj['IS_ADD_NEW'] = item.IS_ADD_NEW;
          return _obj;
        });
      });
    return Promise.resolve(foundPermission);
  }
}
