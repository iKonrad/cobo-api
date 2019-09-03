// NPM modules
import compose from 'koa-compose';
import { ControllerType, Method } from 'types';
// Middlewares
import { onlyNotAuthenticated } from 'server/middlewares/users';
import { validateJson } from 'server/middlewares/validate';
// Validators
import { username } from 'validators';
// Handlers
import auth from './handlers/auth';
import logout from './handlers/logout';

const authRoute: ControllerType = {
  path: '/auth',
  method: Method.POST,
  handler: compose([
    onlyNotAuthenticated,
    validateJson({
      ...username(true),
    }),
    auth,
  ]),
};

const logoutRoute: ControllerType = {
  path: '/logout',
  method: Method.POST,
  handler: logout,
};

export default [
  authRoute,
  logoutRoute,
];
