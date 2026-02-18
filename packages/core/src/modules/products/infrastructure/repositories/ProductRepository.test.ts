import { ProductRepository } from '@core/modules/products/infrastructure/repositories/ProductRepository'
import type { HttpClient } from '@core/shared/services/http/HttpClient'

class MockFormData {
  entries: Array<{ key: string; value: any }> = []
  append(key: string, value: any) {
    this.entries.push({ key, value })
  }
}

describe('ProductRepository', () => {
  const makeHttp = () => {
    return {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      patch: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<HttpClient>
  }

  beforeEach(() => {
    ;(globalThis as any).FormData = MockFormData
  })

  it('getSellerProducts maps images to absolute URLs', async () => {
    const http = makeHttp()
    http.get.mockResolvedValue({
      data: {
        data: [
          {
            id: 'p1',
            title: 'T',
            condition: 'New',
            price: 10,
            stockQuantity: 1,
            status: 'active',
            images: ['/storage/a.jpg', 'https://cdn/x.png'],
          },
        ],
        meta: { current_page: 1, per_page: 20, total: 1 },
      },
    } as any)

    const repo = new ProductRepository(http, 'https://api.example.com/')
    const res = await repo.getSellerProducts(1, 20)

    expect(http.get).toHaveBeenCalledWith('/products?page=1&pageSize=20')
    expect(res.items[0].images).toEqual(['https://api.example.com/storage/a.jpg', 'https://cdn/x.png'])
  })

  it('createProduct builds FormData with tags[] and images[]', async () => {
    const http = makeHttp()
    http.post.mockResolvedValue({
      data: {
        id: 'p1',
        title: 'T',
        condition: 'New',
        price: 10,
        stockQuantity: 1,
        status: 'active',
        images: [],
      },
    } as any)

    const repo = new ProductRepository(http, 'https://api.example.com')
    const file1 = { name: 'a.png', type: 'image/png', size: 10 } as any
    const file2 = { name: 'b.png', type: 'image/png', size: 10 } as any

    await repo.createProduct({
      title: 'T',
      description: 'D',
      categoryId: 'c1',
      condition: 'New' as any,
      price: 10,
      stockQuantity: 2,
      tags: ['t1', 't2'],
      images: [file1, file2],
      weightKg: 1,
      sku: 'SKU',
      isDigital: false,
      allowReturns: true,
      returnDays: 14,
    })

    const [, fd] = (http.post as any).mock.calls[0]
    const entries = (fd as MockFormData).entries

    expect((http.post as any).mock.calls[0][0]).toBe('/products')
    expect(entries).toEqual(
      expect.arrayContaining([
        { key: 'title', value: 'T' },
        { key: 'description', value: 'D' },
        { key: 'category_id', value: 'c1' },
        { key: 'condition', value: 'New' },
        { key: 'price', value: '10' },
        { key: 'stock_quantity', value: '2' },
        { key: 'tags[]', value: 't1' },
        { key: 'tags[]', value: 't2' },
        { key: 'images[]', value: file1 },
        { key: 'images[]', value: file2 },
      ])
    )
  })

  it('updateProduct uses PUT /products/:id and tags[]', async () => {
    const http = makeHttp()
    http.put.mockResolvedValue({
      data: {
        id: 'p1',
        title: 'Updated',
        condition: 'New',
        price: 10,
        stockQuantity: 1,
        status: 'active',
        images: [],
      },
    } as any)

    const repo = new ProductRepository(http, 'https://api.example.com')
    await repo.updateProduct({
      id: 'p1',
      title: 'Updated',
      tags: ['t1', 't2'],
    } as any)

    expect(http.put).toHaveBeenCalled()
    expect((http.put as any).mock.calls[0][0]).toBe('/products/p1')

    const fd = (http.put as any).mock.calls[0][1] as MockFormData
    expect(fd.entries).toEqual(
      expect.arrayContaining([
        { key: 'title', value: 'Updated' },
        { key: 'tags[]', value: 't1' },
        { key: 'tags[]', value: 't2' },
      ])
    )
  })

  it('deleteProduct calls DELETE /products/:id', async () => {
    const http = makeHttp()
    http.delete.mockResolvedValue({} as any)

    const repo = new ProductRepository(http, 'https://api.example.com')
    await repo.deleteProduct('p1')

    expect(http.delete).toHaveBeenCalledWith('/products/p1')
  })

  it('updateStatus calls PATCH /products/:id/status with body', async () => {
    const http = makeHttp()
    http.patch.mockResolvedValue({} as any)

    const repo = new ProductRepository(http, 'https://api.example.com')
    await repo.updateStatus('p1', 'archived' as any)

    expect(http.patch).toHaveBeenCalledWith('/products/p1/status', { status: 'archived' })
  })
})