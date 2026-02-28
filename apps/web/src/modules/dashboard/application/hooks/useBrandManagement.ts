import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNotification } from '@/shared/context/notification'
import type {
  CreateCampaignDTO,
  CreateProductDTO,
  UpdateCampaignDTO,
  UpdateProductDTO,
  CreateCampaignPayoutTierDTO,
  UpdateCampaignPayoutTierDTO,
} from '@core/modules/dashboard/domain/dtos'
import { Campaign, CampaignPayoutTier, Paginated, Product } from '@core/modules/dashboard/domain/entities'
import { dashboardContainer } from '@/shared/api/dashboardContainer'

type TierDraft = {
  id?: string
  metric: 'clicks'
  fromValue: number
  toValue: number | null
  payoutAmount: number
  currency: string | null
}

function toDraft(t: CampaignPayoutTier): TierDraft {
  return {
    id: t.id,
    metric: 'clicks',
    fromValue: Number(t.fromValue ?? 0),
    toValue: t.toValue !== undefined && t.toValue !== null ? Number(t.toValue) : null,
    payoutAmount: Number(t.payoutAmount ?? 0),
    currency: t.currency ?? null,
  }
}

function asPaginated<T>(raw: any): Paginated<T> {
  if (raw && Array.isArray(raw.items) && raw.meta) return raw as Paginated<T>

  const items = (raw?.items ?? raw?.data ?? raw) as T[]
  const metaRaw = raw?.meta ?? null

  const page = Number(metaRaw?.page ?? metaRaw?.current_page ?? 1) || 1
  const size = Number(metaRaw?.size ?? metaRaw?.per_page ?? items?.length ?? 0) || (items?.length ?? 0)
  const total = Number(metaRaw?.total ?? items?.length ?? 0) || (items?.length ?? 0)
  const lastPage = Number(metaRaw?.lastPage ?? metaRaw?.last_page ?? 1) || 1

  return {
    items: Array.isArray(items) ? items : [],
    meta: { page, size, total, lastPage },
  }
}

export function useBrandManagement() {
  const notify = useNotification()

  const [productsLoading, setProductsLoading] = useState(false)
  const [productsError, setProductsError] = useState<string | null>(null)
  const [productsPage, setProductsPage] = useState(1)
  const [productsSize, setProductsSize] = useState(50)
  const [productsRes, setProductsRes] = useState<Paginated<Product> | null>(null)

  const [campaignsLoading, setCampaignsLoading] = useState(false)
  const [campaignsError, setCampaignsError] = useState<string | null>(null)
  const [campaignsPage, setCampaignsPage] = useState(1)
  const [campaignsSize, setCampaignsSize] = useState(50)
  const [campaignsRes, setCampaignsRes] = useState<Paginated<Campaign> | null>(null)

  const listProducts = useMemo(() => dashboardContainer.listBrandProductsUseCase, [])
  const createProduct = useMemo(() => dashboardContainer.createProductUseCase, [])
  const updateProduct = useMemo(() => dashboardContainer.updateProductUseCase, [])
  const deleteProduct = useMemo(() => dashboardContainer.deleteProductUseCase, [])

  const listCampaigns = useMemo(() => dashboardContainer.listCampaignsUseCase, [])
  const createCampaign = useMemo(() => dashboardContainer.createCampaignUseCase, [])
  const updateCampaign = useMemo(() => dashboardContainer.updateCampaignUseCase, [])
  const publishCampaign = useMemo(() => dashboardContainer.publishCampaignUseCase, [])
  const deleteCampaign = useMemo(() => dashboardContainer.deleteCampaignUseCase, [])

  const listCampaignTiers = useMemo(() => dashboardContainer.listCampaignTiersUseCase, [])
  const createCampaignTier = useMemo(() => dashboardContainer.createCampaignTierUseCase, [])
  const updateCampaignTier = useMemo(() => dashboardContainer.updateCampaignTierUseCase, [])
  const deleteCampaignTier = useMemo(() => dashboardContainer.deleteCampaignTierUseCase, [])

  const refreshProducts = useCallback(async () => {
    try {
      setProductsError(null)
      setProductsLoading(true)
      const raw = await listProducts.execute({ page: productsPage, size: productsSize })
      setProductsRes(asPaginated<Product>(raw))
    } catch (e: any) {
      setProductsError(e?.message ?? 'Failed to load products')
    } finally {
      setProductsLoading(false)
    }
  }, [listProducts, productsPage, productsSize])

  const refreshCampaigns = useCallback(
    async (status?: string | null) => {
      try {
        setCampaignsError(null)
        setCampaignsLoading(true)
        const raw = await listCampaigns.execute({
          page: campaignsPage,
          size: campaignsSize,
          status: (status as any) ?? undefined,
          scope: 'mine',
        })
        setCampaignsRes(asPaginated<Campaign>(raw))
      } catch (e: any) {
        setCampaignsError(e?.message ?? 'Failed to load campaigns')
      } finally {
        setCampaignsLoading(false)
      }
    },
    [listCampaigns, campaignsPage, campaignsSize],
  )

  const onCreateProduct = useCallback(
    async (dto: CreateProductDTO) => {
      const p = await createProduct.execute(dto)
      notify.success('Product created')
      await refreshProducts()
      return p
    },
    [createProduct, notify, refreshProducts],
  )

  const onUpdateProduct = useCallback(
    async (id: string, dto: UpdateProductDTO) => {
      const p = await updateProduct.execute(id, dto)
      notify.success('Product updated')
      await refreshProducts()
      return p
    },
    [updateProduct, notify, refreshProducts],
  )

  const onDeleteProduct = useCallback(
    async (id: string) => {
      await deleteProduct.execute(id)
      notify.success('Product deleted')
      await refreshProducts()
    },
    [deleteProduct, notify, refreshProducts],
  )

  const getCampaignTiersDraft = useCallback(
    async (campaignId: string): Promise<TierDraft[]> => {
      const tiers = await listCampaignTiers.execute(campaignId)
      return (tiers ?? []).map(toDraft).sort((a, b) => a.fromValue - b.fromValue)
    },
    [listCampaignTiers],
  )

  const syncCampaignTiers = useCallback(
    async (campaignId: string, desired: TierDraft[]) => {
      const existing = await listCampaignTiers.execute(campaignId)
      const existingById = new Map((existing ?? []).map((t) => [t.id, t]))

      const desiredIds = new Set<string>()
      for (const d of desired) if (d.id) desiredIds.add(d.id)

      for (const t of existing ?? []) {
        if (!desiredIds.has(t.id)) {
          await deleteCampaignTier.execute(t.id)
        }
      }

      for (const d of desired) {
        if (d.id && existingById.has(d.id)) {
          const payload: UpdateCampaignPayoutTierDTO = {
            metric: 'clicks',
            fromValue: d.fromValue,
            toValue: d.toValue,
            payoutAmount: d.payoutAmount,
            currency: d.currency,
          }
          await updateCampaignTier.execute(d.id, payload)
        } else {
          const payload: CreateCampaignPayoutTierDTO = {
            metric: 'clicks',
            fromValue: d.fromValue,
            toValue: d.toValue,
            payoutAmount: d.payoutAmount,
            currency: d.currency,
          }
          await createCampaignTier.execute(campaignId, payload)
        }
      }
    },
    [listCampaignTiers, deleteCampaignTier, updateCampaignTier, createCampaignTier],
  )

  const onCreateCampaignWithTiers = useCallback(
    async (dto: CreateCampaignDTO, tiers: TierDraft[]) => {
      const c = await createCampaign.execute(dto)
      await syncCampaignTiers(c.id, tiers)
      notify.success('Campaign created')
      await refreshCampaigns()
      return c
    },
    [createCampaign, notify, refreshCampaigns, syncCampaignTiers],
  )

  const onUpdateCampaignWithTiers = useCallback(
    async (id: string, dto: UpdateCampaignDTO, tiers: TierDraft[]) => {
      const c = await updateCampaign.execute(id, dto)
      await syncCampaignTiers(id, tiers)
      notify.success('Campaign updated')
      await refreshCampaigns()
      return c
    },
    [updateCampaign, notify, refreshCampaigns, syncCampaignTiers],
  )

  const onPublishCampaign = useCallback(
    async (id: string) => {
      const c = await publishCampaign.execute(id)
      notify.success('Campaign published')
      await refreshCampaigns()
      return c
    },
    [publishCampaign, notify, refreshCampaigns],
  )

  const onDeleteCampaign = useCallback(
    async (id: string) => {
      await deleteCampaign.execute(id)
      notify.success('Campaign deleted')
      await refreshCampaigns()
    },
    [deleteCampaign, notify, refreshCampaigns],
  )

  useEffect(() => {
    void refreshProducts()
  }, [refreshProducts])

  useEffect(() => {
    void refreshCampaigns()
  }, [refreshCampaigns])

  return {
    productsLoading,
    productsError,
    productsRes,
    productsPage,
    setProductsPage,
    productsSize,
    setProductsSize,
    refreshProducts,
    onCreateProduct,
    onUpdateProduct,
    onDeleteProduct,

    campaignsLoading,
    campaignsError,
    campaignsRes,
    campaignsPage,
    setCampaignsPage,
    campaignsSize,
    setCampaignsSize,
    refreshCampaigns,
    onCreateCampaignWithTiers,
    onUpdateCampaignWithTiers,
    onPublishCampaign,
    onDeleteCampaign,

    getCampaignTiersDraft,
  }
}