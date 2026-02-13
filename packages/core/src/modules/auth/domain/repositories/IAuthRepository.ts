import { User } from '../entities/User';
import { RegisterDTO } from '../dtos/RegisterDTO';
import { LoginDTO } from '../dtos/LoginDTO';
import { AuthResponse } from '../dtos/AuthResponse';

export interface IAuthRepository {
  register(data: RegisterDTO): Promise<AuthResponse>;
  login(data: LoginDTO): Promise<AuthResponse>;
  getAuthenticatedUser(): Promise<User>;
  logout(): Promise<void>;
}
