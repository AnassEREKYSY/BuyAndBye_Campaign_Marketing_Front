import { GetSellerProductsUseCase } from '@core/modules/products/application/use-cases/GetSellerProductsUseCase'
import { IProductRepository } from '@core/modules/products/domain/repositories/IProductRepository'

describe('GetSellerProductsUseCase', () => {
  it('calls repository.getSellerProducts with defaults', async () => {
    const repo: jest.Mocked<IProductRepository> = {
      getSellerProducts: jest.fn().mockResolvedValue({ items: [], page: 1, pageSize: 20, total: 0 }),
      createProduct: jest.fn(),
      updateProduct: jest.fn(),
      deleteProduct: jest.fn(),
      updateStatus: jest.fn(),
    } as any

    const useCase = new GetSellerProductsUseCase(repo)
    await useCase.execute()

    expect(repo.getSellerProducts).toHaveBeenCalledWith(undefined, undefined)
  })
})