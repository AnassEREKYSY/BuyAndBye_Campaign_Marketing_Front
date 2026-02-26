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
      <div className="w-full max-w-5xl overflow-hidden rounded-[28px] border border-white/10 bg-[#0e0f12] text-white shadow-2xl">
        <div className="relative border-b border-white/10">
          <div className="h-24 w-full bg-gradient-to-r from-white/10 via-white/5 to-white/10" />

          <div className="absolute inset-x-0 top-0 flex items-start justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                {photoUrl ? <img src={photoUrl} className="h-full w-full object-cover" /> : null}
              </div>
              <div className="min-w-0">
                <p className="truncate text-base font-black">{displayName}</p>
                <p className="mt-0.5 truncate text-xs font-semibold text-white/55">{profile?.id ?? influencerId ?? ''}</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-extrabold text-white/90 hover:bg-white/10"
            >
              Close
            </button>
          </div>

          <div className="px-4 pb-4 pt-16">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-extrabold text-white/75">
                Influencer profile
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-extrabold text-white/60">
                {safeText(profile?.niche)}
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-extrabold text-white/60">
                {location}
              </span>
            </div>
          </div>
        </div>

        <div className="max-h-[78vh] overflow-y-auto p-4">
          {error ? (
            <div className="rounded-2xl border border-rose-500/25 bg-rose-500/10 p-4 text-sm font-semibold text-rose-100">
              {error}
            </div>
          ) : null}

          {loading ? (
            <div className="space-y-4">
              <div className="h-28 rounded-2xl border border-white/10 bg-white/5" />
              <div className="h-40 rounded-2xl border border-white/10 bg-white/5" />
              <div className="h-28 rounded-2xl border border-white/10 bg-white/5" />
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
              <div className="lg:col-span-5 space-y-4">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs font-extrabold uppercase tracking-wider text-white/50">Stats</p>

                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <div className="rounded-2xl border border-white/10 bg-[#0e0f12] p-3">
                      <p className="text-[11px] font-extrabold text-white/55">Total Followers</p>
                      <p className="mt-1 text-sm font-black">{stat(Number.isFinite(totalFollowers) ? totalFollowers : null)}</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-[#0e0f12] p-3">
                      <p className="text-[11px] font-extrabold text-white/55">Avg Engagement</p>
                      <p className="mt-1 text-sm font-black">{pct(profile?.avgEngagementRate)}</p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-[#0e0f12] p-3">
                      <p className="text-[11px] font-extrabold text-white/55">IG Followers</p>
                      <p className="mt-1 text-sm font-black">{stat(profile?.followersInstagram)}</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-[#0e0f12] p-3">
                      <p className="text-[11px] font-extrabold text-white/55">TikTok Followers</p>
                      <p className="mt-1 text-sm font-black">{stat(profile?.followersTiktok)}</p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-[#0e0f12] p-3">
                      <p className="text-[11px] font-extrabold text-white/55">YouTube Followers</p>
                      <p className="mt-1 text-sm font-black">{stat(profile?.followersYoutube)}</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-[#0e0f12] p-3">
                      <p className="text-[11px] font-extrabold text-white/55">Language</p>
                      <p className="mt-1 text-sm font-black">{safeText(profile?.language)}</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs font-extrabold uppercase tracking-wider text-white/50">Links</p>

                  <div className="mt-3 space-y-2 text-sm">
                    {profile?.instagramUrl ? (
                      <a
                        className="block rounded-xl border border-white/10 bg-[#0e0f12] px-3 py-2 font-extrabold text-sky-200 hover:text-white"
                        href={profile.instagramUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Instagram · {linkLabel(profile.instagramUrl)}
                      </a>
                    ) : null}

                    {profile?.tiktokUrl ? (
                      <a
                        className="block rounded-xl border border-white/10 bg-[#0e0f12] px-3 py-2 font-extrabold text-sky-200 hover:text-white"
                        href={profile.tiktokUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        TikTok · {linkLabel(profile.tiktokUrl)}
                      </a>
                    ) : null}

                    {profile?.youtubeUrl ? (
                      <a
                        className="block rounded-xl border border-white/10 bg-[#0e0f12] px-3 py-2 font-extrabold text-sky-200 hover:text-white"
                        href={profile.youtubeUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        YouTube · {linkLabel(profile.youtubeUrl)}
                      </a>
                    ) : null}

                    {profile?.mediaKitUrl ? (
                      <a
                        className="block rounded-xl border border-white/10 bg-[#0e0f12] px-3 py-2 font-extrabold text-sky-200 hover:text-white"
                        href={profile.mediaKitUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Media Kit · {linkLabel(profile.mediaKitUrl)}
                      </a>
                    ) : null}

                    {!profile?.instagramUrl && !profile?.tiktokUrl && !profile?.youtubeUrl && !profile?.mediaKitUrl ? (
                      <p className="text-sm font-semibold text-white/50">—</p>
                    ) : null}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7 space-y-4">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs font-extrabold uppercase tracking-wider text-white/50">Profile</p>

                  <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
                    <div className="rounded-2xl border border-white/10 bg-[#0e0f12] p-3">
                      <p className="text-[11px] font-extrabold text-white/55">Niche</p>
                      <p className="mt-1 text-sm font-extrabold">{safeText(profile?.niche)}</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-[#0e0f12] p-3">
                      <p className="text-[11px] font-extrabold text-white/55">Country</p>
                      <p className="mt-1 text-sm font-extrabold">{safeText(profile?.countryCode)}</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-[#0e0f12] p-3">
                      <p className="text-[11px] font-extrabold text-white/55">Language</p>
                      <p className="mt-1 text-sm font-extrabold">{safeText(profile?.language)}</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-[#0e0f12] p-3">
                      <p className="text-[11px] font-extrabold text-white/55">Avg Engagement Rate</p>
                      <p className="mt-1 text-sm font-extrabold">{pct(profile?.avgEngagementRate)}</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs font-extrabold uppercase tracking-wider text-white/50">Notes</p>
                  <p className="mt-3 text-sm font-semibold text-white/75">
                    After you finalize a candidate, collaboration starts automatically (tracking link + promo code) and payouts are handled by your existing endpoints.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-white/10 bg-[#0e0f12] p-4">
          <p className="text-xs font-semibold text-white/50">
            Tip: press <span className="font-extrabold text-white/70">Esc</span> to close
          </p>
          <button
            onClick={onClose}
            className="rounded-full border border-white/10 bg-white/5 px-5 py-2 text-xs font-extrabold text-white/90 hover:bg-white/10"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}