import compose from 'koa-compose';
import { onlyAuthenticated } from 'server/middlewares/users';
import { Method, ControllerType } from 'types';
import me from './handlers/me';

const homeRoute: ControllerType = {
  path: '/me',
  method: Method.GET,
  handler: compose([onlyAuthenticated, me]),
};

export default [
  homeRoute,
];
