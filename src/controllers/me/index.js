import settings from 'settings';
import compose from 'koa-compose';
import { onlyAuthenticated } from 'server/middlewares/users';
import me from './handlers/me';

const homeRoute = {
  path: '/me',
  method: settings.METHODS.GET,
  handler: compose([onlyAuthenticated, me]),
};

export default [
  homeRoute,
];
