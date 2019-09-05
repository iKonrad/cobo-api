import settings from 'settings';

export default async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    if ((err.status && err.status >= settings.STATUSES.INTERNAL_SERVER_ERROR) || err.message) {
      ctx.status = err.status || settings.STATUSES.INTERNAL_SERVER_ERROR;
      ctx.body = { errors: {
        _error: settings.ENV === 'production' ? 'Internal error' : ctx.i18n.__(err.message || 'error.unknownError'),
      } };
      console.log('Internal error: ', err);
    } else {
      if (err.status) {
        ctx.status = err.status;
      }
      ctx.body = {
        errors: err,
      };
    }
  }
};
