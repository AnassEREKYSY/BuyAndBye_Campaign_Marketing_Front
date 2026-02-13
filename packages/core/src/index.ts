// Auth module - domain
export * from './modules/auth/domain/entities';
export * from './modules/auth/domain/dtos';
export * from './modules/auth/domain/repositories';

// Auth module - application
export * from './modules/auth/application/use-cases';

// Auth module - infrastructure
export { AuthApiClient } from './modules/auth/infrastructure/api/AuthApiClient';
export * from './modules/auth/infrastructure/api/types';
export { AuthRepository } from './modules/auth/infrastructure/repositories/AuthRepository';
export type { ITokenStorage } from './modules/auth/infrastructure/repositories/ITokenStorage';
export { AuthContainer } from './modules/auth/infrastructure/container/AuthContainer';
export { UserToDomainMapper } from './modules/auth/infrastructure/mappers/UserToDomainMapper';
export { AuthResponseToDomainMapper } from './modules/auth/infrastructure/mappers/AuthResponseToDomainMapper';
export { UserMapper } from './modules/auth/infrastructure/mappers/UserMapper';

// Users module - domain
export type { BecomeSellerDTO } from './modules/users/domain/dtos/BecomeSellerDTO';
export type { UpdateUserProfileDTO } from './modules/users/domain/dtos/UpdateUserProfileDTO';
export type { UpdateSellerProfileDTO } from './modules/users/domain/dtos/UpdateSellerProfileDTO';
export type { IUserRepository } from './modules/users/domain/repositories/IUserRepository';
export { UpdateUserProfileUseCase } from './modules/users/domain/use-cases/UpdateUserProfileUseCase';
export { UpdateSellerProfileUseCase } from './modules/users/domain/use-cases/UpdateSellerProfileUseCase';

// Users module - application
export { BecomeSellerUseCase } from './modules/users/application/use-cases/BecomeSellerUseCase';

// Users module - infrastructure
export { UserApiClient } from './modules/users/infrastructure/api/UserApiClient';
export { UserRepository } from './modules/users/infrastructure/repositories/UserRepository';
export { UserContainer } from './modules/users/infrastructure/container/UserContainer';

// Shared
export { HttpClient } from './shared/services/http/HttpClient';
export type { ApiError } from './shared/types/ApiError';
export { ApiException } from './shared/types/ApiException';
export * from './shared/types/notification';
export type { EnvConfig } from './shared/config/env';
