import { HttpClient } from '../../../../shared/services/http/HttpClient';
import { ITokenStorage } from '../repositories/ITokenStorage';
import { AuthApiClient } from '../api/AuthApiClient';
import { AuthRepository } from '../repositories/AuthRepository';
import {
  RegisterUseCase,
  LoginUseCase,
  LogoutUseCase,
  GetCurrentUserUseCase,
} from '@core/modules/auth/application/use-cases';

export class AuthContainer {
  private static instance: AuthContainer;

  public readonly registerUseCase: RegisterUseCase;
  public readonly loginUseCase: LoginUseCase;
  public readonly logoutUseCase: LogoutUseCase;
  public readonly getCurrentUserUseCase: GetCurrentUserUseCase;

  private constructor(httpClient: HttpClient, tokenStorage: ITokenStorage, backendBaseUrl: string) {
    const authApiClient = new AuthApiClient(httpClient);
    const authRepository = new AuthRepository(authApiClient, tokenStorage, backendBaseUrl);

    this.registerUseCase = new RegisterUseCase(authRepository);
    this.loginUseCase = new LoginUseCase(authRepository);
    this.logoutUseCase = new LogoutUseCase(authRepository);
    this.getCurrentUserUseCase = new GetCurrentUserUseCase(authRepository);
  }

  public static getInstance(httpClient: HttpClient, tokenStorage: ITokenStorage, backendBaseUrl: string): AuthContainer {
    if (!AuthContainer.instance) {
      AuthContainer.instance = new AuthContainer(httpClient, tokenStorage, backendBaseUrl);
    }
    return AuthContainer.instance;
  }
}
