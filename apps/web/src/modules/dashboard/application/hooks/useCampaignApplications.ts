import { useCallback, useEffect, useMemo, useState } from 'react'
import { DashboardContainer } from '@core/modules/dashboard'
import { HttpClient } from '@core/shared/services/http/HttpClient'
import { CoreTokenStorage } from '@/shared/services/storage'
import { env } from '@/shared'
import type { CampaignApplication } from '@core/modules/dashboard/domain/entities'
import { useNotification } from '@/shared/context/notification'

function buildHttpClient() {
  const tokenStorage = new CoreTokenStorage()
  return new HttpClient(env.BACKEND_BASE_URL, tokenStorage)
}

type NotifyPayload = { type: 'success' | 'error' | 'info'; message: string }

export function useCampaignApplications(campaignId: string) {
  const notification = useNotification() as any
  const notifyFn: any = notification?.notify ?? notification?.push ?? notification?.show ?? notification?.add ?? null
  const notify = useCallback(
    (p: NotifyPayload) => {
      if (!notifyFn) return
      try {
        notifyFn(p)
      } catch {
        try {
          notifyFn(p.message, p.type)
        } catch {
          notifyFn(p.message)
        }
      }
    },
    [notifyFn],
  )

  const [items, setItems] = useState<CampaignApplication[]>([])
  const [page, setPage] = useState(1)
  const [size] = useState(20)
  const [loading, setLoading] = useState(false)
  const [mutatingId, setMutatingId] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)

  const container = useMemo(() => {
    const http = buildHttpClient()
    return DashboardContainer.getInstance(http)
  }, [])

  const load = useCallback(
    async (nextPage: number) => {
      if (!campaignId) return
      setLoading(true)
      try {
        const res = await container.listBrandCampaignApplicationsUseCase.execute(campaignId, { page: nextPage, size })
        setItems((prev) => (nextPage === 1 ? res : [...prev, ...res]))
        setPage(nextPage)
        setHasMore((res ?? []).length === size)
      } catch (e: any) {
        notify({ type: 'error', message: e?.message ?? 'Failed to load applications.' })
      } finally {
        setLoading(false)
      }
    },
    [campaignId, container, notify, size],
  )

  const refresh = useCallback(async () => {
    await load(1)
  }, [load])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return
    await load(page + 1)
  }, [hasMore, load, loading, page])

  const shortlist = useCallback(
    async (applicationId: string) => {
      setMutatingId(applicationId)
      try {
        const updated = await container.shortlistApplicationUseCase.execute(applicationId)
        setItems((prev) => prev.map((a) => (a.id === applicationId ? updated : a)))
        notify({ type: 'success', message: 'Application shortlisted.' })
      } catch (e: any) {
        notify({ type: 'error', message: e?.message ?? 'Failed to shortlist.' })
      } finally {
        setMutatingId(null)
      }
    },
    [container, notify],
  )

  const accept = useCallback(
    async (applicationId: string) => {
      setMutatingId(applicationId)
      try {
        const updated = await container.acceptApplicationUseCase.execute(applicationId)
        setItems((prev) => prev.map((a) => (a.id === applicationId ? updated : a)))
        notify({ type: 'success', message: 'Candidate finalized. Collaboration started.' })
      } catch (e: any) {
        notify({ type: 'error', message: e?.message ?? 'Failed to accept.' })
      } finally {
        setMutatingId(null)
      }
    },
    [container, notify],
  )

  const reject = useCallback(
    async (applicationId: string) => {
      setMutatingId(applicationId)
      try {
        const updated = await container.rejectApplicationUseCase.execute(applicationId)
        setItems((prev) => prev.map((a) => (a.id === applicationId ? updated : a)))
        notify({ type: 'success', message: 'Application rejected.' })
      } catch (e: any) {
        notify({ type: 'error', message: e?.message ?? 'Failed to reject.' })
      } finally {
        setMutatingId(null)
      }
    },
    [container, notify],
  )

  return {
    items,
    loading,
    hasMore,
    mutatingId,
    refresh,
    loadMore,
    shortlist,
    accept,
    reject,
  }
}