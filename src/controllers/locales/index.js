// NPM modules
import settings from 'settings';

// Handlers
import locales from './handlers/locales';

const localesRoute = {
  path: '/locales',
  method: settings.METHODS.GET,
  handler: locales,
};

export default [
  localesRoute,
];
