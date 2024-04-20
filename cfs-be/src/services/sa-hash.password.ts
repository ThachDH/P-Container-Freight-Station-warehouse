import {inject} from '@loopback/core';
import {genSalt} from 'bcryptjs';
import {Md5} from 'md5-typescript';
import {SA_PasswordHasherBindings} from '../sa-key';

export interface PasswordHasher<T = string> {
  hashPassword(password: T): Promise<T>;
  comparePassword(provdedPass: T, storedPass: T): Promise<boolean>;
}

export class BcryptHasher implements PasswordHasher<string> {
  async comparePassword(
    provdedPass: string,
    storedPass: string,
  ): Promise<boolean> {
    let provdedPassHash = EncrytPwd(provdedPass);
    return provdedPassHash.toUpperCase() == storedPass;
  }

  // @inject('rounds')
  @inject(SA_PasswordHasherBindings.ROUNDS)
  public readonly rounds: number;

  // round: number = 10;
  async hashPassword(password: string): Promise<string> {
    const salt = await genSalt(this.rounds);
    let provdedPassHash = EncrytPwd(password);
    return provdedPassHash; //hash(provdedPassHash, salt);
  }
}

function EncrytPwd(InputText: string): string {
  return md5hash(md5hash('CEH_hZWEzNzc45622NjdiOA==') + md5hash(InputText));
}

function md5hash(InputText: String): string {
  return Md5.init(InputText).toString();
}
