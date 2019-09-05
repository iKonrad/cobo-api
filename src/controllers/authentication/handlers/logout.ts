import settings from 'settings';
import models from 'models';
import { Context } from 'koa';

export default async (ctx: Context) => {
  const authHeader = ctx.headers.authorization;
  if (authHeader) {
    const [type, token] = ctx.headers.authorization.split(' ');
    if (type.toLowerCase() === 'bearer' && token) {
      await models.Session.destroy({ where: { id: token } });
    }
  }


  ctx.status = settings.STATUSES.OK;
  ctx.body = { success: true };
};
