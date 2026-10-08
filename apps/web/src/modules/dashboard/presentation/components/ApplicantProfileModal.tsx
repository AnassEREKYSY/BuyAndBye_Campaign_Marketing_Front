import { useEffect, useMemo } from 'react'
import { useApplicantPublicProfile } from '@/modules/dashboard/application/hooks/useApplicantPublicProfile'
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline'
import { Modal, Skeleton, formatNumber } from '@/shared/components/ui'

type Props = {
  open: boolean
  influencerId: string | null
  onClose: () => void
}

function followers(v: number | null | undefined) {
  if (v === null || v === undefined) return '—'
  return formatNumber(v)
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

function Tile({ label, value }: { label: string; value: string }) {
  return (
    <div className="bb-soft-box p-3">
      <p className="text-xs text-bb-muted">{label}</p>
      <p className="mt-1 font-semibold tabular-nums">{value}</p>
    </div>
  )
}

function SocialLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="flex items-center justify-between gap-3 rounded-[10px] border border-bb-border/10 px-3 py-2 transition-colors hover:bg-bb-subtle"
    >
      <span className="min-w-0">
        <span className="block text-sm font-medium">{label}</span>
        <span className="block truncate text-xs text-bb-muted">{linkLabel(href)}</span>
      </span>
      <ArrowTopRightOnSquareIcon className="h-4 w-4 shrink-0 text-bb-muted" />
    </a>
  )
}

export function ApplicantProfileModal({ open, influencerId, onClose }: Props) {
  // keep hooks always called
  const vm = useApplicantPublicProfile(open, influencerId)

  const displayName = vm.profile?.displayName ?? (vm.loading ? 'Loading…' : 'Creator')
  const photoUrl = vm.profile?.photoUrl ?? null

  const totalFollowers = useMemo(() => {
    return (vm.profile?.followersInstagram ?? 0) + (vm.profile?.followersTiktok ?? 0) + (vm.profile?.followersYoutube ?? 0)
  }, [vm.profile?.followersInstagram, vm.profile?.followersTiktok, vm.profile?.followersYoutube])

  useEffect(() => {
    if (!open) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  const p = vm.profile
  const hasLinks = !!(p?.instagramUrl || p?.tiktokUrl || p?.youtubeUrl || p?.mediaKitUrl)
  const meta = [p?.niche, p?.countryCode, p?.language].map((x) => (x ?? '').trim()).filter(Boolean).join(' · ')

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Creator profile"
      width="max-w-2xl"
      footer={
        <button onClick={onClose} className="bb-btn-ghost" type="button">
          Close
        </button>
      }
    >
      <div className="flex items-center gap-3">
        <span className="bb-avatar h-12 w-12 text-base">{photoUrl ? <img src={photoUrl} alt="" className="h-full w-full object-cover" /> : displayName.charAt(0).toUpperCase()}</span>
        <div className="min-w-0">
          <p className="truncate text-base font-semibold">{displayName}</p>
          <p className="mt-0.5 truncate text-sm text-bb-muted">{meta || '—'}</p>
        </div>
      </div>

      {vm.error ? <div className="bb-soft-box mt-4 border-bb-accent/30 bg-bb-accent-soft p-3 text-sm text-bb-accent-strong">{vm.error}</div> : null}

      {vm.loading ? (
        <div className="mt-5 grid gap-3">
          <Skeleton className="h-20" />
          <Skeleton className="h-28" />
        </div>
      ) : (
        <>
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
            <Tile label="Total followers" value={followers(totalFollowers)} />
            <Tile label="Avg engagement" value={pct(p?.avgEngagementRate)} />
            <Tile label="Niche" value={safeText(p?.niche)} />
            <Tile label="Instagram" value={followers(p?.followersInstagram)} />
            <Tile label="TikTok" value={followers(p?.followersTiktok)} />
            <Tile label="YouTube" value={followers(p?.followersYoutube)} />
          </div>

          <div className="mt-5">
            <h3 className="text-sm font-semibold">Links</h3>
            {hasLinks ? (
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                {p?.instagramUrl ? <SocialLink href={p.instagramUrl} label="Instagram" /> : null}
                {p?.tiktokUrl ? <SocialLink href={p.tiktokUrl} label="TikTok" /> : null}
                {p?.youtubeUrl ? <SocialLink href={p.youtubeUrl} label="YouTube" /> : null}
                {p?.mediaKitUrl ? <SocialLink href={p.mediaKitUrl} label="Media kit" /> : null}
              </div>
            ) : (
              <p className="mt-1 text-sm text-bb-muted">No links shared.</p>
            )}
          </div>

          <p className="mt-5 text-xs leading-5 text-bb-muted">Accepting this creator starts the collaboration: a tracked link and a promo code are created for them.</p>
        </>
      )}
    </Modal>
  )
}
