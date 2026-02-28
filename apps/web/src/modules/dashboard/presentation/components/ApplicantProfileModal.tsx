import { useEffect, useMemo } from 'react'
import { useApplicantPublicProfile } from '@/modules/dashboard/application/hooks/useApplicantPublicProfile'
import {
  XMarkIcon,
  MapPinIcon,
  LanguageIcon,
  LinkIcon,
  ChartBarIcon,
  UsersIcon,
  SparklesIcon,
  ArrowTopRightOnSquareIcon,
} from '@heroicons/react/24/outline'

type Props = {
  open: boolean
  influencerId: string | null
  onClose: () => void
}

function stat(v: number | null | undefined, suffix = '') {
  if (v === null || v === undefined) return '—'
  return `${v}${suffix}`
}

function pct(v: number | null | undefined) {
  if (v === null || v === undefined) return '—'
  return `${Number(v).toFixed(2)}%`
}

function linkLabel(url: string) {
  try {
    const u = new URL(url)
    const host = u.hostname.replace('www.', '')
    return host + (u.pathname && u.pathname !== '/' ? u.pathname : '')
  } catch {
    return url
  }
}

function safeText(v: string | null | undefined) {
  const s = (v ?? '').trim()
  return s ? s : '—'
}

function cx(...classes: Array<string | false | undefined | null>) {
  return classes.filter(Boolean).join(' ')
}

function Chip({
  icon,
  children,
}: {
  icon?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <span
      className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-extrabold"
      style={{
        borderColor: 'rgb(var(--bb-border) / 0.10)',
        backgroundColor: 'rgb(var(--bb-border) / 0.04)',
        color: 'rgb(var(--bb-muted) / 0.90)',
      }}
    >
      {icon ? <span className="opacity-80">{icon}</span> : null}
      {children}
    </span>
  )
}

function StatTile({ label, value }: { label: string; value: string }) {
  return (
    <div
      className="rounded-2xl border p-3"
      style={{
        borderColor: 'rgb(var(--bb-border) / 0.10)',
        backgroundColor: 'rgb(var(--bb-border) / 0.04)',
      }}
    >
      <p className="text-[11px] font-extrabold" style={{ color: 'rgb(var(--bb-muted) / 0.82)' }}>
        {label}
      </p>
      <p className="mt-1 text-sm font-black" style={{ color: 'rgb(var(--bb-text) / 0.92)' }}>
        {value}
      </p>
    </div>
  )
}

function SocialLink({
  href,
  label,
  sub,
}: {
  href: string
  label: string
  sub: string
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={cx(
        'group flex items-center justify-between gap-3 rounded-2xl border px-3 py-2 transition',
        'hover:-translate-y-[1px]',
      )}
      style={{
        borderColor: 'rgb(var(--bb-border) / 0.10)',
        backgroundColor: 'rgb(var(--bb-border) / 0.04)',
      }}
    >
      <div className="min-w-0">
        <p className="text-sm font-extrabold" style={{ color: 'rgb(var(--bb-text) / 0.92)' }}>
          {label}
        </p>
        <p className="mt-0.5 truncate text-xs font-semibold" style={{ color: 'rgb(var(--bb-muted) / 0.82)' }}>
          {sub}
        </p>
      </div>

      <span
        className="grid h-9 w-9 place-items-center rounded-full border transition group-hover:opacity-100"
        style={{
          borderColor: 'rgb(var(--bb-border) / 0.10)',
          backgroundColor: 'rgb(var(--bb-border) / 0.04)',
          color: 'rgb(var(--bb-text) / 0.86)',
        }}
      >
        <ArrowTopRightOnSquareIcon className="h-4 w-4" />
      </span>
    </a>
  )
}

export function ApplicantProfileModal({ open, influencerId, onClose }: Props) {
  // ✅ keep hooks always called
  const vm = useApplicantPublicProfile(open, influencerId)

  const displayName = vm.profile?.displayName ?? (vm.loading ? 'Loading…' : '—')
  const photoUrl = vm.profile?.photoUrl ?? null

  const totalFollowers = useMemo(() => {
    return (vm.profile?.followersInstagram ?? 0) + (vm.profile?.followersTiktok ?? 0) + (vm.profile?.followersYoutube ?? 0)
  }, [vm.profile?.followersInstagram, vm.profile?.followersTiktok, vm.profile?.followersYoutube])

  const location = useMemo(() => {
    return [vm.profile?.countryCode, vm.profile?.language].filter(Boolean).join(' · ') || '—'
  }, [vm.profile?.countryCode, vm.profile?.language])

  useEffect(() => {
    if (!open) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[9999] grid place-items-center bg-black/70 p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      {/* Modal shell */}
      <div
        className="bb-pop relative w-full max-w-4xl overflow-hidden rounded-[28px] border"
        style={{ borderColor: 'rgb(var(--bb-border) / 0.10)', backgroundColor: 'rgb(var(--bb-surface) / 0.88)' }}
      >
        <div className="pointer-events-none absolute inset-0 bb-noise" />
        <div className="pointer-events-none absolute inset-0 bb-spotlight opacity-70" />

        {/* Header */}
        <div className="relative border-b px-4 py-4 sm:px-5"
             style={{ borderColor: 'rgb(var(--bb-border) / 0.10)' }}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div
                className="relative h-12 w-12 overflow-hidden rounded-2xl border"
                style={{
                  borderColor: 'rgb(var(--bb-border) / 0.10)',
                  backgroundColor: 'rgb(var(--bb-border) / 0.04)',
                }}
              >
                {photoUrl ? <img src={photoUrl} alt="" className="h-full w-full object-cover" /> : null}
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <Chip icon={<SparklesIcon className="h-3.5 w-3.5" />}>Influencer</Chip>
                  {safeText(vm.profile?.niche) !== '—' ? <Chip>{safeText(vm.profile?.niche)}</Chip> : null}
                </div>

                <p className="mt-2 truncate text-base font-black" style={{ color: 'rgb(var(--bb-text) / 0.96)' }}>
                  {displayName}
                </p>
                <p className="mt-0.5 truncate text-xs font-semibold" style={{ color: 'rgb(var(--bb-muted) / 0.82)' }}>
                  {vm.profile?.id ?? influencerId ?? ''}
                </p>
              </div>
            </div>

            <button type="button" onClick={onClose} className="bb-icon-btn h-11 w-11" aria-label="Close">
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Chip icon={<MapPinIcon className="h-3.5 w-3.5" />}>{safeText(vm.profile?.countryCode)}</Chip>
            <Chip icon={<LanguageIcon className="h-3.5 w-3.5" />}>{safeText(vm.profile?.language)}</Chip>
            <Chip icon={<UsersIcon className="h-3.5 w-3.5" />}>{stat(totalFollowers)}</Chip>
            <Chip icon={<ChartBarIcon className="h-3.5 w-3.5" />}>{pct(vm.profile?.avgEngagementRate)}</Chip>
          </div>
        </div>

        {/* Body */}
        <div className="relative max-h-[72vh] overflow-y-auto p-4 sm:p-5 bb-soft-scroll">
          {vm.error ? (
            <div className="rounded-2xl border border-rose-500/25 bg-rose-500/10 p-4 text-sm font-semibold text-rose-100">
              {vm.error}
            </div>
          ) : null}

          {vm.loading ? (
            <div className="space-y-4">
              <div className="h-28 rounded-2xl border" style={{ borderColor: 'rgb(var(--bb-border) / 0.10)', backgroundColor: 'rgb(var(--bb-border) / 0.04)' }} />
              <div className="h-44 rounded-2xl border" style={{ borderColor: 'rgb(var(--bb-border) / 0.10)', backgroundColor: 'rgb(var(--bb-border) / 0.04)' }} />
              <div className="h-28 rounded-2xl border" style={{ borderColor: 'rgb(var(--bb-border) / 0.10)', backgroundColor: 'rgb(var(--bb-border) / 0.04)' }} />
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
              {/* Left: Stats */}
              <div className="lg:col-span-5 space-y-4">
                <div className="bb-card p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs font-extrabold uppercase tracking-wider" style={{ color: 'rgb(var(--bb-muted) / 0.82)' }}>
                      Stats
                    </p>
                    <span
                      className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-extrabold"
                      style={{
                        borderColor: 'rgb(var(--bb-border) / 0.10)',
                        backgroundColor: 'rgb(var(--bb-border) / 0.04)',
                        color: 'rgb(var(--bb-muted) / 0.90)',
                      }}
                    >
                      <UsersIcon className="h-3.5 w-3.5" />
                      {stat(totalFollowers)}
                    </span>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <StatTile label="IG Followers" value={stat(vm.profile?.followersInstagram)} />
                    <StatTile label="TikTok Followers" value={stat(vm.profile?.followersTiktok)} />
                    <StatTile label="YouTube Followers" value={stat(vm.profile?.followersYoutube)} />
                    <StatTile label="Avg Engagement" value={pct(vm.profile?.avgEngagementRate)} />
                  </div>
                </div>

                <div className="bb-card p-4">
                  <p className="text-xs font-extrabold uppercase tracking-wider" style={{ color: 'rgb(var(--bb-muted) / 0.82)' }}>
                    Links
                  </p>

                  <div className="mt-3 space-y-2">
                    {vm.profile?.instagramUrl ? (
                      <SocialLink href={vm.profile.instagramUrl} label="Instagram" sub={linkLabel(vm.profile.instagramUrl)} />
                    ) : null}
                    {vm.profile?.tiktokUrl ? (
                      <SocialLink href={vm.profile.tiktokUrl} label="TikTok" sub={linkLabel(vm.profile.tiktokUrl)} />
                    ) : null}
                    {vm.profile?.youtubeUrl ? (
                      <SocialLink href={vm.profile.youtubeUrl} label="YouTube" sub={linkLabel(vm.profile.youtubeUrl)} />
                    ) : null}
                    {vm.profile?.mediaKitUrl ? (
                      <SocialLink href={vm.profile.mediaKitUrl} label="Media kit" sub={linkLabel(vm.profile.mediaKitUrl)} />
                    ) : null}

                    {!vm.profile?.instagramUrl && !vm.profile?.tiktokUrl && !vm.profile?.youtubeUrl && !vm.profile?.mediaKitUrl ? (
                      <div
                        className="flex items-center gap-2 rounded-2xl border p-3 text-sm font-semibold"
                        style={{
                          borderColor: 'rgb(var(--bb-border) / 0.10)',
                          backgroundColor: 'rgb(var(--bb-border) / 0.04)',
                          color: 'rgb(var(--bb-muted) / 0.85)',
                        }}
                      >
                        <LinkIcon className="h-5 w-5 opacity-80" />
                        —
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>

              {/* Right: Profile */}
              <div className="lg:col-span-7 space-y-4">
                <div className="bb-card p-4">
                  <p className="text-xs font-extrabold uppercase tracking-wider" style={{ color: 'rgb(var(--bb-muted) / 0.82)' }}>
                    Profile
                  </p>

                  <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
                    <StatTile label="Niche" value={safeText(vm.profile?.niche)} />
                    <StatTile label="Country" value={safeText(vm.profile?.countryCode)} />
                    <StatTile label="Language" value={safeText(vm.profile?.language)} />
                    <StatTile label="Engagement" value={pct(vm.profile?.avgEngagementRate)} />
                  </div>
                </div>

                <div className="bb-card p-4">
                  <p className="text-xs font-extrabold uppercase tracking-wider" style={{ color: 'rgb(var(--bb-muted) / 0.82)' }}>
                    Notes
                  </p>
                  <p className="mt-3 text-sm font-semibold leading-6" style={{ color: 'rgb(var(--bb-muted) / 0.90)' }}>
                    After you finalize a candidate, collaboration starts automatically (tracking link + promo code).
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className="relative flex items-center justify-between gap-3 border-t px-4 py-3 sm:px-5"
          style={{ borderColor: 'rgb(var(--bb-border) / 0.10)', backgroundColor: 'rgb(var(--bb-surface) / 0.55)' }}
        >
          <p className="text-xs font-semibold" style={{ color: 'rgb(var(--bb-muted) / 0.82)' }}>
            Tip: press <span className="font-extrabold" style={{ color: 'rgb(var(--bb-text) / 0.92)' }}>Esc</span> to close
          </p>

          <button onClick={onClose} className="bb-btn-primary h-10 px-5" type="button">
            Close
          </button>
        </div>
      </div>
    </div>
  )
}