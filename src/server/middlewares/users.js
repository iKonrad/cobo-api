import passport from 'koa-passport';

export const authenticate = async (ctx, next) => {
  await passport.authenticate('bearer', { session: false }, async (err, user) => {
    if (user) {
      await ctx.login(user);
    }
  })(ctx);

  return next();
};

export const onlyAuthenticated = async (ctx, next) => {
  await passport.authenticate('bearer', { session: false }, async (err, user) => {
    if (user) {
      await ctx.login(user);
    } else {
      ctx.body = { errors: [ctx.i18n.__('error.notLoggedIn')] };
      ctx.status = 401;
    }
  })(ctx);

  if (ctx.status !== 401) {
    return next();
  }
};

export const onlyNotAuthenticated = async (ctx, next) => {
  await passport.authenticate('bearer', { session: false }, async (err, user) => {
    if (!err && user) {
      await ctx.login(user);
      ctx.body = { errors: [ctx.i18n.__('error.alreadyLoggedIn')] };
      ctx.status = 401;
    }
  })(ctx);

  if (ctx.status !== 401) {
    return next();
  }
};
