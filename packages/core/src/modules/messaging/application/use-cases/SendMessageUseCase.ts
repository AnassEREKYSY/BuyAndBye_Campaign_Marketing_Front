import type { IMessagingRepository } from '../../domain/repositories/IMessagingRepository'
import type { SendMessageDTO } from '../../domain/dtos/SendMessageDTO'

export class SendMessageUseCase {
  constructor(private readonly repo: IMessagingRepository) {}
  execute(conversationId: string, dto: SendMessageDTO) {
    return this.repo.sendMessage(conversationId, dto)
  }
}