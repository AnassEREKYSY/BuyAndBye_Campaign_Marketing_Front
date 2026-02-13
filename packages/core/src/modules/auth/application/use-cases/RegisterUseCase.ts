import { IAuthRepository } from '../../domain/repositories/IAuthRepository';
import { RegisterDTO } from '../../domain/dtos/RegisterDTO';
import { AuthResponse } from '../../domain/dtos/AuthResponse';

export class RegisterUseCase {
  constructor(private authRepository: IAuthRepository) {}

  async execute(data: RegisterDTO): Promise<AuthResponse> {
    return this.authRepository.register(data);
  }
}
