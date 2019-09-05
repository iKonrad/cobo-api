import settings from 'settings';
import validate from 'validate.js';
import { Context } from 'koa';

export const validateJson = schema => async (ctx: Context, next) => {
  const data = ctx.request.body;

  const wrapErrors = errors => {
    if (errors && Object.keys(errors).length > 0) {
      ctx.status = settings.STATUSES.BAD_REQUEST;
      const errorFields = Object.keys(errors);
      const parsedErrors = {};
      for (const fieldName of errorFields) {
        for (const error of errors[fieldName]) {
          if (!parsedErrors[fieldName]) {
            parsedErrors[fieldName] = [];
          }
          // If error is an object, it means we need to pass the values
          if (typeof error === 'object') {
            parsedErrors[fieldName].push(ctx.i18n.__(error.id, ...error.values));
          } else {
            parsedErrors[fieldName].push(ctx.i18n.__(error));
          }
        }
      }
      return parsedErrors;
    }
    return errors;
  };

  const options = {
    wrapErrors,
    ctx,
  };

  await validate.async(data, schema, options as any).then(next);
};

