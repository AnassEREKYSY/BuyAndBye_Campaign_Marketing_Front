import { HttpClient } from '@core/shared/services/http/HttpClient'
import { CoreTokenStorage } from '@/shared/services/storage'
import { env } from '@/shared/config/env'

const tokenStorage = new CoreTokenStorage()
export const httpClient = new HttpClient(env.BACKEND_BASE_URL, tokenStorage)