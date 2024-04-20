import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {SchemaObject} from '@loopback/rest';
import {CfsmssqldbDataSource} from '../datasources';
import {SA_USERS, SA_USERSRelations} from '../models/sa-users.model';

//Thoilc(*Note)-Field request body Login
const UserProfileSchema: SchemaObject = {
  type: 'object',
  required: ['USER_ID', 'PASSWORD'],
  properties: {
    USER_ID: {
      type: 'string',
    },
    PASSWORD: {
      type: 'string',
      minLength: 1,
    }
  },
};

export const UserRequestBody = {
  description: 'The input of login function',
  required: true,
  content: {
    'application/json': {schema: UserProfileSchema},
  },
};
const UsersSignUpSchema: SchemaObject = {
  type: 'object',
  required: ['USER_ID', 'USER_NAME', 'USER_NUMBER', 'PASSWORD', 'BIRTHDAY', 'ADDRESS', 'TELPHONE', 'EMAIL', 'USER_GROUP_CODE', 'USER_GROUP_NAME', 'IS_ACTIVE', 'REMARK'],
  properties: {
    USER_ID: {
      type: 'string',
    },
    USER_NAME: {
      type: 'string',
    },
    USER_NUMBER: {
      type: 'string',
    },
    PASSWORD: {
      type: 'string',
      minLength: 1,
    },
    BIRTHDAY: {
      type: 'string',
    },
    ADDRESS: {
      type: 'string',
    },
    TELPHONE: {
      type: 'string',
    },
    EMAIL: {
      type: 'string',
    },
    USER_GROUP_CODE: {
      type: 'string',
    },
    USER_GROUP_NAME: {
      type: 'string',
    },
    IS_ACTIVE: {
      type: 'boolean',
    },
    REMARK: {
      type: 'string',
    }
  },
};

export const UserSignUpRequestBody = {
  description: 'The input of sign up function',
  required: true,
  content: {
    'application/json': {schema: UsersSignUpSchema},
  },
};

//Thoilc(*Note)-Fields request body SignUp
export type SA_Credentials = {
  Name: string;
  Pass: string;
};

export class SA_USERSRepository extends DefaultCrudRepository<
  SA_USERS,
  typeof SA_USERS.prototype.ID,
  SA_USERSRelations
> {
  constructor(
    @inject('datasources.cfsmssqldb') dataSource: CfsmssqldbDataSource,
  ) {
    super(SA_USERS, dataSource);
  }
}
