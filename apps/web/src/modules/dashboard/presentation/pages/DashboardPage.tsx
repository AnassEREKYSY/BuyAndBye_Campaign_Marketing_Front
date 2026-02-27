import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProfile } from '@/modules/profile/application/hooks/useProfile'
import { UserRole } from '@core/modules/auth/domain/entities'
import { useDashboard } from '../../application/hooks/useDashboard'
import { DashboardTopBar } from '../components/DashboardTopBar'
import { DashboardHeader } from '../components/DashboardHeader'
import { StatCard } from '../components/StatCard'
import { LineChartCard } from '../components/LineChartCard'
import { CollaborationsTable } from '../components/CollaborationsTable'
import { PayoutsCard } from '../components/PayoutsCard'
import { BrandManagementTopButtons } from '../components/BrandManagementTopButtons'

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
    search,
    setSearch,
    selectedCampaignId,
    setSelectedCampaignId,
    campaignsAll,
  } = useDashboard(role)

  const headerTitle =
    role === UserRole.BRAND ? 'Brand dashboard' : role === UserRole.INFLUENCER ? 'Influencer dashboard' : 'Dashboard'
  const headerSubtitle =
    role === UserRole.BRAND
      ? 'Campaign performance & collaborations'
      : role === UserRole.INFLUENCER
        ? 'Clicks, collaborations & earnings'
        : 'Overview'

  const rightSlot = (
    <div className="flex flex-wrap items-center justify-end gap-2">
      {role === UserRole.BRAND ? (
        <select
          value={selectedCampaignId ?? ''}
          onChange={(e) => setSelectedCampaignId(e.target.value || null)}
          className="h-11 rounded-2xl border px-3 text-sm font-extrabold outline-none transition"
          style={{
            borderColor: 'rgb(var(--bb-border) / 0.10)',
            backgroundColor: 'rgb(var(--bb-card) / 0.92)',
            color: 'rgb(var(--bb-text) / 0.95)',
          }}
        >
          <option value="">Auto (published first)</option>
          {campaignsAll.map((c) => (
            <option key={c.id} value={c.id}>
              {c.title}
            </option>
          ))}
        </select>
      ) : null}

      <button onClick={() => void refresh({ force: true })} className="bb-btn-ghost h-11 px-5">
        Refresh
      </button>
    </div>
  )

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
      <div className="bb-pop">
        <DashboardHeader
          title={headerTitle}
          subtitle={headerSubtitle}
          search={search}
          onSearch={setSearch}
          rightSlot={rightSlot}
          searchPlaceholder={role === UserRole.BRAND ? 'Search my campaigns…' : 'Search campaigns…'}
        />
      </div>

      <div className="mt-4 bb-pop">
        <DashboardTopBar />
      </div>

      {role === UserRole.BRAND ? (
        <div className="mt-4 bb-pop">
          <BrandManagementTopButtons />
        </div>
      ) : null}

      {error ? (
        <div
          className="bb-pop mt-5 rounded-3xl border p-4 text-sm font-semibold"
          style={{
            borderColor: 'rgb(244 63 94 / 0.25)',
            backgroundColor: 'rgb(244 63 94 / 0.10)',
            color: 'rgb(var(--bb-text) / 0.92)',
          }}
        >
          {error}
        </div>
      ) : null}

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