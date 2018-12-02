import models from 'models';

export default async ctx => {
  const data = ctx.request.body;
  const user = await models.User.build(data).save();

  if (user) {
    ctx.body = {
      data: user,
    };
  } else {
    ctx.body = {
      error: ctx.i18n.__('error.unknown'),
    };
  }
};
