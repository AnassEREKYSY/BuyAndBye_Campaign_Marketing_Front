// apps/web/src/modules/dashboard/presentation/components/ApplicantProfileModal.tsx
import { useEffect, useMemo, useState } from 'react'
import { DashboardContainer } from '@core/modules/dashboard'
import type { InfluencerPublicProfile } from '@core/modules/dashboard/domain/entities'
import { HttpClient } from '@core/shared/services/http/HttpClient'
import { CoreTokenStorage } from '@/shared/services/storage'
import { env } from '@/shared'

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
    return u.hostname.replace('www.', '')
  } catch {
    return url
  }
}

function safeText(v: string | null | undefined) {
  const s = (v ?? '').trim()
  return s ? s : '—'
}

export function ApplicantProfileModal({ open, influencerId, onClose }: Props) {
  const tokenStorage = useMemo(() => new CoreTokenStorage(), [])
  const httpClient = useMemo(() => new HttpClient(env.BACKEND_BASE_URL, tokenStorage), [tokenStorage])
  const container = useMemo(() => DashboardContainer.getInstance(httpClient), [httpClient])

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [profile, setProfile] = useState<InfluencerPublicProfile | null>(null)

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (open) window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  useEffect(() => {
    let mounted = true

    async function run() {
      if (!open || !influencerId) return
      setLoading(true)
      setError(null)
      setProfile(null)

      try {
        const p = await container.getInfluencerPublicProfileUseCase.execute(influencerId)
        if (!mounted) return
        setProfile(p)
      } catch (e: any) {
        if (!mounted) return
        setError(e?.message ?? 'Failed to load influencer profile.')
      } finally {
        if (!mounted) return
        setLoading(false)
      }
    }

    void run()
    return () => {
      mounted = false
    }
  }, [open, influencerId, container])

  if (!open) return null

  const displayName = profile?.displayName ?? (loading ? 'Loading…' : '—')
  const photoUrl = profile?.photoUrl ?? null

  const totalFollowers =
    (profile?.followersInstagram ?? 0) + (profile?.followersTiktok ?? 0) + (profile?.followersYoutube ?? 0)

  const location = [profile?.countryCode, profile?.language].filter(Boolean).join(' · ') || '—'

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="w-full max-w-5xl overflow-hidden rounded-[28px] border bb-soft-scroll"
           style={{ borderColor: 'rgb(var(--bb-border) / 0.10)', backgroundColor: 'rgb(var(--bb-card) / 0.92)' }}
      >
        <div className="relative border-b" style={{ borderColor: 'rgb(var(--bb-border) / 0.10)' }}>
          <div className="h-24 w-full bb-spotlight" />

          <div className="absolute inset-x-0 top-0 flex items-start justify-between p-4">
            <div className="flex items-center gap-3">
              <div
                className="h-12 w-12 overflow-hidden rounded-2xl border"
                style={{
                  borderColor: 'rgb(var(--bb-border) / 0.10)',
                  backgroundColor: 'rgb(var(--bb-border) / 0.04)',
                }}
              >
                {photoUrl ? <img src={photoUrl} alt="" className="h-full w-full object-cover" /> : null}
              </div>

              <div className="min-w-0">
                <p className="truncate text-base font-black" style={{ color: 'rgb(var(--bb-text) / 0.96)' }}>
                  {displayName}
                </p>
                <p className="mt-0.5 truncate text-xs font-semibold" style={{ color: 'rgb(var(--bb-muted) / 0.82)' }}>
                  {profile?.id ?? influencerId ?? ''}
                </p>
              </div>
            </div>

            <button onClick={onClose} className="bb-btn-ghost h-10 px-4">
              Close
            </button>
          </div>

          <div className="px-4 pb-4 pt-16">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className="rounded-full border px-3 py-1 text-[11px] font-extrabold"
                style={{
                  borderColor: 'rgb(var(--bb-border) / 0.10)',
                  backgroundColor: 'rgb(var(--bb-border) / 0.04)',
                  color: 'rgb(var(--bb-muted) / 0.90)',
                }}
              >
                Influencer profile
              </span>

              <span
                className="rounded-full border px-3 py-1 text-[11px] font-extrabold"
                style={{
                  borderColor: 'rgb(var(--bb-border) / 0.10)',
                  backgroundColor: 'rgb(var(--bb-border) / 0.04)',
                  color: 'rgb(var(--bb-muted) / 0.90)',
                }}
              >
                {safeText(profile?.niche)}
              </span>

              <span
                className="rounded-full border px-3 py-1 text-[11px] font-extrabold"
                style={{
                  borderColor: 'rgb(var(--bb-border) / 0.10)',
                  backgroundColor: 'rgb(var(--bb-border) / 0.04)',
                  color: 'rgb(var(--bb-muted) / 0.90)',
                }}
              >
                {location}
              </span>
            </div>
          </div>
        </div>

        <div className="max-h-[78vh] overflow-y-auto p-4 bb-soft-scroll">
          {error ? (
            <div className="rounded-2xl border border-rose-500/25 bg-rose-500/10 p-4 text-sm font-semibold text-rose-100">
              {error}
            </div>
          ) : null}

          {loading ? (
            <div className="space-y-4">
              <div className="h-28 rounded-2xl border" style={{ borderColor: 'rgb(var(--bb-border) / 0.10)', backgroundColor: 'rgb(var(--bb-border) / 0.04)' }} />
              <div className="h-40 rounded-2xl border" style={{ borderColor: 'rgb(var(--bb-border) / 0.10)', backgroundColor: 'rgb(var(--bb-border) / 0.04)' }} />
              <div className="h-28 rounded-2xl border" style={{ borderColor: 'rgb(var(--bb-border) / 0.10)', backgroundColor: 'rgb(var(--bb-border) / 0.04)' }} />
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
              <div className="lg:col-span-5 space-y-4">
                <div className="bb-card p-4">
                  <p className="text-xs font-extrabold uppercase tracking-wider" style={{ color: 'rgb(var(--bb-muted) / 0.82)' }}>
                    Stats
                  </p>

                  <div className="mt-3 grid grid-cols-2 gap-3">
                    {[
                      { k: 'Total Followers', v: stat(Number.isFinite(totalFollowers) ? totalFollowers : null) },
                      { k: 'Avg Engagement', v: pct(profile?.avgEngagementRate) },
                      { k: 'IG Followers', v: stat(profile?.followersInstagram) },
                      { k: 'TikTok Followers', v: stat(profile?.followersTiktok) },
                      { k: 'YouTube Followers', v: stat(profile?.followersYoutube) },
                      { k: 'Language', v: safeText(profile?.language) },
                    ].map((x) => (
                      <div
                        key={x.k}
                        className="rounded-2xl border p-3"
                        style={{
                          borderColor: 'rgb(var(--bb-border) / 0.10)',
                          backgroundColor: 'rgb(var(--bb-border) / 0.04)',
                        }}
                      >
                        <p className="text-[11px] font-extrabold" style={{ color: 'rgb(var(--bb-muted) / 0.82)' }}>
                          {x.k}
                        </p>
                        <p className="mt-1 text-sm font-black" style={{ color: 'rgb(var(--bb-text) / 0.92)' }}>
                          {x.v}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bb-card p-4">
                  <p className="text-xs font-extrabold uppercase tracking-wider" style={{ color: 'rgb(var(--bb-muted) / 0.82)' }}>
                    Links
                  </p>

                  <div className="mt-3 space-y-2 text-sm">
                    {profile?.instagramUrl ? (
                      <a
                        className="block rounded-xl border px-3 py-2 font-extrabold underline underline-offset-4"
                        style={{
                          borderColor: 'rgb(var(--bb-border) / 0.10)',
                          backgroundColor: 'rgb(var(--bb-border) / 0.04)',
                          color: 'rgb(var(--bb-text) / 0.86)',
                          textDecorationColor: 'rgb(var(--bb-border) / 0.25)',
                        }}
                        href={profile.instagramUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Instagram · {linkLabel(profile.instagramUrl)}
                      </a>
                    ) : null}

                    {profile?.tiktokUrl ? (
                      <a
                        className="block rounded-xl border px-3 py-2 font-extrabold underline underline-offset-4"
                        style={{
                          borderColor: 'rgb(var(--bb-border) / 0.10)',
                          backgroundColor: 'rgb(var(--bb-border) / 0.04)',
                          color: 'rgb(var(--bb-text) / 0.86)',
                          textDecorationColor: 'rgb(var(--bb-border) / 0.25)',
                        }}
                        href={profile.tiktokUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        TikTok · {linkLabel(profile.tiktokUrl)}
                      </a>
                    ) : null}

                    {profile?.youtubeUrl ? (
                      <a
                        className="block rounded-xl border px-3 py-2 font-extrabold underline underline-offset-4"
                        style={{
                          borderColor: 'rgb(var(--bb-border) / 0.10)',
                          backgroundColor: 'rgb(var(--bb-border) / 0.04)',
                          color: 'rgb(var(--bb-text) / 0.86)',
                          textDecorationColor: 'rgb(var(--bb-border) / 0.25)',
                        }}
                        href={profile.youtubeUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        YouTube · {linkLabel(profile.youtubeUrl)}
                      </a>
                    ) : null}

                    {profile?.mediaKitUrl ? (
                      <a
                        className="block rounded-xl border px-3 py-2 font-extrabold underline underline-offset-4"
                        style={{
                          borderColor: 'rgb(var(--bb-border) / 0.10)',
                          backgroundColor: 'rgb(var(--bb-border) / 0.04)',
                          color: 'rgb(var(--bb-text) / 0.86)',
                          textDecorationColor: 'rgb(var(--bb-border) / 0.25)',
                        }}
                        href={profile.mediaKitUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Media Kit · {linkLabel(profile.mediaKitUrl)}
                      </a>
                    ) : null}

                    {!profile?.instagramUrl && !profile?.tiktokUrl && !profile?.youtubeUrl && !profile?.mediaKitUrl ? (
                      <p className="text-sm font-semibold" style={{ color: 'rgb(var(--bb-muted) / 0.85)' }}>
                        —
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7 space-y-4">
                <div className="bb-card p-4">
                  <p className="text-xs font-extrabold uppercase tracking-wider" style={{ color: 'rgb(var(--bb-muted) / 0.82)' }}>
                    Profile
                  </p>

                  <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
                    {[
                      { k: 'Niche', v: safeText(profile?.niche) },
                      { k: 'Country', v: safeText(profile?.countryCode) },
                      { k: 'Language', v: safeText(profile?.language) },
                      { k: 'Avg Engagement Rate', v: pct(profile?.avgEngagementRate) },
                    ].map((x) => (
                      <div
                        key={x.k}
                        className="rounded-2xl border p-3"
                        style={{
                          borderColor: 'rgb(var(--bb-border) / 0.10)',
                          backgroundColor: 'rgb(var(--bb-border) / 0.04)',
                        }}
                      >
                        <p className="text-[11px] font-extrabold" style={{ color: 'rgb(var(--bb-muted) / 0.82)' }}>
                          {x.k}
                        </p>
                        <p className="mt-1 text-sm font-extrabold" style={{ color: 'rgb(var(--bb-text) / 0.92)' }}>
                          {x.v}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bb-card p-4">
                  <p className="text-xs font-extrabold uppercase tracking-wider" style={{ color: 'rgb(var(--bb-muted) / 0.82)' }}>
                    Notes
                  </p>
                  <p className="mt-3 text-sm font-semibold" style={{ color: 'rgb(var(--bb-muted) / 0.90)' }}>
                    After you finalize a candidate, collaboration starts automatically (tracking link + promo code). Payouts follow your existing endpoints.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-t p-4"
             style={{ borderColor: 'rgb(var(--bb-border) / 0.10)', backgroundColor: 'rgb(var(--bb-surface) / 0.55)' }}
        >
          <p className="text-xs font-semibold" style={{ color: 'rgb(var(--bb-muted) / 0.82)' }}>
            Tip: press <span style={{ color: 'rgb(var(--bb-text) / 0.92)' }} className="font-extrabold">Esc</span> to close
          </p>
          <button onClick={onClose} className="bb-btn-primary h-10 px-5">
            Close
          </button>
        </div>
      </div>
    </div>
  )
}