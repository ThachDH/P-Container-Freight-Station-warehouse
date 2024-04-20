import {HttpErrors} from '@loopback/rest';
import {SA_Credentials} from '../repositories/sa-users.repository';

export function validateCredentials(credentials: SA_Credentials) {
  //Check validate
  if (credentials.Name.length == 0) {
    throw new HttpErrors.UnprocessableEntity('invalid UserID');
  }

  if (credentials.Pass.length < 1) {
    throw new HttpErrors.UnprocessableEntity(
      'password length should be greater than 1',
    );
  }
}
