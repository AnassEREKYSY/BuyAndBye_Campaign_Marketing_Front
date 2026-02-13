import { ProfileStatus } from '../../../domain/entities/ProfileStatus';

export interface ApiAuthResponse {
  token: string;
  expiresIn: number | null;
  userId: string;
  profileStatus: ProfileStatus;
  isProfileComplete: boolean;
}
