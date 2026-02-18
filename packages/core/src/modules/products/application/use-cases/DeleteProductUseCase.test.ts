import { DeleteProductUseCase } from '@core/modules/products/application/use-cases/DeleteProductUseCase'
import { IProductRepository } from '@core/modules/products/domain/repositories/IProductRepository'

describe('DeleteProductUseCase', () => {
  it('calls repository.deleteProduct', async () => {
    const repo: jest.Mocked<IProductRepository> = {
      getSellerProducts: jest.fn(),
      createProduct: jest.fn(),
      updateProduct: jest.fn(),
      deleteProduct: jest.fn().mockResolvedValue(undefined),
      updateStatus: jest.fn(),
    } as any

    const useCase = new DeleteProductUseCase(repo)
    await useCase.execute('p1')

    expect(repo.deleteProduct).toHaveBeenCalledWith('p1')
  })
})