import { UpdateProductUseCase } from '@core/modules/products/application/use-cases/UpdateProductUseCase'
import { IProductRepository } from '@core/modules/products/domain/repositories/IProductRepository'

describe('UpdateProductUseCase', () => {
  it('calls repository.updateProduct', async () => {
    const repo: jest.Mocked<IProductRepository> = {
      getSellerProducts: jest.fn(),
      createProduct: jest.fn(),
      updateProduct: jest.fn().mockResolvedValue({ id: '1', title: 'T', condition: 'New', price: 1, stockQuantity: 1, status: 'active' }),
      deleteProduct: jest.fn(),
      updateStatus: jest.fn(),
    } as any

    const useCase = new UpdateProductUseCase(repo)
    await useCase.execute({ id: '1', title: 'T' } as any)

    expect(repo.updateProduct).toHaveBeenCalledWith({ id: '1', title: 'T' })
  })
})