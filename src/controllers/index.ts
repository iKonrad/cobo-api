import { ControllerType } from 'types';
import authenticationRoutes from './authentication';
import homeroutes from './me';
import userRoutes from './users';
import localesRoutes from './locales';

const routes: ControllerType[] = [
  ...authenticationRoutes,
  ...homeroutes,
  ...userRoutes,
  ...localesRoutes,
];

export default routes;

