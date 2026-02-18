import { SellerContainer } from '@core/modules/seller/infrastructure/container/SellerContainer'
import type { HttpClient } from '@core/shared/services/http/HttpClient'

describe('SellerContainer', () => {
  const http = {} as HttpClient

  afterEach(() => {
    SellerContainer.resetForTests()
  })

  it('returns the same instance for the same backendBaseUrl', () => {
    const a = SellerContainer.getInstance(http, 'https://api.example.com')
    const b = SellerContainer.getInstance(http, 'https://api.example.com')
    expect(a).toBe(b)
  })

  it('recreates instance when backendBaseUrl changes', () => {
    const a = SellerContainer.getInstance(http, 'https://api-a.example.com')
    const b = SellerContainer.getInstance(http, 'https://api-b.example.com')
    expect(a).not.toBe(b)
  })

  it('resetForTests clears singleton', () => {
    const a = SellerContainer.getInstance(http, 'https://api.example.com')
    SellerContainer.resetForTests()
    const b = SellerContainer.getInstance(http, 'https://api.example.com')
    expect(a).not.toBe(b)
  })
})