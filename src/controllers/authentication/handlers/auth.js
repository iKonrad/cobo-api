/* eslint-disable no-prototype-builtins */
// NPM modules
import passport from 'koa-passport';
import settings from 'settings';
import uuid from 'uuid/v4';

// Global modules
import models from 'models';
import unauthorizedResponse from 'utils/responses/unauthorized';

export default async ctx => {
  // Delete old session if exists
  if (ctx.headers.hasOwnProperty('authorization')) {
    const [type, token] = ctx.headers.authorization.split(' ');
    if (type.toLowerCase() === 'bearer' && token) {
      await models.Session.destroy({ where: { id: token } });
    }
  }

  return passport.authenticate('json', { session: false }, async (err, user) => {
    if (err) {
      ctx.status = settings.STATUSES.UNAUTHORIZED;
      ctx.body = unauthorizedResponse;
    }

    if (user) {
      // We are authenticated, we can now create a session and return it
      const session = await models.Session.build({
        id: uuid(),
        userId: user.id,
      }).save();

      if (session) {
        ctx.body = {
          success: true,
          sessionToken: session.id,
        };
        return ctx.login(user);
      }
      ctx.status = settings.STATUSES.INTERNAL_SERVER_ERROR;
      ctx.body = { error: 'Internal error' };
    } else {
      ctx.body = {
        errors: {
          _error: ctx.i18n.__('title.login'),
        },
      };
      ctx.status = settings.STATUSES.UNAUTHORIZED;
    }
  },
  null)(ctx);
};
