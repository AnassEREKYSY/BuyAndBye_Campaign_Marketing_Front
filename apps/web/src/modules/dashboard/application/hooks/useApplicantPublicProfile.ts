import { useCallback, useEffect, useRef, useState } from 'react'
import type { InfluencerPublicProfile } from '@core/modules/dashboard/domain/entities'
import { dashboardContainer } from '@/shared/api/dashboardContainer'

export function useApplicantPublicProfile(open: boolean, influencerId: string | null) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [profile, setProfile] = useState<InfluencerPublicProfile | null>(null)

  const mountedRef = useRef(true)
  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  const refresh = useCallback(async () => {
    if (!open || !influencerId) return
    setLoading(true)
    setError(null)
    setProfile(null)

    try {
      const p = await dashboardContainer.getInfluencerPublicProfileUseCase.execute(influencerId)
      if (!mountedRef.current) return
      setProfile(p)
    } catch (e: any) {
      if (!mountedRef.current) return
      setError(e?.message ?? 'Failed to load influencer profile.')
    } finally {
      if (!mountedRef.current) return
      setLoading(false)
    }
  }, [open, influencerId])

  useEffect(() => {
    void refresh()
  }, [refresh])

  return { loading, error, profile, refresh }
}