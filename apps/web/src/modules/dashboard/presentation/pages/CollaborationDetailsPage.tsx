import { Link, useParams } from 'react-router-dom'
import { useMemo } from 'react'
import { useCollaborationDetails } from '@/modules/dashboard/application/hooks/useCollaborationDetails'
import {
  ArrowLeftIcon,
  Squares2X2Icon,
  LinkIcon,
  TicketIcon,
  TagIcon,
  UserGroupIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ShieldCheckIcon,
  ChevronRightIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline'

function fmtDate(iso?: string | null) {
  if (!iso) return '—'
  return iso.slice(0, 10)
}

function statusStyle(status?: string) {
  const s = (status ?? '').toLowerCase()
  if (s === 'active') return { label: 'Active', border: 'rgb(16 185 129 / 0.25)', bg: 'rgb(16 185 129 / 0.10)', text: 'rgb(110 231 183 / 0.95)', dot: 'bg-emerald-300/90', icon: <CheckCircleIcon className="h-4 w-4" /> }
  if (s === 'closed') return { label: 'Closed', border: 'rgb(148 163 184 / 0.22)', bg: 'rgb(148 163 184 / 0.10)', text: 'rgb(226 232 240 / 0.92)', dot: 'bg-slate-300/80', icon: <ClockIcon className="h-4 w-4" /> }
  if (s === 'cancelled') return { label: 'Cancelled', border: 'rgb(244 63 94 / 0.25)', bg: 'rgb(244 63 94 / 0.10)', text: 'rgb(253 164 175 / 0.95)', dot: 'bg-rose-300/90', icon: <XCircleIcon className="h-4 w-4" /> }
  return { label: status ?? '—', border: 'rgb(var(--bb-border) / 0.10)', bg: 'rgb(var(--bb-border) / 0.04)', text: 'rgb(var(--bb-muted) / 0.90)', dot: 'bg-white/35', icon: <SparklesIcon className="h-4 w-4" /> }
}

function TopPill({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-extrabold"
      style={{
        borderColor: 'rgb(var(--bb-border) / 0.10)',
        backgroundColor: 'rgb(var(--bb-border) / 0.04)',
        color: 'rgb(var(--bb-muted) / 0.90)',
      }}
    >
      {children}
    </span>
  )
}

function ActionPill({
  to,
  icon,
  label,
  kind = 'ghost',
}: {
  to: string
  icon: React.ReactNode
  label: string
  kind?: 'ghost' | 'primary'
}) {
  const cls = kind === 'primary' ? 'bb-btn-primary h-11 px-4' : 'bb-btn-ghost h-11 px-4'
  return (
    <Link to={to} className={cls} aria-label={label}>
      <span className="inline-flex items-center gap-2">
        <span
          className="grid h-9 w-9 place-items-center rounded-full border"
          style={{
            borderColor: kind === 'primary' ? 'rgb(255 255 255 / 0.18)' : 'rgb(var(--bb-border) / 0.10)',
            backgroundColor: kind === 'primary' ? 'rgb(255 255 255 / 0.10)' : 'rgb(var(--bb-border) / 0.04)',
          }}
        >
          {icon}
        </span>
        <span className="hidden sm:inline text-sm font-extrabold">{label}</span>
      </span>
    </Link>
  )
}

function SoftBox({
  title,
  icon,
  children,
  right,
}: {
  title: string
  icon?: React.ReactNode
  children: React.ReactNode
  right?: React.ReactNode
}) {
  return (
    <div
      className="rounded-[22px] border p-4"
      style={{
        borderColor: 'rgb(var(--bb-border) / 0.10)',
        backgroundColor: 'rgb(var(--bb-border) / 0.04)',
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          {icon ? <span className="bb-stat-icon h-9 w-9">{icon}</span> : null}
          <p className="text-xs font-extrabold uppercase tracking-wider" style={{ color: 'rgb(var(--bb-muted) / 0.82)' }}>
            {title}
          </p>
        </div>
        {right ? <div className="shrink-0">{right}</div> : null}
      </div>

      <div className="mt-3">{children}</div>
    </div>
  )
}

function PersonRow({
  label,
  name,
  id,
  photoUrl,
}: {
  label: string
  name: string
  id: string
  photoUrl?: string | null
}) {
  return (
    <div
      className="flex items-center gap-3 rounded-2xl border p-4"
      style={{
        borderColor: 'rgb(var(--bb-border) / 0.10)',
        backgroundColor: 'rgb(var(--bb-border) / 0.04)',
      }}
    >
      <div
        className="h-10 w-10 overflow-hidden rounded-2xl border"
        style={{
          borderColor: 'rgb(var(--bb-border) / 0.10)',
          backgroundColor: 'rgb(var(--bb-border) / 0.04)',
        }}
      >
        {photoUrl ? <img src={photoUrl} alt="" className="h-full w-full object-cover" /> : null}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-xs font-extrabold uppercase tracking-wider" style={{ color: 'rgb(var(--bb-muted) / 0.82)' }}>
          {label}
        </p>
        <p className="mt-1 truncate text-sm font-extrabold" style={{ color: 'rgb(var(--bb-text) / 0.92)' }}>
          {name}
        </p>
        <p className="mt-1 truncate text-xs font-semibold" style={{ color: 'rgb(var(--bb-muted) / 0.82)' }}>
          {id}
        </p>
      </div>

      <span
        className="rounded-full border px-3 py-1 text-[11px] font-extrabold"
        style={{
          borderColor: 'rgb(var(--bb-border) / 0.10)',
          backgroundColor: 'rgb(var(--bb-border) / 0.04)',
          color: 'rgb(var(--bb-muted) / 0.90)',
        }}
      >
        Profile
      </span>
    </div>
  )
}

export default function CollaborationDetailsPage() {
  const { id } = useParams()
  const { loading, error, item } = useCollaborationDetails(id ?? null)

  const st = useMemo(() => statusStyle(item?.status), [item?.status])

  return (
    <div className="bb-page px-4 py-6 md:px-6">
      {/* TOP (REDESIGNED) */}
      <section
        className="bb-pop relative overflow-hidden rounded-3xl border p-5 sm:p-6"
        style={{
          borderColor: 'rgb(var(--bb-border) / 0.10)',
          backgroundColor: 'rgb(var(--bb-surface) / 0.84)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <div className="pointer-events-none absolute inset-0 bb-spotlight" />
        <div className="pointer-events-none absolute inset-0 bb-grid" />
        <div className="pointer-events-none absolute inset-0 bb-noise" />

        <div className="relative">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <TopPill>
                  <span className={`h-2 w-2 rounded-full ${st.dot}`} style={{ boxShadow: '0 0 18px rgb(255 255 255 / 0.12)' }} />
                  {st.label}
                </TopPill>

                <TopPill>
                  <SparklesIcon className="h-4 w-4" />
                  Collaboration
                </TopPill>

                <TopPill>
                  <ShieldCheckIcon className="h-4 w-4" />
                  Tracking enabled
                </TopPill>
              </div>

              <h1 className="mt-3 text-2xl font-black tracking-tight sm:text-3xl" style={{ color: 'rgb(var(--bb-text) / 0.98)' }}>
                {loading ? 'Loading…' : item?.campaign?.title ?? 'Collaboration'}
              </h1>

              <p className="mt-2 max-w-3xl text-sm font-semibold leading-6" style={{ color: 'rgb(var(--bb-muted) / 0.92)' }}>
                Promo code, tracking link, participants and status — all in one place.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-start gap-2 lg:justify-end">
              <ActionPill to="/collaborations" label="Back" icon={<ArrowLeftIcon className="h-5 w-5" />} />
              <ActionPill to="/dashboard" label="Dashboard" icon={<Squares2X2Icon className="h-5 w-5" />} />
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div
              className="flex items-center gap-3 rounded-2xl border px-4 py-3"
              style={{
                borderColor: 'rgb(var(--bb-border) / 0.10)',
                backgroundColor: 'rgb(var(--bb-border) / 0.04)',
              }}
            >
              <span
                className="grid h-10 w-10 place-items-center rounded-2xl border"
                style={{
                  borderColor: 'rgb(var(--bb-border) / 0.10)',
                  backgroundColor: 'rgb(var(--bb-border) / 0.04)',
                  color: 'rgb(var(--bb-text) / 0.90)',
                }}
              >
                <TicketIcon className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <p className="text-[11px] font-extrabold tracking-wide" style={{ color: 'rgb(var(--bb-muted) / 0.82)' }}>
                  Promo code
                </p>
                <p className="mt-0.5 truncate text-sm font-extrabold" style={{ color: 'rgb(var(--bb-text) / 0.92)' }}>
                  {item?.promo?.code ?? '—'}
                </p>
              </div>
            </div>

            <div
              className="flex items-center gap-3 rounded-2xl border px-4 py-3"
              style={{
                borderColor: 'rgb(var(--bb-border) / 0.10)',
                backgroundColor: 'rgb(var(--bb-border) / 0.04)',
              }}
            >
              <span
                className="grid h-10 w-10 place-items-center rounded-2xl border"
                style={{
                  borderColor: 'rgb(var(--bb-border) / 0.10)',
                  backgroundColor: 'rgb(var(--bb-border) / 0.04)',
                  color: 'rgb(var(--bb-text) / 0.90)',
                }}
              >
                <TagIcon className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <p className="text-[11px] font-extrabold tracking-wide" style={{ color: 'rgb(var(--bb-muted) / 0.82)' }}>
                  Tracking code
                </p>
                <p className="mt-0.5 truncate text-sm font-extrabold" style={{ color: 'rgb(var(--bb-text) / 0.92)' }}>
                  {item?.tracking?.code ?? '—'}
                </p>
              </div>
            </div>

            <div
              className="flex items-center gap-3 rounded-2xl border px-4 py-3"
              style={{
                borderColor: st.border,
                backgroundColor: st.bg,
              }}
            >
              <span
                className="grid h-10 w-10 place-items-center rounded-2xl border"
                style={{
                  borderColor: st.border,
                  backgroundColor: 'rgb(var(--bb-border) / 0.04)',
                  color: st.text,
                }}
              >
                {st.icon}
              </span>
              <div className="min-w-0">
                <p className="text-[11px] font-extrabold tracking-wide" style={{ color: 'rgb(var(--bb-muted) / 0.86)' }}>
                  Status
                </p>
                <p className="mt-0.5 truncate text-sm font-extrabold" style={{ color: st.text }}>
                  {item?.status ?? '—'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {error ? (
        <div className="mt-5">
          <div
            className="bb-pop rounded-3xl border p-4 text-sm font-semibold"
            style={{ borderColor: 'rgb(244 63 94 / 0.25)', backgroundColor: 'rgb(244 63 94 / 0.10)', color: 'rgb(var(--bb-text) / 0.92)' }}
          >
            {error}
          </div>
        </div>
      ) : null}

      {item ? (
        <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-12">
          {/* LEFT */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bb-card bb-pop rounded-[26px] p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-extrabold" style={{ color: 'rgb(var(--bb-text) / 0.96)' }}>
                    Overview
                  </p>
                  <p className="mt-1 text-xs font-semibold" style={{ color: 'rgb(var(--bb-muted) / 0.82)' }}>
                    Keys, timeline and access links.
                  </p>
                </div>

                <span className="rounded-full border px-3 py-1 text-[11px] font-extrabold" style={{ borderColor: st.border, backgroundColor: st.bg, color: st.text }}>
                  {item.status ?? '—'}
                </span>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <SoftBox title="Accepted at" icon={<ClockIcon className="h-5 w-5" />}>
                  <p className="text-sm font-extrabold" style={{ color: 'rgb(var(--bb-text) / 0.92)' }}>
                    {fmtDate(item.acceptedAt as any)}
                  </p>
                </SoftBox>

                <SoftBox title="Campaign" icon={<SparklesIcon className="h-5 w-5" />}>
                  <p className="text-sm font-extrabold" style={{ color: 'rgb(var(--bb-text) / 0.92)' }}>
                    {item.campaign?.title ?? '—'}
                  </p>
                </SoftBox>
              </div>

              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <SoftBox title="Promo code" icon={<TicketIcon className="h-5 w-5" />}>
                  <p className="text-sm font-extrabold" style={{ color: 'rgb(var(--bb-text) / 0.92)' }}>
                    {item.promo?.code ?? '—'}
                  </p>
                </SoftBox>

                <SoftBox title="Tracking code" icon={<TagIcon className="h-5 w-5" />}>
                  <p className="text-sm font-extrabold" style={{ color: 'rgb(var(--bb-text) / 0.92)' }}>
                    {item.tracking?.code ?? '—'}
                  </p>
                </SoftBox>
              </div>

              <div className="mt-3">
                <SoftBox
                  title="Tracking URL"
                  icon={<LinkIcon className="h-5 w-5" />}
                  right={
                    item.tracking?.url ? (
                      <a href={item.tracking.url} target="_blank" rel="noreferrer" className="bb-btn-ghost h-9 px-3">
                        Open <ChevronRightIcon className="ml-2 h-4 w-4" />
                      </a>
                    ) : null
                  }
                >
                  {item.tracking?.url ? (
                    <a
                      href={item.tracking.url}
                      target="_blank"
                      rel="noreferrer"
                      className="block break-all text-sm font-extrabold underline underline-offset-4"
                      style={{ color: 'rgb(var(--bb-text) / 0.86)', textDecorationColor: 'rgb(var(--bb-border) / 0.25)' }}
                    >
                      {item.tracking.url}
                    </a>
                  ) : (
                    <p className="text-sm font-semibold" style={{ color: 'rgb(var(--bb-muted) / 0.90)' }}>
                      —
                    </p>
                  )}
                </SoftBox>
              </div>
            </div>

            <div
              className="bb-card bb-pop rounded-[26px] p-5"
              style={{
                background: 'linear-gradient(180deg, rgb(var(--bb-card) / 0.80), rgb(var(--bb-card) / 0.62))',
              }}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-extrabold" style={{ color: 'rgb(var(--bb-text) / 0.96)' }}>
                    Next steps
                  </p>
                  <p className="mt-1 text-xs font-semibold" style={{ color: 'rgb(var(--bb-muted) / 0.82)' }}>
                    This block is ready for future analytics.
                  </p>
                </div>
                <span
                  className="rounded-full border px-3 py-1 text-[11px] font-extrabold"
                  style={{
                    borderColor: 'rgb(var(--bb-border) / 0.10)',
                    backgroundColor: 'rgb(var(--bb-border) / 0.04)',
                    color: 'rgb(var(--bb-muted) / 0.90)',
                  }}
                >
                  Optional
                </span>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {[
                  { k: 'Clicks', v: 'Coming soon', icon: <LinkIcon className="h-5 w-5" /> },
                  { k: 'Timeline', v: 'Coming soon', icon: <ClockIcon className="h-5 w-5" /> },
                  { k: 'Payouts', v: 'Coming soon', icon: <TagIcon className="h-5 w-5" /> },
                ].map((x) => (
                  <div
                    key={x.k}
                    className="rounded-2xl border p-4"
                    style={{
                      borderColor: 'rgb(var(--bb-border) / 0.10)',
                      backgroundColor: 'rgb(var(--bb-border) / 0.04)',
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <span className="bb-stat-icon h-9 w-9">{x.icon}</span>
                      <p className="text-xs font-extrabold uppercase tracking-wider" style={{ color: 'rgb(var(--bb-muted) / 0.82)' }}>
                        {x.k}
                      </p>
                    </div>
                    <p className="mt-3 text-sm font-extrabold" style={{ color: 'rgb(var(--bb-text) / 0.92)' }}>
                      {x.v}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-24 lg:self-start">
            <div className="bb-card bb-pop rounded-[26px] p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-extrabold" style={{ color: 'rgb(var(--bb-text) / 0.96)' }}>
                    Participants
                  </p>
                  <p className="mt-1 text-xs font-semibold" style={{ color: 'rgb(var(--bb-muted) / 0.82)' }}>
                    Brand + influencer involved.
                  </p>
                </div>

                <span
                  className="rounded-full border px-3 py-1 text-[11px] font-extrabold"
                  style={{
                    borderColor: 'rgb(var(--bb-border) / 0.10)',
                    backgroundColor: 'rgb(var(--bb-border) / 0.04)',
                    color: 'rgb(var(--bb-muted) / 0.90)',
                  }}
                >
                  <span className="inline-flex items-center gap-2">
                    <UserGroupIcon className="h-4 w-4" />
                    2 profiles
                  </span>
                </span>
              </div>

              <div className="mt-4 grid gap-3">
                <PersonRow
                  label="Brand"
                  name={item.brand?.displayName ?? 'Brand'}
                  id={(item.brand?.id ?? item.brandId) as any}
                  photoUrl={(item.brand as any)?.photoUrl ?? null}
                />

                <PersonRow
                  label="Influencer"
                  name={item.influencer?.displayName ?? 'Influencer'}
                  id={(item.influencer?.id ?? item.influencerId) as any}
                  photoUrl={(item.influencer as any)?.photoUrl ?? null}
                />
              </div>

              <div
                className="mt-4 rounded-2xl border p-4 text-xs font-semibold"
                style={{
                  borderColor: 'rgb(var(--bb-border) / 0.10)',
                  backgroundColor: 'rgb(var(--bb-border) / 0.04)',
                  color: 'rgb(var(--bb-muted) / 0.90)',
                }}
              >
                Tip: you can add stats + timeline + payouts later without changing this page.
              </div>
            </div>

            <div className="bb-card bb-pop rounded-[26px] p-5">
              <p className="text-sm font-extrabold" style={{ color: 'rgb(var(--bb-text) / 0.96)' }}>
                Quick actions
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <Link to="/campaigns" className="bb-btn-primary h-11 px-5">
                  Browse campaigns
                </Link>
                <Link to="/collaborations" className="bb-btn-ghost h-11 px-5">
                  All collaborations
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}