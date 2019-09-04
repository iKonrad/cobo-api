import { UserInstance } from 'models/User';

export * from './controller.types';

export interface AuthenticatedState {
    user: UserInstance;
}
