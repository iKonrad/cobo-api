import settings from 'settings';
import compose from 'koa-compose';
import { Method, ControllerType } from 'types';
import { onlyNotAuthenticated } from 'server/middlewares/users';
import { validateJson } from 'server/middlewares/validate';

// Validators
import { email, password, username } from 'validators';

// Handlers
import post from './handlers/post';

const postRoute: ControllerType = {
  path: '/users',
  method: Method.POST,
  handler: compose(
    [
      onlyNotAuthenticated,
      validateJson({
        ...email(true, true),
        ...password(),
        ...username(true, true),
      }),
      post,
    ],
  ),
};

export default [
  postRoute,
];
