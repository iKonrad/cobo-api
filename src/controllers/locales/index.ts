// NPM modules
import { ControllerType, Method } from 'types';

// Handlers
import locales from './handlers/locales';

const localesRoute: ControllerType = {
  path: '/locales',
  method: Method.GET,
  handler: locales,
};

export default [
  localesRoute,
];
