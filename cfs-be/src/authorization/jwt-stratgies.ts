import {AuthenticationBindings, AuthenticationMetadata, AuthenticationStrategy} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {HttpErrors, RedirectRoute} from '@loopback/rest';
import {UserProfile} from '@loopback/security';
import {Request} from 'express';
import {ParamsDictionary} from 'express-serve-static-core';
import {ParsedQs} from 'qs';
import {TokenServiceBindings} from '../keys';
import {JWTService} from '../middeware/jwt-service';

//Thoilc(*Note)-Chiến lược xác thực
export class JWTStrategy implements AuthenticationStrategy {
  name = 'jwt';
  @inject(TokenServiceBindings.TOKEN_SERVICE)
  public jwtService: JWTService;
  @inject(AuthenticationBindings.METADATA)
  public metadata: AuthenticationMetadata;

  //Thoilc(*Note)-Kiểm tra token hợp lệ và trả về thông tin user
  async authenticate(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    request: Request<ParamsDictionary, any, any, ParsedQs>,
  ): Promise<UserProfile | RedirectRoute | undefined> {
    const token: string = this.extractCredentials(request);
    try {
      const userProfile = await this.jwtService.verifyToken(token);
      // console.log(request);
      // console.log(userProfile);
      return Promise.resolve(userProfile);
    } catch (err) {
      Object.assign(err, {code: 'INVALID_ACCESS_TOKEN', statusCode: 401, });
      throw err;
    }
  }

  extractCredentials(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    request: Request<ParamsDictionary, any, any, ParsedQs>,
  ): string {
    if (!request.headers.authorization) {
      throw new HttpErrors.Unauthorized('Authorization is missing');
    }
    const authHeaderValue = request.headers.authorization;

    // authorization : Bearer xxxx.yyyy.zzzz
    if (!authHeaderValue.startsWith('Bearer')) {
      throw new HttpErrors.Unauthorized(
        'Authorization header is not type of Bearer',
      );
    }
    const parts = authHeaderValue.split(' ');
    if (parts.length !== 2) {
      throw new HttpErrors.Unauthorized(
        `Authorization header has too many part is must follow this patter 'Bearer xx.yy.zz`,
      );
    }
    const token = parts[1];
    return token;
  }
}
