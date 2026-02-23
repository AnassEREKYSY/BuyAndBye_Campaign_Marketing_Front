import { useEffect, useMemo, useState } from 'react'
import { useProfile } from '../../application/hooks/useProfile'
import { Field, Input, PrimaryButton, SectionTitle, SubtleCard } from './ui'

function SocialRow({
  label,
  placeholder,
  value,
  onChange,
  preview,
}: {
  label: string
  placeholder: string
  value: string
  onChange: (v: string) => void
  preview?: string
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-4 transition hover:bg-white/10">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-extrabold text-white/90">{label}</p>
          {preview ? <p className="mt-1 truncate text-xs text-white/45">{preview}</p> : null}
        </div>
        <span className="rounded-full border border-white/10 bg-black/20 px-2.5 py-1 text-[11px] font-extrabold text-white/60">
          Link
        </span>
      </div>

      <div className="mt-3">
        <Field label={`${label} URL`} hint="https://">
          <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
        </Field>
      </div>
    </div>
  )
}

function normalizeHost(url: string) {
  try {
    if (!url.trim()) return ''
    const u = new URL(url)
    return `${u.hostname}${u.pathname}`.replace(/\/$/, '')
  } catch {
    return ''
  }
}

export function SocialMediaSection() {
  const { profile, refresh, isLoading, updateInfluencer } = useProfile()

  const [instagram, setInstagram] = useState('')
  const [tiktok, setTiktok] = useState('')
  const [youtube, setYoutube] = useState('')

  useEffect(() => {
    if (!profile) refresh()
  }, [profile, refresh])

  useEffect(() => {
    if (!profile) return
    const p = profile.influencerProfile ?? {}
    setInstagram(p.instagram_url ?? '')
    setTiktok(p.tiktok_url ?? '')
    setYoutube(p.youtube_url ?? '')
  }, [profile])

  const score = useMemo(() => {
    const links = [instagram, tiktok, youtube].filter((x) => x.trim()).length
    if (links === 0) return { label: 'No socials', cls: 'text-white/60' }
    if (links === 1) return { label: 'Good start', cls: 'text-sky-200' }
    if (links === 2) return { label: 'Strong', cls: 'text-emerald-200' }
    return { label: 'Premium', cls: 'text-emerald-200' }
  }, [instagram, tiktok, youtube])

  if (!profile) return <div className="text-white/70">Loading…</div>

  if (profile.role !== 'influencer') {
    return (
      <div className="space-y-3">
        <SectionTitle
          title="Social media"
          subtitle="For now, social links are part of the influencer profile. If you want brand socials too, we’ll extend brand_profiles."
        />
        <SubtleCard>
          <p className="text-sm text-white/60">
            Add brand social fields later in the backend: <span className="font-mono text-white/70">brand_profiles</span>.
          </p>
        </SubtleCard>
      </div>
    )
  }

  return (
    <form
      className="space-y-6"
      onSubmit={(e) => {
        e.preventDefault()
        updateInfluencer({
          instagram_url: instagram,
          tiktok_url: tiktok,
          youtube_url: youtube,
        })
      }}
    >
      <SectionTitle
        title="Social media"
        subtitle="Clean social links increase trust and conversion when brands review your profile."
        right={
          <span className={`rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-extrabold ${score.cls}`}>
            {score.label}
          </span>
        }
      />

      <SubtleCard>
        <div className="flex flex-col gap-1">
          <p className="text-sm font-extrabold text-white/85">Best practice</p>
          <p className="text-sm text-white/55">
            Use official profile links (no tracking params). Keep usernames consistent across platforms.
          </p>
        </div>
      </SubtleCard>

      <div className="grid grid-cols-1 gap-3">
        <SocialRow
          label="Instagram"
          placeholder="https://instagram.com/username"
          value={instagram}
          onChange={setInstagram}
          preview={normalizeHost(instagram)}
        />
        <SocialRow
          label="TikTok"
          placeholder="https://tiktok.com/@username"
          value={tiktok}
          onChange={setTiktok}
          preview={normalizeHost(tiktok)}
        />
        <SocialRow
          label="YouTube"
          placeholder="https://youtube.com/@username"
          value={youtube}
          onChange={setYoutube}
          preview={normalizeHost(youtube)}
        />
      </div>

      <div className="flex flex-col gap-3 rounded-3xl border border-white/10 bg-white/5 p-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-white/60">
        </p>
        <PrimaryButton type="submit" disabled={isLoading}>
          Save social links
        </PrimaryButton>
      </div>
    </form>
  )
}