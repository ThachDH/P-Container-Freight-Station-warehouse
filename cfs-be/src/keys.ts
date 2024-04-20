import {TokenService} from '@loopback/authentication';
import {BindingKey} from '@loopback/core';
import {env} from './env';

import {PasswordHasher} from './services/hash.password';
export namespace TokenServiceConstants {
  export const TOKEN_SECRET_VALUE = env.security.jwtSecret;
  export const TOKEN_EXPIRES_IN_VALUE = env.security.tokenExpires;
}

export namespace TokenServiceBindings {
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

export namespace PasswordHasherBindings {
  export const PASSWORD_HASHER =
    BindingKey.create<PasswordHasher>('services.hasher');
  export const ROUNDS = BindingKey.create<number>('services.hasher.rounds');
}



