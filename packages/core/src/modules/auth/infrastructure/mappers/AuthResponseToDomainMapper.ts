import { User } from '../../domain/entities/User';
import { AuthToken } from '../../domain/entities/AuthToken';
import { ApiAuthResponse } from '../api/types/ApiAuthResponse';

export class AuthResponseToDomainMapper {
  static map(apiResponse: ApiAuthResponse): { user: User | null; token: AuthToken } {
    return {
      user: null,
      token: {
        token: apiResponse.token,
        expiresIn: apiResponse.expiresIn,
      },
    };
  }
}
