import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProfile } from '@/modules/profile/application/hooks/useProfile'
import { UserRole } from '@core/modules/auth/domain/entities'
import { useDashboard } from '../../application/hooks/useDashboard'
import { DashboardTopBar } from '../components/DashboardTopBar'
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

  const [search, setSearch] = useState('')
  const { loading, error, counts, collaborations, influencerDashboard, payouts, appliesCount, brandSummary, timeline, refresh } = useDashboard(role)

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
        { label: 'Total clicks', value: String(influencerDashboard.totals.clicks), hint: 'All collaborations', icon: <IconBolt /> },
        {
          label: 'Estimated earnings',
          value: money(influencerDashboard.totals.estimatedPayout, influencerDashboard.totals.currency),
          hint: 'Based on tiers',
          icon: <IconCoins />,
        },
        { label: 'Applications', value: String(appliesCount), hint: 'Sent', icon: <IconSend /> },
        { label: 'Open campaigns', value: String(counts.published), hint: 'Available', icon: <IconChart /> },
      ]
    }

    if (role === UserRole.BRAND) {
      const clicks = brandSummary?.totals?.clicks ?? 0
      const collabs = brandSummary?.totals?.collaborations ?? collaborations.length

      return [
        { label: 'My campaigns', value: String(counts.all), hint: `Draft ${counts.draft} • Live ${counts.published}`, icon: <IconChart /> },
        { label: 'Live campaigns', value: String(counts.published), hint: 'Published', icon: <IconBolt /> },
        { label: 'Collaborations', value: String(collabs), hint: 'Selected campaign', icon: <IconUsers /> },
        { label: 'Clicks', value: String(clicks), hint: 'Selected campaign', icon: <IconBolt /> },
      ]
    }

    return [
      { label: 'Campaigns', value: String(counts.all), hint: 'All', icon: <IconChart /> },
      { label: 'Collaborations', value: String(collaborations.length), hint: 'All', icon: <IconUsers /> },
      { label: 'Live campaigns', value: String(counts.published), hint: 'Published', icon: <IconBolt /> },
      { label: 'Closed campaigns', value: String(counts.closed), hint: 'Closed', icon: <IconChart /> },
    ]
  }, [role, influencerDashboard, counts, brandSummary, collaborations.length, appliesCount])

  return (
    <div className="bb-page px-4 py-6 md:px-6">
      <div className="bb-pop">
        <div className="mb-5 text-center">
          <p className="text-xs font-extrabold uppercase tracking-wider text-white/45">Workspace</p>
          <h1 className="mt-2 text-2xl font-black tracking-tight text-white">{headerTitle}</h1>
          <p className="mt-1 text-sm font-semibold text-white/60">{headerSubtitle}</p>
        </div>
        <DashboardTopBar search={search} onSearch={setSearch} />
      </div>

      <div className="mt-4 flex justify-center">
        <button onClick={() => void refresh()} className="bb-btn-ghost h-11 px-5">
          Refresh data
        </button>
      </div>

      {role === UserRole.BRAND ? <BrandManagementTopButtons /> : null}

      {error ? (
        <div className="bb-pop mt-5 rounded-3xl border border-rose-500/25 bg-rose-500/10 p-4 text-sm font-semibold text-rose-100">
          {error}
        </div>
      ) : null}

      <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="bb-pop">
            <StatCard label={s.label} value={s.value} hint={s.hint} icon={s.icon} />
          </div>
        ))}
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
              <div className="bb-gradient-border bb-glass bb-ring relative overflow-hidden rounded-[26px] border border-white/10 p-4 text-white">
                <div className="pointer-events-none absolute inset-0 bb-spotlight" />
                <div className="pointer-events-none absolute inset-0 bb-noise" />
                <div className="relative">
                  <p className="text-sm font-extrabold tracking-tight">My campaigns</p>
                  <p className="mt-1 text-xs font-semibold text-white/55">
                    Stats here are based on your own campaigns. Use “Browse campaigns” to explore the marketplace.
                  </p>
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                      <p className="text-xs font-extrabold text-white/80">Draft</p>
                      <p className="mt-2 text-xl font-black text-white">{counts.draft}</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                      <p className="text-xs font-extrabold text-white/80">Published</p>
                      <p className="mt-2 text-xl font-black text-white">{counts.published}</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                      <p className="text-xs font-extrabold text-white/80">Closed</p>
                      <p className="mt-2 text-xl font-black text-white">{counts.closed}</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                      <p className="text-xs font-extrabold text-white/80">All</p>
                      <p className="mt-2 text-xl font-black text-white">{counts.all}</p>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-end">
                    <button onClick={() => nav('/dashboard/brand/campaigns')} className="bb-btn-ghost h-10 px-4">
                      Open manager
                    </button>
                  </div>
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