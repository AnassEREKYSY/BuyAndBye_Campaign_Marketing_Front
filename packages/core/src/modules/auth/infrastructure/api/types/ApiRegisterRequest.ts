import { UserRole } from '../../../domain/entities/UserRole';

export interface ApiRegisterRequest {
  email: string;
  display_name: string;
  role: UserRole;
  password: string;
  photo?: File;
}
