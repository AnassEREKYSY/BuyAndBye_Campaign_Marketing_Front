import { useCallback, useEffect, useMemo, useState } from 'react'
import type { CampaignApplication } from '@core/modules/dashboard/domain/entities'
import { useNotification } from '@/shared/context/notification'
import { dashboardContainer } from '@/shared/api/dashboardContainer'

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

  const listApps = useMemo(() => dashboardContainer.listBrandCampaignApplicationsUseCase, [])
  const shortlistUc = useMemo(() => dashboardContainer.shortlistApplicationUseCase, [])
  const acceptUc = useMemo(() => dashboardContainer.acceptApplicationUseCase, [])
  const rejectUc = useMemo(() => dashboardContainer.rejectApplicationUseCase, [])

  const load = useCallback(
    async (nextPage: number) => {
      if (!campaignId) return
      setLoading(true)
      try {
        const res = await listApps.execute(campaignId, { page: nextPage, size })
        setItems((prev) => (nextPage === 1 ? res : [...prev, ...res]))
        setPage(nextPage)
        setHasMore((res ?? []).length === size)
      } catch (e: any) {
        notify({ type: 'error', message: e?.message ?? 'Failed to load applications.' })
      } finally {
        setLoading(false)
      }
    },
    [campaignId, listApps, notify, size],
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
        const updated = await shortlistUc.execute(applicationId)
        setItems((prev) => prev.map((a) => (a.id === applicationId ? updated : a)))
        notify({ type: 'success', message: 'Application shortlisted.' })
      } catch (e: any) {
        notify({ type: 'error', message: e?.message ?? 'Failed to shortlist.' })
      } finally {
        setMutatingId(null)
      }
    },
    [shortlistUc, notify],
  )

  const accept = useCallback(
    async (applicationId: string) => {
      setMutatingId(applicationId)
      try {
        const updated = await acceptUc.execute(applicationId)
        setItems((prev) => prev.map((a) => (a.id === applicationId ? updated : a)))
        notify({ type: 'success', message: 'Candidate finalized. Collaboration started.' })
      } catch (e: any) {
        notify({ type: 'error', message: e?.message ?? 'Failed to accept.' })
      } finally {
        setMutatingId(null)
      }
    },
    [acceptUc, notify],
  )

  const reject = useCallback(
    async (applicationId: string) => {
      setMutatingId(applicationId)
      try {
        const updated = await rejectUc.execute(applicationId)
        setItems((prev) => prev.map((a) => (a.id === applicationId ? updated : a)))
        notify({ type: 'success', message: 'Application rejected.' })
      } catch (e: any) {
        notify({ type: 'error', message: e?.message ?? 'Failed to reject.' })
      } finally {
        setMutatingId(null)
      }
    },
    [rejectUc, notify],
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