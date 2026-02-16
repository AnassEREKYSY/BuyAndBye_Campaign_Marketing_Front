import { IAuthRepository } from '@core/modules/auth/domain/repositories/IAuthRepository'; 
import { LoginDTO } from '@core/modules/auth/domain/dtos/LoginDTO'; 
import { AuthResponse } from '@core/modules/auth/domain/dtos/AuthResponse'; 

export class LoginUseCase {
  constructor(private authRepository: IAuthRepository) {}

  async execute(data: LoginDTO): Promise<AuthResponse> {
    return this.authRepository.login(data);
  }
}
