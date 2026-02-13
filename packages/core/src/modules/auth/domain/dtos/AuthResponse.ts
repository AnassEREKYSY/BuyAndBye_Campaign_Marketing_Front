import { User } from '../entities/User';
import { AuthToken } from '../entities/AuthToken';

export interface AuthResponse {
  user: User;
  token: AuthToken;
}
