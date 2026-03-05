import type { Paginated } from '../entities/Paginated'
import type { Conversation } from '../entities/Conversation'
import type { Message } from '../entities/Message'
import type { SendMessageDTO } from '../dtos/SendMessageDTO'

export interface IMessagingRepository {
  listConversations(page?: number, size?: number): Promise<Paginated<Conversation>>
  getConversation(id: string): Promise<Conversation>
  listMessages(conversationId: string, page?: number, size?: number): Promise<Paginated<Message>>
  sendMessage(conversationId: string, dto: SendMessageDTO): Promise<Message>
  markRead(conversationId: string): Promise<{ ok: boolean }>
  unreadCount(): Promise<{ unread: number }>
}