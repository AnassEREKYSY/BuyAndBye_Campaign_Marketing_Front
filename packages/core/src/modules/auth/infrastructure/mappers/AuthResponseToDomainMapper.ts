import { User } from '../../domain/entities/User';
import { AuthToken } from '../../domain/entities/AuthToken';
import { ApiAuthResponse } from '../api/types/ApiAuthResponse';

export class AuthResponseToDomainMapper {
  static map(apiResponse: ApiAuthResponse): { user: User | null; token: AuthToken } {
    const payload = 'data' in apiResponse ? apiResponse.data : apiResponse;
    return {
      user: null,
      token: {
        token: payload.token,
        expiresIn: payload.expires_in ?? undefined,
      },
    } as { user: User | null; token: AuthToken };
  }
}
