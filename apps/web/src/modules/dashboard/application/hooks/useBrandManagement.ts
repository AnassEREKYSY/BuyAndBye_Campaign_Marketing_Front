import { useCallback, useEffect, useMemo, useState } from 'react'
import { DashboardContainer } from '@core/modules/dashboard/infrastructure/container/DashboardContainer'
import { HttpClient } from '@core/shared/services/http/HttpClient'
import { CoreTokenStorage } from '@/shared/services/storage'
import { env } from '@/shared/config/env'
import { useNotification } from '@/shared/context/notification'
import type { Campaign } from '@core/modules/dashboard'
import type { CreateCampaignDTO, CreateProductDTO, UpdateCampaignDTO, UpdateProductDTO } from '@core/modules/dashboard/domain/dtos'
import { Product } from '@core/modules/dashboard/domain/entities'

function buildHttpClient() {
  const tokenStorage = new CoreTokenStorage()
  return new HttpClient(env.BACKEND_BASE_URL, tokenStorage)
}

export function useBrandManagement() {
  const notify = useNotification()

  const httpClient = useMemo(() => buildHttpClient(), [])
  const container = useMemo(() => DashboardContainer.getInstance(httpClient), [httpClient])

  const [productsLoading, setProductsLoading] = useState(false)
  const [productsError, setProductsError] = useState<string | null>(null)
  const [products, setProducts] = useState<Product[]>([])

  const [campaignsLoading, setCampaignsLoading] = useState(false)
  const [campaignsError, setCampaignsError] = useState<string | null>(null)
  const [campaigns, setCampaigns] = useState<Campaign[]>([])

  const refreshProducts = useCallback(async () => {
    try {
      setProductsError(null)
      setProductsLoading(true)
      const res = await container.listBrandProductsUseCase.execute({ page: 1, size: 50 })
      setProducts(res)
    } catch (e: any) {
      setProductsError(e?.message ?? 'Failed to load products')
    } finally {
      setProductsLoading(false)
    }
  }, [container])

  const refreshCampaigns = useCallback(
    async (status?: 'draft' | 'published' | 'closed' | null) => {
      try {
        setCampaignsError(null)
        setCampaignsLoading(true)
        const res = await container.listCampaignsUseCase.execute({ page: 1, size: 50, status: status ?? undefined, scope: 'mine' })
        setCampaigns(res)
      } catch (e: any) {
        setCampaignsError(e?.message ?? 'Failed to load campaigns')
      } finally {
        setCampaignsLoading(false)
      }
    },
    [container],
  )

  const onCreateProduct = useCallback(
    async (dto: CreateProductDTO) => {
      const p = await container.createProductUseCase.execute(dto)
      notify.success('Product created')
      await refreshProducts()
      return p
    },
    [container, notify, refreshProducts],
  )

  const onUpdateProduct = useCallback(
    async (id: string, dto: UpdateProductDTO) => {
      const p = await container.updateProductUseCase.execute(id, dto)
      notify.success('Product updated')
      await refreshProducts()
      return p
    },
    [container, notify, refreshProducts],
  )

  const onDeleteProduct = useCallback(
    async (id: string) => {
      await container.deleteProductUseCase.execute(id)
      notify.success('Product deleted')
      await refreshProducts()
    },
    [container, notify, refreshProducts],
  )

  const onCreateCampaign = useCallback(
    async (dto: CreateCampaignDTO) => {
      const c = await container.createCampaignUseCase.execute(dto)
      notify.success('Campaign created')
      await refreshCampaigns()
      return c
    },
    [container, notify, refreshCampaigns],
  )

  const onUpdateCampaign = useCallback(
    async (id: string, dto: UpdateCampaignDTO) => {
      const c = await container.updateCampaignUseCase.execute(id, dto)
      notify.success('Campaign updated')
      await refreshCampaigns()
      return c
    },
    [container, notify, refreshCampaigns],
  )

  const onPublishCampaign = useCallback(
    async (id: string) => {
      const c = await container.publishCampaignUseCase.execute(id)
      notify.success('Campaign published')
      await refreshCampaigns()
      return c
    },
    [container, notify, refreshCampaigns],
  )

  const onDeleteCampaign = useCallback(
    async (id: string) => {
      await container.deleteCampaignUseCase.execute(id)
      notify.success('Campaign deleted')
      await refreshCampaigns()
    },
    [container, notify, refreshCampaigns],
  )

  useEffect(() => {
    void refreshProducts()
    void refreshCampaigns()
  }, [refreshProducts, refreshCampaigns])

  return {
    productsLoading,
    productsError,
    products,
    refreshProducts,
    onCreateProduct,
    onUpdateProduct,
    onDeleteProduct,

    campaignsLoading,
    campaignsError,
    campaigns,
    refreshCampaigns,
    onCreateCampaign,
    onUpdateCampaign,
    onPublishCampaign,
    onDeleteCampaign,
  }
}