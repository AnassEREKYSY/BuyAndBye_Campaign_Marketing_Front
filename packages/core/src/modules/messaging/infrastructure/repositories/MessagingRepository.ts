import type { IMessagingRepository } from '../../domain/repositories/IMessagingRepository'
import type { Paginated } from '../../domain/entities/Paginated'
import type { Conversation } from '../../domain/entities/Conversation'
import type { Message } from '../../domain/entities/Message'
import type { SendMessageDTO } from '../../domain/dtos/SendMessageDTO'
import { MessagingApiClient } from '../api/MessagingApiClient'

function unwrapSingle<T>(res: any): T {
  return res?.data?.id ? (res.data as T) : (res as T)
}

export class MessagingRepository implements IMessagingRepository {
  constructor(private readonly api: MessagingApiClient) {}

  async listConversations(page = 1, size = 20): Promise<Paginated<Conversation>> {
    return (await this.api.listConversations(page, size)) as any
  }

  async getConversation(id: string): Promise<Conversation> {
    return unwrapSingle<Conversation>(await this.api.getConversation(id)) as any
  }

  async listMessages(conversationId: string, page = 1, size = 50): Promise<Paginated<Message>> {
    return (await this.api.listMessages(conversationId, page, size)) as any
  }

  async sendMessage(conversationId: string, dto: SendMessageDTO): Promise<Message> {
    return unwrapSingle<Message>(await this.api.sendMessage(conversationId, dto.body)) as any
  }

  async markRead(conversationId: string): Promise<{ ok: boolean }> {
    return this.api.markRead(conversationId)
  }

  async unreadCount(): Promise<{ unread: number }> {
    return this.api.unreadCount()
  }
}