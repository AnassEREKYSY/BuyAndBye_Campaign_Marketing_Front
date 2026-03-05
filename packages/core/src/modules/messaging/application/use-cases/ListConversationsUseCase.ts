import type { IMessagingRepository } from '../../domain/repositories/IMessagingRepository'

export class ListConversationsUseCase {
  constructor(private readonly repo: IMessagingRepository) {}
  execute(page = 1, size = 20) {
    return this.repo.listConversations(page, size)
  }
}