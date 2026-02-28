import { useCallback, useEffect, useMemo, useState } from 'react'
import { useProfile } from './useProfile'

export type BrandPersonalInfoForm = {
  brandName: string
  website: string
  industry: string
  contactEmail: string
  contactPhone: string
  description: string
  logo: File | null
  logoPreview: string | null
}

export type InfluencerPersonalInfoForm = {
  niche: string
  instagram: string
  tiktok: string
  youtube: string
  followersIg: number | ''
  followersTt: number | ''
  followersYt: number | ''
  engagement: number | ''
  country: string
  language: string
  mediaKit: string
  photo: File | null
  photoPreview: string | null
}

export function usePersonalInfoForm() {
  const { profile, isLoading, error, refresh, updateBrand, updateInfluencer } = useProfile()

  const role = profile?.role ?? null

  const [brandName, setBrandName] = useState('')
  const [website, setWebsite] = useState('')
  const [industry, setIndustry] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [contactPhone, setContactPhone] = useState('')
  const [description, setDescription] = useState('')
  const [logo, setLogo] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)

  const [niche, setNiche] = useState('')
  const [instagram, setInstagram] = useState('')
  const [tiktok, setTiktok] = useState('')
  const [youtube, setYoutube] = useState('')
  const [followersIg, setFollowersIg] = useState<number | ''>('')
  const [followersTt, setFollowersTt] = useState<number | ''>('')
  const [followersYt, setFollowersYt] = useState<number | ''>('')
  const [engagement, setEngagement] = useState<number | ''>('')
  const [country, setCountry] = useState('')
  const [language, setLanguage] = useState('')
  const [mediaKit, setMediaKit] = useState('')
  const [photo, setPhoto] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)

  useEffect(() => {
    if (!profile) void refresh()
  }, [profile, refresh])

  useEffect(() => {
    if (!logo) {
      if (logoPreview) URL.revokeObjectURL(logoPreview)
      setLogoPreview(null)
      return
    }
    const url = URL.createObjectURL(logo)
    setLogoPreview(url)
    return () => URL.revokeObjectURL(url)
  }, [logo])

  useEffect(() => {
    if (!photo) {
      if (photoPreview) URL.revokeObjectURL(photoPreview)
      setPhotoPreview(null)
      return
    }
    const url = URL.createObjectURL(photo)
    setPhotoPreview(url)
    return () => URL.revokeObjectURL(url)
  }, [photo])

  useEffect(() => {
    if (!profile) return

    if (profile.role === 'brand') {
      const p: any = profile.brandProfile ?? {}
      setBrandName(p.brand_name ?? '')
      setWebsite(p.website_url ?? '')
      setIndustry(p.industry ?? '')
      setContactEmail(p.contact_email ?? '')
      setContactPhone(p.contact_phone ?? '')
      setDescription(p.description ?? '')
      setLogo(null)
      if (logoPreview) {
        URL.revokeObjectURL(logoPreview)
        setLogoPreview(null)
      }
    } else if (profile.role === 'influencer') {
      const p: any = profile.influencerProfile ?? {}
      setNiche(p.niche ?? '')
      setInstagram(p.instagram_url ?? '')
      setTiktok(p.tiktok_url ?? '')
      setYoutube(p.youtube_url ?? '')
      setFollowersIg(p.followers_instagram ?? '')
      setFollowersTt(p.followers_tiktok ?? '')
      setFollowersYt(p.followers_youtube ?? '')
      setEngagement(p.avg_engagement_rate ?? '')
      setCountry(p.country_code ?? '')
      setLanguage(p.language ?? '')
      setMediaKit(p.media_kit_url ?? '')
      setPhoto(null)
      if (photoPreview) {
        URL.revokeObjectURL(photoPreview)
        setPhotoPreview(null)
      }
    }
  }, [profile])

  const headerImageUrl = useMemo(() => {
    if (!profile) return null
    return profile.role === 'brand' ? (profile as any)?.brandProfile?.logo_url ?? null : (profile as any)?.photo_url ?? null
  }, [profile])

  const submitBrand = useCallback(async () => {
    await updateBrand({
      brand_name: brandName,
      website_url: website,
      industry,
      contact_email: contactEmail,
      contact_phone: contactPhone,
      description,
      logo,
    })
  }, [brandName, website, industry, contactEmail, contactPhone, description, logo, updateBrand])

  const submitInfluencer = useCallback(async () => {
    await updateInfluencer({
      photo,
      niche,
      instagram_url: instagram,
      tiktok_url: tiktok,
      youtube_url: youtube,
      followers_instagram: followersIg === '' ? undefined : Number(followersIg),
      followers_tiktok: followersTt === '' ? undefined : Number(followersTt),
      followers_youtube: followersYt === '' ? undefined : Number(followersYt),
      avg_engagement_rate: engagement === '' ? undefined : Number(engagement),
      country_code: country,
      language,
      media_kit_url: mediaKit,
    })
  }, [
    photo,
    niche,
    instagram,
    tiktok,
    youtube,
    followersIg,
    followersTt,
    followersYt,
    engagement,
    country,
    language,
    mediaKit,
    updateInfluencer,
  ])

  const brandForm: BrandPersonalInfoForm = useMemo(
    () => ({
      brandName,
      website,
      industry,
      contactEmail,
      contactPhone,
      description,
      logo,
      logoPreview,
    }),
    [brandName, website, industry, contactEmail, contactPhone, description, logo, logoPreview],
  )

  const influencerForm: InfluencerPersonalInfoForm = useMemo(
    () => ({
      niche,
      instagram,
      tiktok,
      youtube,
      followersIg,
      followersTt,
      followersYt,
      engagement,
      country,
      language,
      mediaKit,
      photo,
      photoPreview,
    }),
    [
      niche,
      instagram,
      tiktok,
      youtube,
      followersIg,
      followersTt,
      followersYt,
      engagement,
      country,
      language,
      mediaKit,
      photo,
      photoPreview,
    ],
  )

  return {
    profile,
    role,
    isLoading,
    error,
    refresh,
    headerImageUrl,

    brandForm,
    setBrandName,
    setWebsite,
    setIndustry,
    setContactEmail,
    setContactPhone,
    setDescription,
    setLogo,
    submitBrand,

    influencerForm,
    setNiche,
    setInstagram,
    setTiktok,
    setYoutube,
    setFollowersIg,
    setFollowersTt,
    setFollowersYt,
    setEngagement,
    setCountry,
    setLanguage,
    setMediaKit,
    setPhoto,
    submitInfluencer,
  }
}