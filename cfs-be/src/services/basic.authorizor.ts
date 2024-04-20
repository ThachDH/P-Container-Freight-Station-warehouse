import {
  AuthorizationContext,
  AuthorizationDecision,
  AuthorizationMetadata
} from '@loopback/authorization';
import {securityId, UserProfile} from '@loopback/security';
import lodash from 'lodash';
// Instance level authorizer
// Can be also registered as an authorizer, depends on users' need.
//Thoilc(*Note)-RBA roles page
export async function basicAuthorization(
  authorizationCtx: AuthorizationContext,
  metadata: AuthorizationMetadata,
): Promise<AuthorizationDecision> {
  // No access if authorization details are missing

  let currentUser: UserProfile;
  if (authorizationCtx.principals.length > 0) {
    const user = lodash.pick(authorizationCtx.principals[0], [
      'id',
      'name',
      'roles',
    ]);
    currentUser = {[securityId]: user.id, name: user.name, roles: user.roles};
    // console.log(user, " - ", currentUser);
    // currentUser = {[securityId]: user.id, name: user.name, roles: user.roles};
  } else {
    return AuthorizationDecision.DENY;
  }

  if (!currentUser.roles) {
    return AuthorizationDecision.DENY;
  }

  // Authorize everything that does not have a allowedRoles property
  if (!metadata.allowedRoles) {
    return AuthorizationDecision.ALLOW;
  }

  let roleIsAllowed = false;
  for (const role of currentUser.roles) {
    if (metadata.allowedRoles!.includes(role)) {
      roleIsAllowed = true;
      break;
    }
  }

  if (!roleIsAllowed) {
    return AuthorizationDecision.DENY;
  }

  // Admin and support accounts bypass id verification
  // Roles page
  if (
    currentUser.roles.includes('ADMIN')
  ) {
    return AuthorizationDecision.ALLOW;
  }

  /**
   * Allow access only to model owners, using route as source of truth
   *
   * eg. @post('/users/{userId}/orders', ...) returns `userId` as args[0]
   */
  if (currentUser.id === authorizationCtx.invocationContext.args[0]) {
    return AuthorizationDecision.ALLOW;
  }
  return AuthorizationDecision.DENY;
}
