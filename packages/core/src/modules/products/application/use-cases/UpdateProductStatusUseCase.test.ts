import { UpdateProductStatusUseCase } from '@core/modules/products/application/use-cases/UpdateProductStatusUseCase'
import { IProductRepository } from '@core/modules/products/domain/repositories/IProductRepository'

describe('UpdateProductStatusUseCase', () => {
  it('calls repository.updateStatus', async () => {
    const repo: jest.Mocked<IProductRepository> = {
      getSellerProducts: jest.fn(),
      createProduct: jest.fn(),
      updateProduct: jest.fn(),
      deleteProduct: jest.fn(),
      updateStatus: jest.fn().mockResolvedValue(undefined),
    } as any

    const useCase = new UpdateProductStatusUseCase(repo)
    await useCase.execute('p1', 'archived')

    expect(repo.updateStatus).toHaveBeenCalledWith('p1', 'archived')
  })
})