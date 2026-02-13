import { IAuthRepository } from '../../domain/repositories/IAuthRepository';
import { LoginDTO } from '../../domain/dtos/LoginDTO';
import { AuthResponse } from '../../domain/dtos/AuthResponse';

export class LoginUseCase {
  constructor(private authRepository: IAuthRepository) {}

  async execute(data: LoginDTO): Promise<AuthResponse> {
    return this.authRepository.login(data);
  }
}
