import { useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useProfile } from '@/modules/profile/application/hooks/useProfile'
import { UserRole } from '@core/modules/auth/domain/entities'
import { useDashboard } from '../../application/hooks/useDashboard'
import { StatCard } from '../components/StatCard'
import { LineChartCard } from '../components/LineChartCard'
import { CollaborationsTable } from '../components/CollaborationsTable'
import { PayoutsCard } from '../components/PayoutsCard'
import { BrandManagementTopButtons } from '../components/BrandManagementTopButtons'
import {
  ArrowPathIcon,
  Squares2X2Icon,
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  ChartBarIcon,
  RocketLaunchIcon,
  BoltIcon,
} from '@heroicons/react/24/outline'

function money(amount: number, currency: string) {
  const v = Number.isFinite(amount) ? amount : 0
  return `${v.toFixed(2)} ${currency}`
}

function IconBolt() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M13 2 3 14h8l-1 8 10-12h-8l1-8Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  )
}
function IconCoins() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M12 6c4.418 0 8-1.343 8-3s-3.582-3-8-3-8 1.343-8 3 3.582 3 8 3Z" stroke="currentColor" strokeWidth="2" />
      <path d="M4 3v6c0 1.657 3.582 3 8 3s8-1.343 8-3V3" stroke="currentColor" strokeWidth="2" />
      <path d="M4 9v6c0 1.657 3.582 3 8 3s8-1.343 8-3V9" stroke="currentColor" strokeWidth="2" />
    </svg>
  )
}
function IconChart() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M4 19V5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M4 19h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M7 15l3-4 3 2 4-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
function IconUsers() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M10 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" stroke="currentColor" strokeWidth="2" />
      <path d="M21 21v-2a4 4 0 0 0-3-3.87" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}
function IconSend() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M22 2 11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M22 2 15 22l-4-9-9-4 20-7Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  )
}

function SkeletonCard() {
  const bg = { backgroundColor: 'rgb(var(--bb-border) / 0.06)' }
  return (
    <div className="bb-card">
      <div className="h-4 w-2/3 rounded" style={bg} />
      <div className="mt-3 h-3 w-1/3 rounded" style={bg} />
      <div className="mt-6 h-10 rounded-2xl" style={bg} />
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

export default function DashboardPage() {
  const { profile } = useProfile() as any
  const nav = useNavigate()

  const role = useMemo(() => {
    const raw: unknown = profile?.role ?? profile?.user?.role ?? profile?.data?.role
    if (raw === UserRole.INFLUENCER) return UserRole.INFLUENCER
    if (raw === UserRole.BRAND) return UserRole.BRAND
    if (raw === UserRole.ADMIN) return UserRole.ADMIN
    return null
  }, [profile]) as UserRole | null

  const {
    loading,
    error,
    counts,
    collaborations,
    influencerDashboard,
    payouts,
    appliesCount,
    brandSummary,
    timeline,
    refresh,
  } = useDashboard(role)

  const headerTitle =
    role === UserRole.BRAND ? 'Brand Dashboard' : role === UserRole.INFLUENCER ? 'Influencer Dashboard' : 'Dashboard'
  const headerSubtitle =
    role === UserRole.BRAND
      ? 'Campaign performance & collaborations'
      : role === UserRole.INFLUENCER
        ? 'Clicks, collaborations & earnings'
        : 'Overview'

  const stats = useMemo(() => {
    if (role === UserRole.INFLUENCER && influencerDashboard) {
      return [
        { label: 'Applications', value: String(appliesCount), hint: 'See all applications', icon: <IconSend />, to: '/applications' },
        { label: 'Open campaigns', value: String(counts.published), hint: 'Browse & apply', icon: <IconChart />, to: '/campaigns' },
        { label: 'Collaborations', value: String(collaborations.length), hint: 'Track progress', icon: <IconUsers />, to: '/collaborations' },
        {
          label: 'Estimated earnings',
          value: money(influencerDashboard.totals.estimatedPayout, influencerDashboard.totals.currency),
          hint: 'Based on tiers',
          icon: <IconCoins />,
        },
      ]
    }

    if (role === UserRole.BRAND) {
      const clicks = brandSummary?.totals?.clicks ?? 0
      const collabs = brandSummary?.totals?.collaborations ?? collaborations.length

      return [
        { label: 'Live campaigns', value: String(counts.published), hint: 'Published campaigns', icon: <IconBolt />, to: '/campaigns' },
        { label: 'My campaigns', value: String(counts.all), hint: `Draft ${counts.draft} • Live ${counts.published}`, icon: <IconChart />, to: '/dashboard/brand/campaigns' },
        { label: 'Collaborations', value: String(collabs), hint: 'Open list', icon: <IconUsers />, to: '/collaborations' },
        { label: 'Clicks', value: String(clicks), hint: 'Selected campaign', icon: <IconBolt /> },
      ]
    }

    return [
      { label: 'Campaigns', value: String(counts.all), hint: 'All', icon: <IconChart />, to: '/campaigns' },
      { label: 'Collaborations', value: String(collaborations.length), hint: 'All', icon: <IconUsers />, to: '/collaborations' },
      { label: 'Live campaigns', value: String(counts.published), hint: 'Published', icon: <IconBolt />, to: '/campaigns' },
      { label: 'Closed campaigns', value: String(counts.closed), hint: 'Closed', icon: <IconChart /> },
    ]
  }, [role, influencerDashboard, counts, brandSummary, collaborations.length, appliesCount])

  return (
    <div className="bb-page px-4 py-6 md:px-6">
      {/* TOP SECTION (NO SEARCH) */}
      <section
        className="bb-pop relative overflow-hidden rounded-3xl border p-5 sm:p-6"
        style={{
          borderColor: 'rgb(var(--bb-border) / 0.10)',
          backgroundColor: 'rgb(var(--bb-surface) / 0.82)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <div className="pointer-events-none absolute inset-0 bb-spotlight" />
        <div className="pointer-events-none absolute inset-0 bb-grid" />
        <div className="pointer-events-none absolute inset-0 bb-noise" />

        <div className="relative">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <TopPill>
                  <ChartBarIcon className="h-4 w-4" />
                  Overview
                </TopPill>
                <TopPill>{headerSubtitle}</TopPill>
              </div>

              <h1 className="mt-3 text-2xl font-black tracking-tight sm:text-3xl" style={{ color: 'rgb(var(--bb-text) / 0.98)' }}>
                {headerTitle}
              </h1>

              <p className="mt-2 max-w-2xl text-sm font-semibold leading-6" style={{ color: 'rgb(var(--bb-muted) / 0.92)' }}>
                Quick stats, trends, and collaboration tracking in one place.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Link to="/campaigns" className="bb-btn-ghost h-11 px-4">
                <span className="inline-flex items-center gap-2">
                  <RocketLaunchIcon className="h-5 w-5" />
                  <span>Browse campaigns</span>
                </span>
              </Link>

              <button onClick={() => void refresh({ force: true })} className="bb-btn-primary h-11 px-4">
                <span className="inline-flex items-center gap-2">
                  <ArrowPathIcon className="h-5 w-5" />
                  <span>Refresh</span>
                </span>
              </button>

              <Link to="/campaigns" className="bb-icon-btn h-11 w-11" aria-label="Campaigns">
                <MagnifyingGlassIcon className="h-5 w-5" />
              </Link>

              <Link to="/dashboard" className="bb-icon-btn h-11 w-11" aria-label="Dashboard">
                <Squares2X2Icon className="h-5 w-5" />
              </Link>

              <button className="bb-icon-btn h-11 w-11" aria-label="Filters">
                <AdjustmentsHorizontalIcon className="h-5 w-5" />
              </button>
            </div>
          </div>

          {error ? (
            <div
              className="bb-pop mt-4 rounded-3xl border p-4 text-sm font-semibold"
              style={{
                borderColor: 'rgb(244 63 94 / 0.25)',
                backgroundColor: 'rgb(244 63 94 / 0.10)',
                color: 'rgb(var(--bb-text) / 0.92)',
              }}
            >
              {error}
            </div>
          ) : null}
        </div>
      </section>

      {/* BROWSE CAMPAIGNS (REDESIGNED BLOCK) */}
      {/* <section className="mt-4 bb-pop">
        <div
          className="relative overflow-hidden rounded-3xl border p-5 sm:p-6"
          style={{
            borderColor: 'rgb(var(--bb-border) / 0.10)',
            backgroundColor: 'rgb(var(--bb-card) / 0.78)',
          }}
        >
          <div className="pointer-events-none absolute inset-0 bb-grid" />
          <div className="pointer-events-none absolute inset-0 bb-noise" />

          <div className="relative flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-extrabold" style={{ color: 'rgb(var(--bb-text) / 0.96)' }}>
                Campaign marketplace
              </p>
              <p className="mt-1 text-xs font-semibold" style={{ color: 'rgb(var(--bb-muted) / 0.86)' }}>
                Browse published campaigns and open details instantly.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Link to="/campaigns" className="bb-btn-primary h-11 px-5">
                Browse campaigns
              </Link>
              {role === UserRole.INFLUENCER ? (
                <Link to="/applications" className="bb-btn-ghost h-11 px-5">
                  My applications
                </Link>
              ) : null}
              <Link to="/collaborations" className="bb-btn-ghost h-11 px-5">
                Collaborations
              </Link>
            </div>
          </div>
        </div>
      </section> */}

      {/* MANAGEMENT BUTTONS (REDESIGNED WRAPPER) */}
      {/* {role === UserRole.BRAND ? (
        <section className="mt-4 bb-pop">
          <div
            className="rounded-3xl border p-3 sm:p-4"
            style={{
              borderColor: 'rgb(var(--bb-border) / 0.10)',
              backgroundColor: 'rgb(var(--bb-card) / 0.72)',
            }}
          >
            <BrandManagementTopButtons />
          </div>
        </section>
      ) : null} */}

      {/* STAT CARDS (SAME COMPONENT, CLEAN GRID) */}
      <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bb-pop">
              <SkeletonCard />
            </div>
          ))
        ) : (
          stats.map((s) => (
            <div key={s.label} className="bb-pop">
              <StatCard label={s.label} value={s.value} hint={s.hint} icon={s.icon} to={(s as any).to} />
            </div>
          ))
        )}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <div className="bb-pop">
            <LineChartCard
              title={role === UserRole.BRAND ? 'Clicks (selected campaign)' : 'Clicks (top collaboration)'}
              subtitle={loading ? 'Loading…' : 'Last 14 days'}
              data={timeline}
              height={260}
            />
          </div>
        </div>

        <div className="lg:col-span-4">
          <div className="bb-pop">
            {role === UserRole.INFLUENCER ? (
              <PayoutsCard title="Payouts" payouts={payouts} />
            ) : (
              <div className="bb-card">
                <p className="text-sm font-extrabold tracking-tight" style={{ color: 'rgb(var(--bb-text) / 0.95)' }}>
                  My campaigns
                </p>
                <p className="mt-1 text-xs font-semibold" style={{ color: 'rgb(var(--bb-muted) / 0.85)' }}>
                  Manage campaigns & payout tiers.
                </p>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  {[
                    { k: 'Draft', v: counts.draft },
                    { k: 'Published', v: counts.published },
                    { k: 'Closed', v: counts.closed },
                    { k: 'All', v: counts.all },
                  ].map((x) => (
                    <div
                      key={x.k}
                      className="rounded-2xl border p-3"
                      style={{
                        borderColor: 'rgb(var(--bb-border) / 0.10)',
                        backgroundColor: 'rgb(var(--bb-border) / 0.05)',
                      }}
                    >
                      <p className="text-xs font-extrabold" style={{ color: 'rgb(var(--bb-text) / 0.80)' }}>
                        {x.k}
                      </p>
                      <p className="mt-2 text-xl font-black" style={{ color: 'rgb(var(--bb-text) / 0.98)' }}>
                        {x.v}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex justify-end">
                  <button onClick={() => nav('/dashboard/brand/campaigns')} className="bb-btn-ghost h-10 px-4">
                    Open manager
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6">
        <div className="bb-pop">
          <CollaborationsTable
            title="Collaborations"
            collaborations={collaborations}
            role={role === UserRole.INFLUENCER ? 'influencer' : role === UserRole.BRAND ? 'brand' : 'admin'}
          />
        </div>
      </div>
    </div>
  )
}