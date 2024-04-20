import {
  AuthenticationBindings,
  AuthenticationMetadata
} from '@loopback/authentication';
import {
  Getter,
  globalInterceptor,
  inject,
  Interceptor,
  InvocationContext,
  InvocationResult,
  Provider,
  ValueOrPromise
} from '@loopback/context';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {UserProfile} from '@loopback/security';
import {intersection} from 'lodash';
import {SA_ACCESSRIGHTRepository} from '../repositories';
// import {GroupFunctionRepository} from '../repositories/group-function.repository';


/**
 * This class will be bound to the application as an `Interceptor` during
 * `boot`
 */
//Thoilc(*Note)-Kiểm tra thông tin user để lấy thông tin các trang được phân quyền
@globalInterceptor('', {tags: {name: 'authorize'}})
export class AuthorizeInterceptor implements Provider<Interceptor> {
  /*  */

  constructor(
    // @repository(GroupFunctionRepository)
    // public groupFunctionRepo: GroupFunctionRepository,
    @repository(SA_ACCESSRIGHTRepository)
    public accessRightsRepo: SA_ACCESSRIGHTRepository,
    @inject(AuthenticationBindings.METADATA)
    public metadata: AuthenticationMetadata,
    // dependency inject
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    public getCurrentUser: Getter<UserProfile>,
  ) { }

  /**
   * This method is used by LoopBack context to produce an interceptor function
   * for the binding.
   *
   * @returns An interceptor function
   */
  value() {
    return this.intercept.bind(this);
  }

  /**
   * The logic to intercept an invocation
   * @param invocationCtx - Invocation context
   * @param next - A function to invoke next interceptor or the target method
   */
  async intercept(
    invocationCtx: InvocationContext,
    next: () => ValueOrPromise<InvocationResult>,
  ) {
    try {
      // if you not provide options in your @authenticate decorator
      if (!this.metadata) return next();

      // const requriedPermissions = this.metadata.options as RequiredPermissions;

      // var requriedPermissions: RequiredPermissions = {
      //   required: [],
      // };
      const user = await this.getCurrentUser();
      let groupList: string[] = [];
      let metadatak: any = [];
      let valueOptions: any;
      let valuePage: any;
      let flag: any = false;
      if (Array.isArray(this.metadata)) {
        metadatak = this.metadata || [];
      }

      for (let i = 0; i < metadatak.length; i++) {
        const value = metadatak[i];
        if (value.options.required.length > 0) {
          for (let j = 0; j < value.options.required.length; j++) {
            valueOptions = value.options.required[j];
            valuePage = value.options.required[0];
            await this.accessRightsRepo.find({
              where: {GROUP_MENU_CODE: valuePage},
              fields: ['USER_GROUP_CODE']
            })
              .then(response => {
                response.map((item: any) => {
                  groupList.push(item.USER_GROUP_CODE);
                });
              })
              .catch(err => {
                throw new HttpErrors.Forbidden("INVALID GroupName " + err);
              });
            // console.log(foundGroup, " - ", groupList.length);
          }
        }
      }
      // user.permissions = ['QUANLY' as PermissionKeys];
      if (groupList.length === 0) groupList = ['INVALID_ACCESS_PERMISSION'];
      const results = intersection(
        user.permissions,
        groupList,
      ).length;

      let grpName = intersection(user.permissions, groupList);
      let temp = await this.accessRightsRepo.find({
        where: {
          and: [
            {USER_GROUP_CODE: String(grpName)},
            {GROUP_MENU_CODE: valuePage}
          ]
        }
      })
        .then((data: any) => {
          return data;
        })
        .catch(err => {
          throw new HttpErrors.Forbidden("NOT FIND DATA " + err);
        });

      await temp.map((item: any) => {
        Object.keys(item).map((_item: any) => {
          if (_item === valueOptions) {
            if (item[valueOptions] === true || item[valueOptions] === 1) {
              flag = true;
            } else {
              flag = false;
            }
          }
        });
      });

      if (flag === true) {
        if (!results) {
          throw new HttpErrors.Forbidden('INVALID_ACCESS_PERMISSION');
        }
        // Add pre-invocation logic here
        const result = await next();
        // Add post-invocation logic here
        return result;
      } else {
        throw new HttpErrors.Forbidden('INVALID_ACCESS_PERMISSION');
      }
    } catch (err) {
      // Add error handling logic here
      throw new HttpErrors.Forbidden('Error ' + err);
    }
  }
}
