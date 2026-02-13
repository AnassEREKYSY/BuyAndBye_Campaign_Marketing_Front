import { UserToDomainMapper } from './UserToDomainMapper';
import { AuthResponseToDomainMapper } from './AuthResponseToDomainMapper';
import { User } from '../../domain/entities/User';
import { AuthToken } from '../../domain/entities/AuthToken';
import { ApiUserResponse } from '../api/types/ApiUserResponse';
import { ApiAuthResponse } from '../api/types/ApiAuthResponse';

export class UserMapper {
  static toDomain(apiUser: ApiUserResponse, backendBaseUrl: string): User {
    return UserToDomainMapper.map(apiUser, backendBaseUrl);
  }

  static authResponseToDomain(apiResponse: ApiAuthResponse): { user: User | null; token: AuthToken } {
    return AuthResponseToDomainMapper.map(apiResponse);
  }
}
