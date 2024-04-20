import {inject} from '@loopback/core';
import {genSalt} from 'bcryptjs';
import {Md5} from 'md5-typescript';
import {PasswordHasherBindings} from '../keys';

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
    //const passwordMatches = provdedPassHash == storedPass;
    //const passwordMatches = await compare(provdedPassHash, storedPass);
    return provdedPassHash.toUpperCase() == storedPass;
  }

  // @inject('rounds')
  @inject(PasswordHasherBindings.ROUNDS)
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
