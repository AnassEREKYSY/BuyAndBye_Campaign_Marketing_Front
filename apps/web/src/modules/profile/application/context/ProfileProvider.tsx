import { useCallback, useEffect, useMemo, useState } from 'react'
import { ProfileContext } from './ProfileContext'
import type { CurrentUserProfile } from '@core/modules/profile'
import { WebProfileContainer } from '@core/modules/profile'
import { useNotification } from '@/shared/context/notification'

type Props = { children: React.ReactNode }

export function ProfileProvider({ children }: Props) {
  const n = useNotification()
  const container = useMemo(() => WebProfileContainer.get(), [])

  const [profile, setProfile] = useState<CurrentUserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const p = await container.getMyProfileUseCase.execute()
      setProfile(p)
    } catch (e: any) {
      setError(e?.message ?? 'Failed to load profile')
    } finally {
      setIsLoading(false)
    }
  }, [container])

  useEffect(() => {
    if (!profile) refresh()
  }, [profile, refresh])

  const updateBrand = useCallback(
    async (payload: any) => {
      setIsLoading(true)
      setError(null)
      try {
        const updated = await container.updateBrandProfileUseCase.execute(payload)
        setProfile(updated)
        n.success('Brand profile updated ✅')
      } catch (e: any) {
        setError(e?.message ?? 'Failed to update brand profile')
        n.error('Failed to update brand profile')
        throw e
      } finally {
        setIsLoading(false)
      }
    },
    [container, n],
  )

  const updateInfluencer = useCallback(
    async (payload: any) => {
      setIsLoading(true)
      setError(null)
      try {
        const updated = await container.updateInfluencerProfileUseCase.execute(payload)
        setProfile(updated)
        n.success('Influencer profile updated ✅')
      } catch (e: any) {
        setError(e?.message ?? 'Failed to update influencer profile')
        n.error('Failed to update influencer profile')
        throw e
      } finally {
        setIsLoading(false)
      }
    },
    [container, n],
  )

  const value = useMemo(
    () => ({ profile, isLoading, error, refresh, updateBrand, updateInfluencer }),
    [profile, isLoading, error, refresh, updateBrand, updateInfluencer],
  )

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
}