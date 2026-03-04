import type { User } from './DBTypes';

export type Credentials = Pick<User, 'username' | 'password'>;