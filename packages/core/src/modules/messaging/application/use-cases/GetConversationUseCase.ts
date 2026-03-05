import type { IMessagingRepository } from '../../domain/repositories/IMessagingRepository'

export class GetConversationUseCase {
  constructor(private readonly repo: IMessagingRepository) {}
  execute(id: string) {
    return this.repo.getConversation(id)
  }
}