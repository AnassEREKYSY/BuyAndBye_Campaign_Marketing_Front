import { useEffect, useMemo, useState } from 'react'
import { useProfile } from '../../application/hooks/useProfile'
import { Field, Input, PrimaryButton, SectionTitle, SubtleCard } from './ui'
import { GlobeAltIcon } from '@heroicons/react/24/outline'

function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M7.5 3h9A4.5 4.5 0 0 1 21 7.5v9A4.5 4.5 0 0 1 16.5 21h-9A4.5 4.5 0 0 1 3 16.5v-9A4.5 4.5 0 0 1 7.5 3Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path d="M17.5 6.5h.01" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

function TikTokIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M14 3v10.2a3.8 3.8 0 1 1-3.3-3.77"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M14 3c.8 2.8 2.8 4.8 6 5.2"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

function YouTubeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M21 8.2a3 3 0 0 0-2.1-2.12C17.1 5.5 12 5.5 12 5.5s-5.1 0-6.9.58A3 3 0 0 0 3 8.2 31 31 0 0 0 2.5 12 31 31 0 0 0 3 15.8a3 3 0 0 0 2.1 2.12c1.8.58 6.9.58 6.9.58s5.1 0 6.9-.58A3 3 0 0 0 21 15.8c.33-1.26.5-2.53.5-3.8s-.17-2.54-.5-3.8Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M10.5 9.5 15.5 12l-5 2.5V9.5Z" fill="currentColor" />
    </svg>
  )
}

function MediaKitIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M7 3h7l3 3v15H7V3Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M14 3v3h3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M9 10h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M9 14h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M9 18h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function SocialRow({
  label,
  placeholder,
  value,
  onChange,
  preview,
  icon,
}: {
  label: string
  placeholder: string
  value: string
  onChange: (v: string) => void
  preview?: string
  icon: React.ReactNode
}) {
  return (
    <div
      className="rounded-3xl border p-4 transition"
      style={{
        borderColor: 'rgb(var(--bb-border) / 0.10)',
        backgroundColor: 'rgb(var(--bb-border) / 0.04)',
      }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="bb-stat-icon h-9 w-9">{icon}</span>
            <div className="min-w-0">
              <p className="text-sm font-extrabold bb-title-text">{label}</p>
              {preview ? <p className="mt-0.5 truncate text-xs bb-muted-text">{preview}</p> : null}
            </div>
          </div>
        </div>

        <span
          className="rounded-full border px-2.5 py-1 text-[11px] font-extrabold"
          style={{
            borderColor: 'rgb(var(--bb-border) / 0.10)',
            backgroundColor: 'rgb(var(--bb-border) / 0.04)',
            color: 'rgb(var(--bb-muted) / 0.90)',
          }}
        >
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
  const [mediaKit, setMediaKit] = useState('')

  useEffect(() => {
    if (!profile) refresh()
  }, [profile, refresh])

  useEffect(() => {
    if (!profile) return
    const p = profile.influencerProfile ?? {}
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

  if (!profile) return <div className="bb-subtle-text">Loading…</div>

  if (profile.role !== 'influencer') {
    return (
      <div className="space-y-3">
        <SectionTitle title="Social media" subtitle="Social links are part of the influencer profile." />
        <SubtleCard>
          <p className="text-sm bb-subtle-text">
            Add brand social fields later in the backend: <span className="font-mono">brand_profiles</span>.
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
          media_kit_url: mediaKit,
        })
      }}
    >
      <SectionTitle
        title="Social media"
        subtitle="Add official profile links to boost trust and approvals."
        right={
          <span
            className={`rounded-full border px-3 py-2 text-xs font-extrabold ${score.cls}`}
            style={{ borderColor: 'rgb(var(--bb-border) / 0.10)', backgroundColor: 'rgb(var(--bb-border) / 0.04)' }}
          >
            {score.label}
          </span>
        }
      />

      <SubtleCard>
        <div className="flex flex-col gap-1">
          <p className="text-sm font-extrabold bb-title-text">Best practice</p>
          <p className="text-sm bb-subtle-text">Use clean links (no tracking params). Keep usernames consistent.</p>
        </div>
      </SubtleCard>

      <div className="grid grid-cols-1 gap-3">
        <SocialRow
          label="Instagram"
          placeholder="https://instagram.com/username"
          value={instagram}
          onChange={setInstagram}
          preview={normalizeHost(instagram)}
          icon={<InstagramIcon className="h-5 w-5" />}
        />
        <SocialRow
          label="TikTok"
          placeholder="https://tiktok.com/@username"
          value={tiktok}
          onChange={setTiktok}
          preview={normalizeHost(tiktok)}
          icon={<TikTokIcon className="h-5 w-5" />}
        />
        <SocialRow
          label="YouTube"
          placeholder="https://youtube.com/@username"
          value={youtube}
          onChange={setYoutube}
          preview={normalizeHost(youtube)}
          icon={<YouTubeIcon className="h-5 w-5" />}
        />
        <SocialRow
          label="Media kit"
          placeholder="https://drive.google.com/…"
          value={mediaKit}
          onChange={setMediaKit}
          preview={normalizeHost(mediaKit)}
          icon={<MediaKitIcon className="h-5 w-5" />}
        />
        <SocialRow
          label="Website (optional)"
          placeholder="https://your-site.com"
          value={(profile.influencerProfile as any)?.website_url ?? ''}
          onChange={() => {}}
          preview={''}
          icon={<GlobeAltIcon className="h-5 w-5" />}
        />
      </div>

      <div
        className="flex flex-col gap-3 rounded-3xl border p-4 sm:flex-row sm:items-center sm:justify-between"
        style={{ borderColor: 'rgb(var(--bb-border) / 0.10)', backgroundColor: 'rgb(var(--bb-border) / 0.04)' }}
      >
        <div className="text-sm bb-subtle-text">Keep links accurate to improve approvals.</div>
        <PrimaryButton type="submit" disabled={isLoading}>
          Save social links
        </PrimaryButton>
      </div>
    </form>
  )
}