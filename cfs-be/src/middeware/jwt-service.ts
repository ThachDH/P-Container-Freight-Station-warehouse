import {inject} from '@loopback/core';
import {HttpErrors} from '@loopback/rest';
import {securityId, UserProfile} from '@loopback/security';
import {promisify} from 'util';
import {TokenServiceBindings} from '../keys';
const jwt = require('jsonwebtoken');
const signAsync = promisify(jwt.sign);
const verifyAsync = promisify(jwt.verify);

//Thoilc(*Note)-Dịch vụ liên kết với JWTStrategy để xác minh JWT
export class JWTService implements JWTService {
  // @inject('authentication.jwt.secret')
  @inject(TokenServiceBindings.TOKEN_SECRET)
  public readonly jwtSecret: string;

  @inject(TokenServiceBindings.TOKEN_EXPIRES_IN)
  public readonly expiresSecret: string;

  async generateToken(userProfile: UserProfile): Promise<string> {
    if (!userProfile) {
      throw new HttpErrors.Unauthorized(
        'Error while generating token :userProfile is null',
      );
    }

    let token: string;
    try {
      token = await signAsync(userProfile, this.jwtSecret, {
        expiresIn: this.expiresSecret,
      });
    } catch (err) {
      throw new HttpErrors.Unauthorized(`error generating token ${err}`);
    }
    return token;
  }

  //Thoilc(*Note)-Kiểm tra token hợp lệ theo userProfile
  async verifyToken(token: string): Promise<UserProfile> {
    if (!token) {
      throw new HttpErrors.Unauthorized(
        `Error verifying token:'token' is null`,
      );
    }

    let userProfile: UserProfile;
    try {
      //Thoilc(*Note)-Decode token của user
      const decryptedToken = await verifyAsync(token, this.jwtSecret);
      userProfile = Object.assign(
        // {[securityId]: '', id: '', name: '', roles: '', permissions: [], grpFunction: [], grpPermission: [{}]},
        {[securityId]: '', id: '', name: '', roles: '', permissions: []},
        {
          [securityId]: decryptedToken.id,
          id: decryptedToken.id,
          name: decryptedToken.name,
          roles: decryptedToken.roles,
          permissions: decryptedToken.permissions,
          // grpFunction: decryptedToken.grpFunction,
          // grpPermission: decryptedToken.grpPermission,
        },
      );
    } catch (err) {
      throw new HttpErrors.Unauthorized(`Error verifying token:${err.message}`);
    }
    return userProfile;
  }
}
