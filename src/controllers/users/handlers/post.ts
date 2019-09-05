import models from 'models';
import { Context } from 'koa';
import createResponse from 'utils/responses';

export default async (ctx: Context) => {
  const data = ctx.request.body;
  const user = await models.User.build(data).save();

  console.log('user', user);

  const response = createResponse(user);

  console.log('res', response);
  if (user) {
    ctx.body = response;
  } else {
    ctx.body = {
      error: ctx.i18n.__('error.unknown'),
    };
  }
};
