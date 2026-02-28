import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useProfile } from '@/modules/profile/application/hooks/useProfile'
import { UserRole } from '@core/modules/auth/domain/entities'
import { useCampaignDetails } from '@/modules/dashboard/application/hooks/useCampaignDetails'
import { useCampaignApplications } from '@/modules/dashboard/application/hooks/useCampaignApplications'
import { ApplicantProfileModal } from '@/modules/dashboard/presentation/components/ApplicantProfileModal'
import type { CampaignPayoutTier } from '@core/modules/dashboard/domain/entities'
import {
  ArrowLeftIcon,
  Squares2X2Icon,
  PaperAirplaneIcon,
  CheckCircleIcon,
  ClockIcon,
  CalendarDaysIcon,
  BanknotesIcon,
  TagIcon,
  SparklesIcon,
  BuildingStorefrontIcon,
  LinkIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  ShieldCheckIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline'

function fmtDate(iso?: string | null) {
  if (!iso) return '—'
  return iso.slice(0, 10)
}

function money(v?: number | null, currency = 'MAD') {
  if (v === null || v === undefined || !Number.isFinite(Number(v))) return '—'
  return `${Number(v).toFixed(2)} ${currency}`
}

function statusPill(status?: string) {
  const s = (status ?? '').toLowerCase()
  if (s === 'published') return { border: 'rgb(16 185 129 / 0.25)', bg: 'rgb(16 185 129 / 0.10)', text: 'rgb(110 231 183 / 0.95)', dot: 'bg-emerald-300/90' }
  if (s === 'draft') return { border: 'rgb(245 158 11 / 0.25)', bg: 'rgb(245 158 11 / 0.10)', text: 'rgb(253 230 138 / 0.95)', dot: 'bg-amber-300/90' }
  if (s === 'closed') return { border: 'rgb(244 63 94 / 0.25)', bg: 'rgb(244 63 94 / 0.10)', text: 'rgb(253 164 175 / 0.95)', dot: 'bg-rose-300/90' }
  return { border: 'rgb(var(--bb-border) / 0.10)', bg: 'rgb(var(--bb-border) / 0.04)', text: 'rgb(var(--bb-muted) / 0.90)', dot: 'bg-white/35' }
}

function appPill(status?: string) {
  const s = (status ?? '').toLowerCase()
  if (s === 'shortlisted') return statusPill('draft')
  if (s === 'accepted') return statusPill('published')
  if (s === 'rejected') return statusPill('closed')
  return statusPill('unknown')
}

function Alert({ kind, children }: { kind: 'error' | 'success'; children: React.ReactNode }) {
  const styles =
    kind === 'success'
      ? { borderColor: 'rgb(16 185 129 / 0.25)', backgroundColor: 'rgb(16 185 129 / 0.10)', color: 'rgb(var(--bb-text) / 0.92)' }
      : { borderColor: 'rgb(244 63 94 / 0.25)', backgroundColor: 'rgb(244 63 94 / 0.10)', color: 'rgb(var(--bb-text) / 0.92)' }

  return (
    <div className="bb-pop rounded-3xl border p-4 text-sm font-semibold" style={styles}>
      {children}
    </div>
  )
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
  to?: string
  icon: React.ReactNode
  label: string
  kind?: 'ghost' | 'primary'
}) {
  const cls = kind === 'primary' ? 'bb-btn-primary h-11 px-4' : 'bb-btn-ghost h-11 px-4'
  const content = (
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
  )

  if (to) {
    return (
      <Link to={to} className={cls} aria-label={label}>
        {content}
      </Link>
    )
  }

  return (
    <button type="button" className={cls} aria-label={label}>
      {content}
    </button>
  )
}

function StatChip({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
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
        {icon}
      </span>

      <div className="min-w-0">
        <p className="text-[11px] font-extrabold tracking-wide" style={{ color: 'rgb(var(--bb-muted) / 0.82)' }}>
          {label}
        </p>
        <p className="mt-0.5 truncate text-sm font-extrabold" style={{ color: 'rgb(var(--bb-text) / 0.92)' }}>
          {value}
        </p>
      </div>
    </div>
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

export default function CampaignDetailsPage() {
  const { id } = useParams()
  const { profile } = useProfile() as any

  const role = useMemo(() => {
    const raw: unknown = profile?.role ?? profile?.user?.role ?? profile?.data?.role
    if (raw === UserRole.INFLUENCER) return UserRole.INFLUENCER
    if (raw === UserRole.BRAND) return UserRole.BRAND
    if (raw === UserRole.ADMIN) return UserRole.ADMIN
    return null
  }, [profile]) as UserRole | null

  const vm = useCampaignDetails(id ?? null, role)
  const apps = useCampaignApplications(role === UserRole.BRAND ? (id ?? '') : '')

  const [profileOpen, setProfileOpen] = useState(false)
  const [profileInfluencerId, setProfileInfluencerId] = useState<string | null>(null)

  const openApplicantProfile = (influencerId: string) => {
    setProfileInfluencerId(influencerId)
    setProfileOpen(true)
  }

  const closeApplicantProfile = () => {
    setProfileOpen(false)
    setProfileInfluencerId(null)
  }

  const st = statusPill(vm.item?.status)
  const landingUrl = vm.item?.product?.landing_url ?? null

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
                  {vm.item?.status ?? '—'}
                </TopPill>

                <TopPill>
                  <SparklesIcon className="h-4 w-4" />
                  Campaign details
                </TopPill>

                {vm.item?.product?.name ? (
                  <TopPill>
                    <BuildingStorefrontIcon className="h-4 w-4" />
                    {vm.item.product.name}
                  </TopPill>
                ) : null}
              </div>

              <h1 className="mt-3 text-2xl font-black tracking-tight sm:text-3xl" style={{ color: 'rgb(var(--bb-text) / 0.98)' }}>
                {vm.loading ? 'Loading…' : vm.item?.title ?? 'Campaign'}
              </h1>

              <p className="mt-2 max-w-3xl text-sm font-semibold leading-6" style={{ color: 'rgb(var(--bb-muted) / 0.92)' }}>
                {vm.loading ? '—' : vm.item?.objective ?? 'Campaign overview, product info, payout tiers and applications.'}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-start gap-2 lg:justify-end">
              <ActionPill to="/campaigns" label="Back" icon={<ArrowLeftIcon className="h-5 w-5" />} />
              <ActionPill to="/dashboard" label="Dashboard" icon={<Squares2X2Icon className="h-5 w-5" />} />

              {role === UserRole.INFLUENCER && vm.appliedAt ? (
                <div
                  className="inline-flex h-11 items-center gap-2 rounded-full border px-4 text-sm font-extrabold"
                  style={{
                    borderColor: 'rgb(var(--bb-border) / 0.10)',
                    backgroundColor: 'rgb(var(--bb-border) / 0.04)',
                    color: 'rgb(var(--bb-text) / 0.92)',
                  }}
                >
                  <CheckCircleIcon className="h-5 w-5" style={{ color: 'rgb(16 185 129 / 0.9)' }} />
                  <span className="hidden sm:inline">Applied</span>
                  <span className="text-xs font-semibold" style={{ color: 'rgb(var(--bb-muted) / 0.85)' }}>
                    {fmtDate(vm.appliedAt)}
                  </span>
                </div>
              ) : null}

              {vm.canApply ? (
                <button disabled={vm.applyLoading} onClick={vm.onApply} className="bb-btn-primary h-11 px-4" type="button">
                  <span className="inline-flex items-center gap-2">
                    <span
                      className="grid h-9 w-9 place-items-center rounded-full border"
                      style={{
                        borderColor: 'rgb(255 255 255 / 0.18)',
                        backgroundColor: 'rgb(255 255 255 / 0.10)',
                      }}
                    >
                      {vm.applyLoading ? <ClockIcon className="h-5 w-5" /> : <PaperAirplaneIcon className="h-5 w-5" />}
                    </span>
                    <span className="hidden sm:inline">{vm.applyLoading ? 'Applying…' : 'Apply'}</span>
                  </span>
                </button>
              ) : null}
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <StatChip icon={<BanknotesIcon className="h-5 w-5" />} label="Budget" value={money(vm.item?.budget, 'MAD')} />
            <StatChip icon={<CalendarDaysIcon className="h-5 w-5" />} label="Dates" value={`${fmtDate(vm.item?.start_at)} → ${fmtDate(vm.item?.end_at)}`} />
            <StatChip
              icon={<TagIcon className="h-5 w-5" />}
              label="Commission"
              value={vm.item?.commission_type ? `${vm.item.commission_type} • ${Number(vm.item.commission_value ?? 0)}` : '—'}
            />
          </div>
        </div>
      </section>

      {/* Alerts */}
      {vm.error ? (
        <div className="mt-5">
          <Alert kind="error">{vm.error}</Alert>
        </div>
      ) : null}
      {vm.applyError ? (
        <div className="mt-4">
          <Alert kind="error">{vm.applyError}</Alert>
        </div>
      ) : null}
      {vm.applySuccess ? (
        <div className="mt-4">
          <Alert kind="success">{vm.applySuccess}</Alert>
        </div>
      ) : null}

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
                  Key info, objective and context.
                </p>
              </div>

              <span
                className="rounded-full border px-3 py-1 text-[11px] font-extrabold"
                style={{ borderColor: st.border, backgroundColor: st.bg, color: st.text }}
              >
                {vm.item?.status ?? '—'}
              </span>
            </div>

            <div className="mt-4 grid gap-3">
              <SoftBox title="Objective" icon={<SparklesIcon className="h-5 w-5" />}>
                <p className="text-sm font-semibold leading-6" style={{ color: 'rgb(var(--bb-text) / 0.90)' }}>
                  {vm.loading ? '—' : vm.item?.objective ?? '—'}
                </p>
              </SoftBox>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <SoftBox title="Commission" icon={<CurrencyDollarIcon className="h-5 w-5" />}>
                  <p className="text-sm font-extrabold" style={{ color: 'rgb(var(--bb-text) / 0.92)' }}>
                    {vm.item?.commission_type ? `${vm.item.commission_type} • ${Number(vm.item.commission_value ?? 0)}` : '—'}
                  </p>
                </SoftBox>

                <SoftBox title="Budget" icon={<BanknotesIcon className="h-5 w-5" />}>
                  <p className="text-sm font-extrabold" style={{ color: 'rgb(var(--bb-text) / 0.92)' }}>
                    {money(vm.item?.budget, 'MAD')}
                  </p>
                </SoftBox>
              </div>

              {landingUrl ? (
                <SoftBox
                  title="Landing link"
                  icon={<LinkIcon className="h-5 w-5" />}
                  right={
                    <a href={landingUrl} target="_blank" rel="noreferrer" className="bb-btn-ghost h-9 px-3">
                      Open <ChevronRightIcon className="ml-2 h-4 w-4" />
                    </a>
                  }
                >
                  <a
                    href={landingUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="block break-all text-sm font-extrabold underline underline-offset-4"
                    style={{ color: 'rgb(var(--bb-text) / 0.86)', textDecorationColor: 'rgb(var(--bb-border) / 0.25)' }}
                  >
                    {landingUrl}
                  </a>
                </SoftBox>
              ) : null}
            </div>
          </div>

          {/* Applications (brand) */}
          {role === UserRole.BRAND ? (
            <div className="bb-card bb-pop rounded-[26px] p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-extrabold" style={{ color: 'rgb(var(--bb-text) / 0.96)' }}>
                    Applications
                  </p>
                  <p className="mt-1 text-xs font-semibold" style={{ color: 'rgb(var(--bb-muted) / 0.82)' }}>
                    Click an applicant to open the full profile.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button disabled={apps.loading} onClick={apps.refresh} className="bb-btn-ghost h-10 px-4" type="button">
                    Refresh
                  </button>
                  <button disabled={apps.loading || !apps.hasMore} onClick={apps.loadMore} className="bb-btn-ghost h-10 px-4" type="button">
                    Load more
                  </button>
                </div>
              </div>

              <div className="mt-4 bb-table-wrap">
                <div className="overflow-x-auto">
                  <table className="bb-table min-w-[760px]">
                    <thead className="bb-thead">
                      <tr>
                        <th className="bb-th">Applicant</th>
                        <th className="bb-th">Status</th>
                        <th className="bb-th">Message</th>
                        <th className="bb-th">Applied</th>
                        <th className="bb-th text-right">Actions</th>
                      </tr>
                    </thead>

                    <tbody>
                      {apps.loading && apps.items.length === 0 ? (
                        <tr className="bb-tr">
                          <td className="bb-td bb-muted" colSpan={5}>
                            Loading…
                          </td>
                        </tr>
                      ) : null}

                      {!apps.loading && apps.items.length === 0 ? (
                        <tr className="bb-tr">
                          <td className="bb-td bb-muted" colSpan={5}>
                            No applications yet.
                          </td>
                        </tr>
                      ) : null}

                      {apps.items.map((a) => {
                        const name = a.influencer?.displayName ?? 'Unknown'
                        const photo = a.influencer?.photoUrl ?? null
                        const isMutating = apps.mutatingId === a.id
                        const canShortlist = a.status === 'pending'
                        const canFinalize = a.status === 'pending' || a.status === 'shortlisted'
                        const canReject = a.status === 'pending' || a.status === 'shortlisted'
                        const ap = appPill(a.status)

                        return (
                          <tr key={a.id} className="bb-tr bb-tr-hover">
                            <td className="bb-td">
                              <button onClick={() => openApplicantProfile(a.influencerId)} className="flex items-center gap-3 text-left" type="button">
                                <div
                                  className="h-10 w-10 overflow-hidden rounded-2xl border"
                                  style={{
                                    borderColor: 'rgb(var(--bb-border) / 0.10)',
                                    backgroundColor: 'rgb(var(--bb-border) / 0.04)',
                                  }}
                                >
                                  {photo ? <img src={photo} alt="" className="h-full w-full object-cover" /> : null}
                                </div>
                                <div className="min-w-0">
                                  <p className="truncate text-sm font-extrabold">{name}</p>
                                  <p className="mt-1 truncate text-xs font-semibold" style={{ color: 'rgb(var(--bb-muted) / 0.82)' }}>
                                    {a.influencerId}
                                  </p>
                                </div>
                              </button>
                            </td>

                            <td className="bb-td">
                              <span
                                className="rounded-full border px-3 py-1 text-[11px] font-extrabold"
                                style={{ borderColor: ap.border, backgroundColor: ap.bg, color: ap.text }}
                              >
                                {a.status}
                              </span>
                            </td>

                            <td className="bb-td bb-muted">
                              {(a.message ?? '').trim() ? <span className="line-clamp-1">{a.message}</span> : '—'}
                            </td>

                            <td className="bb-td bb-muted">{fmtDate(a.createdAt)}</td>

                            <td className="bb-td">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  disabled={!canShortlist || isMutating}
                                  onClick={() => apps.shortlist(a.id)}
                                  className="bb-btn-ghost h-10 px-4 disabled:opacity-60"
                                  type="button"
                                >
                                  Shortlist
                                </button>

                                <button
                                  disabled={!canFinalize || isMutating}
                                  onClick={() => apps.accept(a.id)}
                                  className="bb-btn-primary h-10 px-4 disabled:opacity-60"
                                  type="button"
                                >
                                  Finalize
                                </button>

                                <button
                                  disabled={!canReject || isMutating}
                                  onClick={() => apps.reject(a.id)}
                                  className="bb-btn-ghost h-10 px-4 disabled:opacity-60"
                                  type="button"
                                >
                                  Reject
                                </button>
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {/* RIGHT */}
        <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-24 lg:self-start">
          {/* PRODUCT + BRAND */}
          <div className="bb-card bb-pop rounded-[26px] p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-extrabold" style={{ color: 'rgb(var(--bb-text) / 0.96)' }}>
                  Product & brand
                </p>
                <p className="mt-1 text-xs font-semibold" style={{ color: 'rgb(var(--bb-muted) / 0.82)' }}>
                  Context for this campaign.
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
                  <ShieldCheckIcon className="h-4 w-4" />
                  Verified
                </span>
              </span>
            </div>

            <div className="mt-4 grid gap-3">
              <SoftBox title="Product" icon={<BuildingStorefrontIcon className="h-5 w-5" />}>
                <p className="text-sm font-extrabold" style={{ color: 'rgb(var(--bb-text) / 0.92)' }}>
                  {vm.loading ? '—' : vm.item?.product?.name ?? '—'}
                </p>
              </SoftBox>

              <SoftBox title="Brand" icon={<UserGroupIcon className="h-5 w-5" />}>
                <div className="flex items-center gap-3">
                  <div
                    className="h-10 w-10 overflow-hidden rounded-2xl border"
                    style={{
                      borderColor: 'rgb(var(--bb-border) / 0.10)',
                      backgroundColor: 'rgb(var(--bb-border) / 0.04)',
                    }}
                  >
                    {vm.item?.brand?.photo_url ? <img src={vm.item.brand.photo_url} alt="" className="h-full w-full object-cover" /> : null}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-extrabold" style={{ color: 'rgb(var(--bb-text) / 0.92)' }}>
                      {vm.item?.brand?.display_name ?? '—'}
                    </p>
                    <p className="mt-1 truncate text-xs font-semibold" style={{ color: 'rgb(var(--bb-muted) / 0.82)' }}>
                      {vm.item?.brand?.id ?? ''}
                    </p>
                  </div>
                </div>
              </SoftBox>
            </div>
          </div>

          {/* TIERS */}
          <TiersCard
            tiersSorted={vm.tiersSorted}
            tiersLoading={vm.tiersLoading}
            tiersError={vm.tiersError}
            role={role}
            canApply={vm.canApply}
            applyLoading={vm.applyLoading}
            onApply={vm.onApply}
            landingUrl={landingUrl}
          />
        </div>
      </div>

      <ApplicantProfileModal open={profileOpen} influencerId={profileInfluencerId} onClose={closeApplicantProfile} />
    </div>
  )
}

function TiersCard({
  tiersSorted,
  tiersLoading,
  tiersError,
  role,
  canApply,
  applyLoading,
  onApply,
  landingUrl,
}: {
  tiersSorted: CampaignPayoutTier[]
  tiersLoading: boolean
  tiersError: string | null
  role: UserRole | null
  canApply: boolean
  applyLoading: boolean
  onApply: () => Promise<void> | void
  landingUrl: string | null
}) {
  return (
    <div className="bb-card bb-pop rounded-[26px] p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-extrabold" style={{ color: 'rgb(var(--bb-text) / 0.96)' }}>
            Payout tiers
          </p>
          <p className="mt-1 text-xs font-semibold" style={{ color: 'rgb(var(--bb-muted) / 0.82)' }}>
            Read-only here.
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
          {tiersSorted.length} tiers
        </span>
      </div>

      {tiersError ? (
        <div className="mt-4">
          <Alert kind="error">{tiersError}</Alert>
        </div>
      ) : null}

      <div className="mt-4 bb-table-wrap">
        <div className="overflow-x-auto">
          <table className="bb-table min-w-[520px]">
            <thead className="bb-thead">
              <tr>
                <th className="bb-th">From</th>
                <th className="bb-th">To</th>
                <th className="bb-th">Payout</th>
              </tr>
            </thead>

            <tbody>
              {tiersLoading && tiersSorted.length === 0 ? (
                <tr className="bb-tr">
                  <td className="bb-td bb-muted" colSpan={3}>
                    Loading…
                  </td>
                </tr>
              ) : null}

              {!tiersLoading && tiersSorted.length === 0 ? (
                <tr className="bb-tr">
                  <td className="bb-td bb-muted" colSpan={3}>
                    No tiers defined yet.
                  </td>
                </tr>
              ) : null}

              {tiersSorted.map((t) => (
                <tr key={t.id} className="bb-tr">
                  <td className="bb-td font-semibold">{t.fromValue}</td>
                  <td className="bb-td bb-muted">{t.toValue ?? '∞'}</td>
                  <td className="bb-td bb-muted">
                    {Number(t.payoutAmount).toFixed(2)} {t.currency ?? 'MAD'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {role === UserRole.INFLUENCER ? (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {landingUrl ? (
            <a href={landingUrl} target="_blank" rel="noreferrer" className="bb-btn-ghost h-11 px-5">
              Open landing <ChevronRightIcon className="ml-2 h-4 w-4" />
            </a>
          ) : null}

          {canApply ? (
            <button disabled={applyLoading} onClick={() => void onApply()} className="bb-btn-primary h-11 px-5" type="button">
              {applyLoading ? 'Applying…' : 'Apply now'}
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}