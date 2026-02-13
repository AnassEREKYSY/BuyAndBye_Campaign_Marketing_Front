import { UserRole } from '../entities/UserRole';

export interface RegisterDTO {
  email: string;
  displayName: string;
  role: UserRole;
  password: string;
  photo?: File;
}
