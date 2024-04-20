import {
  AuthenticationComponent,
  registerAuthenticationStrategy
} from '@loopback/authentication';
import {SECURITY_SCHEME_SPEC} from '@loopback/authentication-jwt';
import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {
  RestExplorerBindings,
  RestExplorerComponent
} from '@loopback/rest-explorer';
import {ServiceMixin} from '@loopback/service-proxy';
import path from 'path';
import {JWTStrategy} from './authorization/jwt-stratgies';
import {JWTService} from './middeware/jwt-service';
import {SA_MyUserService} from './middeware/sa-user-service';
import {SA_ACCESSRIGHTRepository} from './repositories/sa-accessright.repository';
import {
  SA_GroupFunctionInfor,
  SA_PasswordHasherBindings,
  SA_TokenServiceBindings,
  SA_TokenServiceConstants,
  SA_UserServiceBindings
} from './sa-key';
import {BcryptHasher} from './services/sa-hash.password';
export {ApplicationConfig};

export class BmsApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // setup binding
    this.setupBinding();

    // Add security spec
    this.addSecuritySpec();

    this.component(AuthenticationComponent);
    registerAuthenticationStrategy(this, JWTStrategy);
    // Set up the custom sequence
    // this.sequence(MySequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/knq',
    });

    this.component(RestExplorerComponent);

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
  }

  //Thoilc(*Note)-Nơi đăng ký dịch vụ bind
  setupBinding(): void {
    this.bind(SA_PasswordHasherBindings.PASSWORD_HASHER).toClass(BcryptHasher);
    this.bind(SA_PasswordHasherBindings.ROUNDS).to(10);
    this.bind(SA_UserServiceBindings.USER_SERVICE).toClass(SA_MyUserService);
    this.bind(SA_TokenServiceBindings.TOKEN_SERVICE).toClass(JWTService);
    this.bind(SA_TokenServiceBindings.TOKEN_SECRET).to(
      SA_TokenServiceConstants.TOKEN_SECRET_VALUE,
    );
    this.bind(SA_TokenServiceBindings.TOKEN_EXPIRES_IN).to(
      SA_TokenServiceConstants.TOKEN_EXPIRES_IN_VALUE,
    );
    // this.bind(CheckCell.CHECK_CELL).toClass(CheckcellService);
    this.bind(SA_GroupFunctionInfor.GROUP_FUNCTION).toClass(SA_ACCESSRIGHTRepository);
  }

  addSecuritySpec(): void {
    this.api({
      openapi: '3.0.0',
      info: {
        title: ' application',
        version: '1.0.0',
      },
      paths: {},
      components: {securitySchemes: SECURITY_SCHEME_SPEC},
      security: [
        {
          // secure all endpoints with 'jwt'
          jwt: [],
        },
      ],
      servers: [{url: '/'}],
    });
  }
}
