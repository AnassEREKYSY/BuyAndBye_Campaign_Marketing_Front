import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ProfileContext } from './ProfileContext'
import type { CurrentUserProfile } from '@core/modules/profile'
import { WebProfileContainer } from '@core/modules/profile'
import { useNotification } from '@/shared/context/notification'
import { useAuth } from '@/modules/auth/application/context'

type Props = { children: React.ReactNode }

export function ProfileProvider({ children }: Props) {
  const n = useNotification()
  const auth = useAuth() as any
  const container = useMemo(() => WebProfileContainer.get(), [])

  const [profile, setProfile] = useState<CurrentUserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const authKey = useMemo(() => {
    const isAuthed = Boolean(auth?.isAuthenticated)
    const token = (auth?.token ?? auth?.accessToken ?? '') as string
    return `${isAuthed ? '1' : '0'}:${token ?? ''}`
  }, [auth?.isAuthenticated, auth?.token, auth?.accessToken])

  const prevAuthKeyRef = useRef<string | null>(null)

  const refresh = useCallback(async () => {
    if (!auth?.isAuthenticated) {
      setProfile(null)
      return
    }

    setIsLoading(true)
    setError(null)
    try {
      const p = await container.getMyProfileUseCase.execute()
      setProfile(p)
    } catch (e: any) {
      setError(e?.message ?? 'Failed to load profile')
      setProfile(null)
    } finally {
      setIsLoading(false)
    }
  }, [auth?.isAuthenticated, container])

  useEffect(() => {
    const prev = prevAuthKeyRef.current
    if (prev !== authKey) {
      prevAuthKeyRef.current = authKey
      setProfile(null)
      setError(null)
      setIsLoading(false)
      if (auth?.isAuthenticated) void refresh()
    }
  }, [authKey, auth?.isAuthenticated, refresh])

  useEffect(() => {
    if (auth?.isAuthenticated && !profile) void refresh()
    if (!auth?.isAuthenticated && profile) setProfile(null)
  }, [auth?.isAuthenticated, profile, refresh])

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