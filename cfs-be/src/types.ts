import {PermissionKeys} from './authorization/permission-keys';

//Thoilc(*Note)-Chưa sử dụng
export interface UserPermissionsFn {
  (
    userPermissions: PermissionKeys[],
    requiredPermissions: RequiredPermissions,
  ): boolean;
}

export interface MyUserProfile {
  id: string;
  email?: string;
  name: string;
  pass: string;
  roles: string;
  permissions: PermissionKeys[];
  // grpFunction: [],
  // grpPermission: [{}],
}

export interface RequiredPermissions {
  required: PermissionKeys[];
}

export const UserProfileSchema = {
  type: 'object',
  // required: ['name', 'pass', 'roles', 'permissions', 'grpFunction', 'grpPermission'],
  equired: ['name', 'pass', 'roles', 'permissions'],
  properties: {
    name: {
      type: 'string',
      format: 'name',
    },
    pass: {
      type: 'string',
      minLength: 8,
    },
  },
};

export const UserRequestBody = {
  description: 'The input of create user function',
  required: true,
  content: {
    'application/json': {schema: UserProfileSchema},
  },
};

export interface Credential {
  email?: string;
  name: string;
  pass: string;
  roles: string;
  permissions: PermissionKeys[];
  // grpFunction: [];
  // grpPermission: [{}];
}

export const CredentialsSchema = {
  type: 'object',
  required: ['name', 'pass'],
  properties: {
    name: {
      type: 'string',
      format: 'email',
    },
    pass: {
      type: 'string',
      minLength: 8,
    },
  },
};

export const CredentialsRequestBody = {
  description: 'The input of login function',
  required: true,
  content: {
    'application/json': {schema: CredentialsSchema},
  },
};
