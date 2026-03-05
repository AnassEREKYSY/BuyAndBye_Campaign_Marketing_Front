// Auth module - domain
export * from './modules/auth/domain/entities'
export * from './modules/auth/domain/dtos'
export * from './modules/auth/domain/repositories'

export * from './modules/profile'

// Auth module - application
export * from './modules/auth/application/use-cases'

// Auth module - infrastructure
export { AuthApiClient } from './modules/auth/infrastructure/api/AuthApiClient'
export * from './modules/auth/infrastructure/api/types'
export { AuthRepository } from './modules/auth/infrastructure/repositories/AuthRepository'
export type { ITokenStorage } from './modules/auth/infrastructure/repositories/ITokenStorage'
export { WebAuthContainer } from './modules/auth/infrastructure/container/AuthContainer'
export { UserToDomainMapper } from './modules/auth/infrastructure/mappers/UserToDomainMapper'
export { AuthResponseToDomainMapper } from './modules/auth/infrastructure/mappers/AuthResponseToDomainMapper'
export { UserMapper } from './modules/auth/infrastructure/mappers/UserMapper'

// Messaging module
export * from './modules/messaging'
export { MessagingContainer } from './modules/messaging/infrastructure/container/MessagingContainer'

// Shared
export { HttpClient } from './shared/services/http/HttpClient'
export type { ApiError } from './shared/types/ApiError'
export { ApiException } from './shared/types/ApiException'
export * from './shared/types/notification'
export type { EnvConfig } from './shared/config/env'