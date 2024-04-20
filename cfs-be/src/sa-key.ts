import {TokenService, UserService} from '@loopback/authentication';
import {BindingKey} from '@loopback/core';
import {env} from './env';
import { } from './models';
import {SA_USERS} from './models/sa-users.model';
import { } from './repositories';
import {SA_ACCESSRIGHTRepository} from './repositories/sa-accessright.repository';
import {SA_Credentials} from './repositories/sa-users.repository';
import {PasswordHasher} from './services/sa-hash.password';

export namespace SA_TokenServiceConstants {
  export const TOKEN_SECRET_VALUE = env.security.jwtSecret;
  export const TOKEN_EXPIRES_IN_VALUE = env.security.tokenExpires;
}

export namespace SA_TokenServiceBindings {
  export const TOKEN_SECRET = BindingKey.create<string>(
    'authentication.jwt.secret',
  );
  export const TOKEN_EXPIRES_IN = BindingKey.create<string>(
    'authentication.jwt.expiresIn',
  );
  export const TOKEN_SERVICE = BindingKey.create<TokenService>(
    'services.jwt.service',
  );
}

export namespace SA_PasswordHasherBindings {
  export const PASSWORD_HASHER =
    BindingKey.create<PasswordHasher>('services.hasher');
  export const ROUNDS = BindingKey.create<number>('services.hasher.rounds');
}

export namespace SA_UserServiceBindings {
  export const USER_SERVICE = BindingKey.create<
    UserService<SA_Credentials, SA_USERS>
  >('sa-services.user.service');
}

//Thoilc(*Note)-Thông tin group function
export namespace SA_GroupFunctionInfor {
  export const GROUP_FUNCTION = BindingKey.create<SA_ACCESSRIGHTRepository>('accessright.repository');
}


