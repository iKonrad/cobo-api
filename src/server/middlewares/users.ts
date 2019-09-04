import passport from 'koa-passport';
import { Context } from 'koa';

export const authenticate = async (ctx: Context, next): Promise<any> => {
  await passport.authenticate('bearer', { session: false }, async (err, user) => {
    if (user) {
      await ctx.login(user);
    }
  })(ctx, next);

  return next();
};

export const onlyAuthenticated = async (ctx: Context, next): Promise<any> => {
  await passport.authenticate('bearer', { session: false }, async (err, user) => {
    if (user) {
      await ctx.login(user);
    } else {
      ctx.body = { errors: [ctx.i18n.__('error.notLoggedIn')] };
      ctx.status = 401;
    }
  })(ctx, next);

  if (ctx.status !== 401) {
    return next();
  }
};

export const onlyNotAuthenticated = async (ctx: Context, next): Promise<any> => {
  await passport.authenticate('bearer', { session: false }, async (err, user) => {
    if (!err && user) {
      await ctx.login(user);
      ctx.body = { errors: [ctx.i18n.__('error.alreadyLoggedIn')] };
      ctx.status = 401;
    }
  })(ctx, next);

  if (ctx.status !== 401) {
    return next();
  }
};
