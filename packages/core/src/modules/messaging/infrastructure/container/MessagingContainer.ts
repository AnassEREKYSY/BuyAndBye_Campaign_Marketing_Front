import { HttpClient } from '@core/shared/services/http/HttpClient'
import { MessagingApiClient } from '../api/MessagingApiClient'
import { MessagingRepository } from '../repositories/MessagingRepository'

export class MessagingContainer {
  private static instance: MessagingContainer | null = null

  static getInstance(http: HttpClient) {
    if (!this.instance) this.instance = new MessagingContainer(http)
    return this.instance
  }

  readonly messagingRepository = new MessagingRepository(new MessagingApiClient(this.http))

  private constructor(private readonly http: HttpClient) {}
}