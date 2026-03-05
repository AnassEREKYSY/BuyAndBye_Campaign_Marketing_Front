import type { IMessagingRepository } from '../../domain/repositories/IMessagingRepository'

export class ListMessagesUseCase {
  constructor(private readonly repo: IMessagingRepository) {}
  execute(conversationId: string, page = 1, size = 50) {
    return this.repo.listMessages(conversationId, page, size)
  }
}