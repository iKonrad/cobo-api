import settings from 'settings';
import compose from 'koa-compose';
import { onlyNotAuthenticated } from 'server/middlewares/users';
import { validateJson } from 'server/middlewares/validate';

// Validators
import { email, password, username } from 'validators';

// Handlers
import post from './handlers/post';

const postRoute = {
  path: '/users',
  method: settings.METHODS.POST,
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
