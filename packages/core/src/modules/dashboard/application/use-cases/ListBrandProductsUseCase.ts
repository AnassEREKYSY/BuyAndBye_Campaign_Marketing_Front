import type { IDashboardRepository } from '../../domain/repositories/IDashboardRepository'

export class ListBrandProductsUseCase {
  constructor(private readonly repo: IDashboardRepository) {}

  execute(params: { page?: number; size?: number }) {
    return this.repo.listBrandProducts({ page: params.page, size: params.size })
  }
}