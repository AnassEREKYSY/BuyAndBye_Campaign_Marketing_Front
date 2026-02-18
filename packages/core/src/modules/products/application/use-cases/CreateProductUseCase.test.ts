import { CreateProductUseCase } from '@core/modules/products/application/use-cases/CreateProductUseCase' 
import { IProductRepository } from '@core/modules/products/domain/repositories/IProductRepository'

describe('CreateProductUseCase', () => {
  it('calls repository.createProduct', async () => {
    const repo: jest.Mocked<IProductRepository> = {
      getSellerProducts: jest.fn(),
      createProduct: jest.fn().mockResolvedValue({ id: '1', title: 'T', condition: 'New', price: 1, stockQuantity: 1, status: 'active' }),
      updateProduct: jest.fn(),
      deleteProduct: jest.fn(),
      updateStatus: jest.fn(),
    } as any

    const useCase = new CreateProductUseCase(repo)
    await useCase.execute({ title: 'T', description: null, condition: 'New', price: 1, stockQuantity: 1, tags: [], isDigital: false, allowReturns: true, returnDays: 14 })

    expect(repo.createProduct).toHaveBeenCalledTimes(1)
  })
})