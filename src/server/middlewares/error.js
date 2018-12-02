import settings from 'settings';

export default async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    if ((err.status && err.status >= 500) || err.message) {
      ctx.status = err.status;
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
