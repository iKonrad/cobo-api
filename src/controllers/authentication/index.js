// NPM modules
import settings from 'settings';
import compose from 'koa-compose';

// Middlewares
import { onlyNotAuthenticated } from 'server/middlewares/users';
import { validateJson } from 'server/middlewares/validate';

// Validators
import { username } from 'validators';

// Handlers
import auth from './handlers/auth';
import logout from './handlers/logout';

const authRoute = {
  path: '/auth',
  method: settings.METHODS.POST,
  handler: compose([
    onlyNotAuthenticated,
    validateJson({
      ...username(true),
    }),
    auth,
  ]),
};

const logoutRoute = {
  path: '/logout',
  method: settings.METHODS.POST,
  handler: logout,
};

export default [
  authRoute,
  logoutRoute,
];
