import { HttpClient } from '@core/shared/services/http/HttpClient'
import { MessagingContainer } from '@core/modules/messaging'
import { CoreTokenStorage } from '@/shared/services/storage'
import { env } from '@/shared/config/env'

const tokenStorage = new CoreTokenStorage()
const httpClient = new HttpClient(env.BACKEND_BASE_URL, tokenStorage)

export const messagingContainer = MessagingContainer.getInstance(httpClient)