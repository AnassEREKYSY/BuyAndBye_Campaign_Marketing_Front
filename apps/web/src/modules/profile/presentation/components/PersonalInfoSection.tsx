import { useEffect, useMemo, useState } from 'react'
import { useProfile } from '../../application/hooks/useProfile'
import { env } from '@/shared/config/env'
import { Field, GhostButton, Input, PrimaryButton, SectionTitle, SubtleCard, Textarea } from './ui'

function toAbsolute(url: string) {
  const u = (url ?? '').trim()
  if (!u) return ''
  if (u.startsWith('http://') || u.startsWith('https://')) return u
  const base = env.BACKEND_BASE_URL.replace(/\/$/, '')
  const path = u.startsWith('/') ? u : `/${u}`
  return `${base}${path}`
}

function Avatar({ url, fallback }: { url?: string | null; fallback: string }) {
  const src = toAbsolute(url ?? '')
  return (
    <div className="flex items-center gap-4">
      <div
        className="h-14 w-14 overflow-hidden rounded-3xl border"
        style={{
          borderColor: 'rgb(var(--bb-border) / 0.10)',
          backgroundColor: 'rgb(var(--bb-border) / 0.04)',
          boxShadow: '0 18px 60px rgb(0 0 0 / 0.10)',
        }}
      >
        {src ? (
          <img src={src} alt="avatar" className="h-full w-full object-cover" />
        ) : (
          <div className="grid h-full w-full place-items-center text-sm font-extrabold" style={{ color: 'rgb(var(--bb-muted) / 0.90)' }}>
            {fallback.slice(0, 2).toUpperCase()}
          </div>
        )}
      </div>
    </div>
  )
}

const INDUSTRIES = [
  'Beauty',
  'Fashion',
  'Tech',
  'Fitness',
  'Food',
  'Travel',
  'Gaming',
  'Lifestyle',
  'Home & Living',
  'Finance',
  'Education',
  'Health',
  'Automotive',
  'Other',
] as const

const NICHES = [
  'Tech',
  'Beauty',
  'Fashion',
  'Fitness',
  'Food',
  'Travel',
  'Gaming',
  'Lifestyle',
  'Education',
  'Finance',
  'Health',
  'Business',
  'Entertainment',
  'Sports',
  'Parenting',
  'Cars',
  'Home & Living',
  'Art & Design',
  'Photography',
  'Other',
] as const

export function PersonalInfoSection() {
  const { profile, isLoading, error, refresh, updateBrand, updateInfluencer } = useProfile()

  useEffect(() => {
    if (!profile) refresh()
  }, [profile, refresh])

  const role = profile?.role

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
    if (!logo) {
      if (logoPreview) URL.revokeObjectURL(logoPreview)
      setLogoPreview(null)
      return
    }
    const url = URL.createObjectURL(logo)
    setLogoPreview(url)
    return () => URL.revokeObjectURL(url)
  }, [logo, logoPreview])

  useEffect(() => {
    if (!photo) {
      if (photoPreview) URL.revokeObjectURL(photoPreview)
      setPhotoPreview(null)
      return
    }
    const url = URL.createObjectURL(photo)
    setPhotoPreview(url)
    return () => URL.revokeObjectURL(url)
  }, [photo, photoPreview])

  useEffect(() => {
    if (!profile) return

    if (profile.role === 'brand') {
      const p = profile.brandProfile ?? {}
      setBrandName(p.brand_name ?? '')
      setWebsite(p.website_url ?? '')
      setIndustry(p.industry ?? '')
      setContactEmail(p.contact_email ?? '')
      setContactPhone(p.contact_phone ?? '')
      setDescription(p.description ?? '')
      setLogo(null)
    } else {
      const p = profile.influencerProfile ?? {}
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
    }
  }, [profile])

  const headerImageUrl = role === 'brand' ? profile?.brandProfile?.logo_url ?? null : profile?.photo_url ?? null

  const header = useMemo(() => {
    if (!profile) return null
    const badge = profile.role === 'brand' ? 'Brand account' : 'Influencer account'
    return (
      <SubtleCard>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Avatar url={headerImageUrl} fallback={profile.display_name || profile.email} />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-extrabold bb-title-text">{profile.display_name}</h2>
                <span
                  className="rounded-full border px-2.5 py-1 text-[11px] font-extrabold"
                  style={{
                    borderColor: 'rgb(var(--bb-border) / 0.10)',
                    backgroundColor: 'rgb(var(--bb-border) / 0.04)',
                    color: 'rgb(var(--bb-muted) / 0.90)',
                  }}
                >
                  {badge}
                </span>
                <span
                  className="rounded-full border px-2.5 py-1 text-[11px] font-extrabold"
                  style={{
                    borderColor: 'rgb(var(--bb-border) / 0.10)',
                    backgroundColor: 'rgb(var(--bb-border) / 0.04)',
                    color: 'rgb(var(--bb-muted) / 0.82)',
                  }}
                >
                  Keep it complete ✨
                </span>
              </div>
              <p className="mt-1 text-sm bb-subtle-text">{profile.email}</p>
            </div>
          </div>

          <GhostButton onClick={refresh} disabled={isLoading}>
            Refresh
          </GhostButton>
        </div>
      </SubtleCard>
    )
  }, [profile, refresh, isLoading, headerImageUrl])

  if (!profile && isLoading) return <div className="bb-subtle-text">Loading profile…</div>
  if (!profile && error) return <div className="text-rose-200">{error}</div>
  if (!profile) return <div className="bb-subtle-text">No profile loaded.</div>

  return (
    <div className="space-y-6">
      {header}

      {role === 'brand' ? (
        <form
          className="space-y-6"
          onSubmit={(e) => {
            e.preventDefault()
            updateBrand({
              brand_name: brandName,
              website_url: website,
              industry,
              contact_email: contactEmail,
              contact_phone: contactPhone,
              description,
              logo,
            })
          }}
        >
          <SectionTitle title="Brand profile" subtitle="Update your public brand identity and contact details." />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field label="Brand name">
              <Input value={brandName} onChange={(e) => setBrandName(e.target.value)} placeholder="My Brand" />
            </Field>

            <Field label="Website">
              <Input value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://brand.com" />
            </Field>

            <Field label="Industry">
              <select value={industry} onChange={(e) => setIndustry(e.target.value)} className="bb-select w-full">
                <option value="">Select an industry</option>
                {INDUSTRIES.map((x) => (
                  <option key={x} value={x}>
                    {x}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Contact email">
              <Input value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} placeholder="contact@brand.com" />
            </Field>

            <Field label="Contact phone">
              <Input value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} placeholder="+212600000000" />
            </Field>

            <Field label="Brand logo" hint="PNG/JPG">
              <Input type="file" accept="image/*" onChange={(e) => setLogo(e.target.files?.[0] ?? null)} />
              {logoPreview ? (
                <div className="mt-3 rounded-2xl border p-3"
                     style={{ borderColor: 'rgb(var(--bb-border) / 0.10)', backgroundColor: 'rgb(var(--bb-border) / 0.04)' }}
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 overflow-hidden rounded-2xl border"
                         style={{ borderColor: 'rgb(var(--bb-border) / 0.10)', backgroundColor: 'rgb(var(--bb-border) / 0.04)' }}
                    >
                      <img src={logoPreview} alt="logo preview" className="h-full w-full object-cover" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-extrabold bb-title-text">{logo?.name}</p>
                      <p className="text-xs bb-subtle-text">Ready to upload</p>
                    </div>
                  </div>
                </div>
              ) : null}
            </Field>
          </div>

          <Field label="Description">
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} placeholder="We sell amazing products…" />
          </Field>

          <div
            className="flex flex-col gap-3 rounded-3xl border p-4 sm:flex-row sm:items-center sm:justify-between"
            style={{ borderColor: 'rgb(var(--bb-border) / 0.10)', backgroundColor: 'rgb(var(--bb-border) / 0.04)' }}
          >
            <p className="text-sm bb-subtle-text">Your changes will be saved securely.</p>
            <PrimaryButton type="submit" disabled={isLoading}>
              Save changes
            </PrimaryButton>
          </div>
        </form>
      ) : (
        <form
          className="space-y-6"
          onSubmit={(e) => {
            e.preventDefault()
            updateInfluencer({
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
          }}
        >
          <SectionTitle title="Influencer profile" subtitle="Tell brands who you are and where you create content." />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field label="Profile image" hint="PNG/JPG">
              <Input type="file" accept="image/*" onChange={(e) => setPhoto(e.target.files?.[0] ?? null)} />
              {photoPreview ? (
                <div className="mt-3 rounded-2xl border p-3"
                     style={{ borderColor: 'rgb(var(--bb-border) / 0.10)', backgroundColor: 'rgb(var(--bb-border) / 0.04)' }}
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 overflow-hidden rounded-2xl border"
                         style={{ borderColor: 'rgb(var(--bb-border) / 0.10)', backgroundColor: 'rgb(var(--bb-border) / 0.04)' }}
                    >
                      <img src={photoPreview} alt="photo preview" className="h-full w-full object-cover" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-extrabold bb-title-text">{photo?.name}</p>
                      <p className="text-xs bb-subtle-text">Ready to upload</p>
                    </div>
                  </div>
                </div>
              ) : null}
            </Field>

            <Field label="Niche">
              <select value={niche} onChange={(e) => setNiche(e.target.value)} className="bb-select w-full">
                <option value="">Select a niche</option>
                {NICHES.map((x) => (
                  <option key={x} value={x}>
                    {x}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Country code">
              <Input value={country} onChange={(e) => setCountry(e.target.value)} placeholder="MA, FR, ES…" />
            </Field>

            <Field label="Language">
              <Input value={language} onChange={(e) => setLanguage(e.target.value)} placeholder="fr, en, ar…" />
            </Field>

            <Field label="Media kit URL">
              <Input value={mediaKit} onChange={(e) => setMediaKit(e.target.value)} placeholder="https://drive.google.com/…" />
            </Field>

            <Field label="Instagram URL">
              <Input value={instagram} onChange={(e) => setInstagram(e.target.value)} placeholder="https://instagram.com/username" />
            </Field>

            <Field label="TikTok URL">
              <Input value={tiktok} onChange={(e) => setTiktok(e.target.value)} placeholder="https://tiktok.com/@username" />
            </Field>

            <Field label="YouTube URL">
              <Input value={youtube} onChange={(e) => setYoutube(e.target.value)} placeholder="https://youtube.com/@username" />
            </Field>

            <Field label="Followers Instagram">
              <Input value={followersIg} onChange={(e) => setFollowersIg(e.target.value === '' ? '' : Number(e.target.value))} type="number" placeholder="50000" />
            </Field>

            <Field label="Followers TikTok">
              <Input value={followersTt} onChange={(e) => setFollowersTt(e.target.value === '' ? '' : Number(e.target.value))} type="number" placeholder="120000" />
            </Field>

            <Field label="Followers YouTube">
              <Input value={followersYt} onChange={(e) => setFollowersYt(e.target.value === '' ? '' : Number(e.target.value))} type="number" placeholder="10000" />
            </Field>

            <Field label="Avg engagement rate (%)">
              <Input value={engagement} onChange={(e) => setEngagement(e.target.value === '' ? '' : Number(e.target.value))} type="number" step="0.1" placeholder="4.2" />
            </Field>
          </div>

          <div
            className="flex flex-col gap-3 rounded-3xl border p-4 sm:flex-row sm:items-center sm:justify-between"
            style={{ borderColor: 'rgb(var(--bb-border) / 0.10)', backgroundColor: 'rgb(var(--bb-border) / 0.04)' }}
          >
            <p className="text-sm bb-subtle-text">Your changes will be saved securely.</p>
            <PrimaryButton type="submit" disabled={isLoading}>
              Save changes
            </PrimaryButton>
          </div>
        </form>
      )}
    </div>
  )
}