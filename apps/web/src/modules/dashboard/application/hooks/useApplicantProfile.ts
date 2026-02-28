import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { InfluencerPublicProfile } from '@core/modules/dashboard/domain/entities'
import { dashboardContainer } from '@/shared/api/dashboardContainer'

export function useApplicantProfile(open: boolean, influencerId: string | null) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [profile, setProfile] = useState<InfluencerPublicProfile | null>(null)

  const inflightRef = useRef<Map<string, Promise<InfluencerPublicProfile>>>(new Map())

  const load = useCallback(async () => {
    if (!open || !influencerId) return
    setLoading(true)
    setError(null)
    setProfile(null)

    const inflight = inflightRef.current
    const key = influencerId

    try {
      if (inflight.has(key)) {
        const p = await inflight.get(key)!
        setProfile(p)
        return
      }

      const p = dashboardContainer.getInfluencerPublicProfileUseCase.execute(key)
      inflight.set(key, p)
      const res = await p
      setProfile(res)
    } catch (e: any) {
      setError(e?.message ?? 'Failed to load influencer profile.')
    } finally {
      inflightRef.current.delete(influencerId)
      setLoading(false)
    }
  }, [open, influencerId])

  useEffect(() => {
    void load()
  }, [load])

  const closeOnEscapeEnabled = useMemo(() => open, [open])

  return { loading, error, profile, closeOnEscapeEnabled, refresh: load }
}