import type { ApiPaginated } from './types/ApiPaginated'
import type { ApiConversation } from './types/ApiConversation'
import type { ApiMessage } from './types/ApiMessage'
import { HttpClient } from '@core/shared/services/http/HttpClient'

export class MessagingApiClient {
  constructor(private readonly http: HttpClient) {}

  listConversations(page = 1, size = 20) {
    return this.http.get<ApiPaginated<ApiConversation>>(`/api/v1/conversations?page=${page}&size=${size}`)
  }

  getConversation(id: string) {
    return this.http.get<ApiConversation>(`/api/v1/conversations/${id}`)
  }

  listMessages(conversationId: string, page = 1, size = 50) {
    return this.http.get<ApiPaginated<ApiMessage>>(`/api/v1/conversations/${conversationId}/messages?page=${page}&size=${size}`)
  }

  sendMessage(conversationId: string, body: string) {
    return this.http.post<ApiMessage>(`/api/v1/conversations/${conversationId}/messages`, { body })
  }

  markRead(conversationId: string) {
    return this.http.post<{ ok: boolean }>(`/api/v1/conversations/${conversationId}/read`, {})
  }

  unreadCount() {
    return this.http.get<{ unread: number }>(`/api/v1/conversations/unread-count`)
  }
}