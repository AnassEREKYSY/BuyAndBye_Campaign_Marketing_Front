import { useCallback, useEffect, useMemo, useState } from 'react'
import { useProfile } from './useProfile'

export function useSocialLinksForm() {
  const { profile, refresh, isLoading, updateInfluencer } = useProfile()

  const [instagram, setInstagram] = useState('')
  const [tiktok, setTiktok] = useState('')
  const [youtube, setYoutube] = useState('')
  const [mediaKit, setMediaKit] = useState('')

  useEffect(() => {
    if (!profile) void refresh()
  }, [profile, refresh])

  useEffect(() => {
    if (!profile) return
    const p: any = profile.influencerProfile ?? {}
    setInstagram(p.instagram_url ?? '')
    setTiktok(p.tiktok_url ?? '')
    setYoutube(p.youtube_url ?? '')
    setMediaKit(p.media_kit_url ?? '')
  }, [profile])

  const score = useMemo(() => {
    const links = [instagram, tiktok, youtube, mediaKit].filter((x) => x.trim()).length
    if (links === 0) return { label: 'No links', cls: 'text-slate-400' }
    if (links <= 2) return { label: 'Good start', cls: 'text-sky-300' }
    return { label: 'Strong', cls: 'text-emerald-300' }
  }, [instagram, tiktok, youtube, mediaKit])

  const submit = useCallback(async () => {
    await updateInfluencer({
      instagram_url: instagram,
      tiktok_url: tiktok,
      youtube_url: youtube,
      media_kit_url: mediaKit,
    })
  }, [instagram, tiktok, youtube, mediaKit, updateInfluencer])

  return {
    profile,
    isLoading,

    instagram,
    setInstagram,
    tiktok,
    setTiktok,
    youtube,
    setYoutube,
    mediaKit,
    setMediaKit,

    score,
    submit,
  }
}