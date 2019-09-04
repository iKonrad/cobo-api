import { ParameterizedContext } from 'koa';
import { AuthenticatedState } from 'types';

export default async (ctx: ParameterizedContext<AuthenticatedState>) => {
  ctx.body = {
    data: ctx.state.user,
  };
};
