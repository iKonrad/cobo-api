export default async ctx => {
  ctx.body = {
    data: ctx.state.user,
  };
};
