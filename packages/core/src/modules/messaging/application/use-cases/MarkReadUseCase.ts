import type { IMessagingRepository } from '../../domain/repositories/IMessagingRepository'

export class MarkReadUseCase {
  constructor(private readonly repo: IMessagingRepository) {}
  execute(conversationId: string) {
    return this.repo.markRead(conversationId)
  }
}