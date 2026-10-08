import { useMemo, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowPathIcon,
  BanknotesIcon,
  ChartBarIcon,
  CursorArrowRaysIcon,
  DocumentTextIcon,
  MegaphoneIcon,
  QrCodeIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline'
import { useProfile } from '@/modules/profile/application/hooks/useProfile'
import { UserRole } from '@core/modules/auth/domain/entities'
import { PageHeader, Section, Skeleton, formatMoney, formatNumber } from '@/shared/components/ui'
import { useDashboard } from '../../application/hooks/useDashboard'
import { StatCard } from '../components/StatCard'
import { LineChartCard } from '../components/LineChartCard'
import { CollaborationsTable } from '../components/CollaborationsTable'
import { PayoutsCard } from '../components/PayoutsCard'

type StatItem = { label: string; value: ReactNode; hint?: string; icon: ReactNode; to?: string }

const iconCls = 'h-[18px] w-[18px]'

export default function DashboardPage() {
  const { profile } = useProfile() as any

  const role = useMemo(() => {
    const raw: unknown = profile?.role ?? profile?.user?.role ?? profile?.data?.role
    if (raw === UserRole.INFLUENCER) return UserRole.INFLUENCER
    if (raw === UserRole.BRAND) return UserRole.BRAND
    if (raw === UserRole.ADMIN) return UserRole.ADMIN
    return null
  }, [profile]) as UserRole | null

  const { loading, error, counts, collaborations, influencerDashboard, payouts, appliesCount, brandSummary, timeline, refresh } =
    useDashboard(role)

  const isBrand = role === UserRole.BRAND
  const isInfluencer = role === UserRole.INFLUENCER

  const description = isBrand
    ? 'How your campaigns and creators are doing.'
    : isInfluencer
      ? 'Your clicks, collaborations and earnings at a glance.'
      : 'Campaigns and collaborations across Kickback.'

  const stats = useMemo<StatItem[]>(() => {
    if (isInfluencer && influencerDashboard) {
      return [
        { label: 'Applications', value: formatNumber(appliesCount), hint: 'Sent to brands', icon: <DocumentTextIcon className={iconCls} />, to: '/applications' },
        { label: 'Open campaigns', value: formatNumber(counts.published), hint: 'Ready to apply', icon: <MegaphoneIcon className={iconCls} />, to: '/campaigns' },
        { label: 'Collaborations', value: formatNumber(collaborations.length), hint: 'Active and past', icon: <UserGroupIcon className={iconCls} />, to: '/collaborations' },
        {
          label: 'Estimated earnings',
          value: formatMoney(influencerDashboard.totals.estimatedPayout, influencerDashboard.totals.currency),
          hint: 'Based on payout tiers',
          icon: <BanknotesIcon className={iconCls} />,
          to: '/earnings',
        },
      ]
    }

    if (isBrand) {
      const clicks = brandSummary?.totals?.clicks ?? 0
      const collabs = brandSummary?.totals?.collaborations ?? collaborations.length
      return [
        { label: 'Live campaigns', value: formatNumber(counts.published), hint: 'Published now', icon: <MegaphoneIcon className={iconCls} />, to: '/dashboard/brand/campaigns' },
        { label: 'All campaigns', value: formatNumber(counts.all), hint: `${counts.draft} draft · ${counts.closed} closed`, icon: <ChartBarIcon className={iconCls} />, to: '/dashboard/brand/campaigns' },
        { label: 'Collaborations', value: formatNumber(collabs), hint: 'With creators', icon: <UserGroupIcon className={iconCls} />, to: '/collaborations' },
        {
          label: 'Clicks',
          value: formatNumber(clicks),
          hint: brandSummary?.campaign?.title ? `On ${brandSummary.campaign.title}` : 'Selected campaign',
          icon: <CursorArrowRaysIcon className={iconCls} />,
          to: '/analytics',
        },
      ]
    }

    return [
      { label: 'Campaigns', value: formatNumber(counts.all), icon: <ChartBarIcon className={iconCls} />, to: '/campaigns' },
      { label: 'Live campaigns', value: formatNumber(counts.published), icon: <MegaphoneIcon className={iconCls} />, to: '/campaigns' },
      { label: 'Closed campaigns', value: formatNumber(counts.closed), icon: <ChartBarIcon className={iconCls} /> },
      { label: 'Collaborations', value: formatNumber(collaborations.length), icon: <UserGroupIcon className={iconCls} />, to: '/collaborations' },
    ]
  }, [isBrand, isInfluencer, influencerDashboard, counts, brandSummary, collaborations.length, appliesCount])

  const refreshButton = (
    <button type="button" onClick={() => void refresh({ force: true })} className="bb-icon-btn h-10 w-10" aria-label="Refresh" title="Refresh">
      <ArrowPathIcon className={`${iconCls} ${loading ? 'animate-spin' : ''}`} />
    </button>
  )

  const actions = isBrand ? (
    <>
      {refreshButton}
      <Link to="/analytics" className="bb-btn-ghost">
        <ChartBarIcon className={iconCls} />
        View analytics
      </Link>
      <Link to="/dashboard/brand/campaigns" className="bb-btn-primary">
        <MegaphoneIcon className={iconCls} />
        Manage campaigns
      </Link>
    </>
  ) : isInfluencer ? (
    <>
      {refreshButton}
      <Link to="/links" className="bb-btn-ghost">
        <QrCodeIcon className={iconCls} />
        Links & QR codes
      </Link>
      <Link to="/earnings" className="bb-btn-primary">
        <BanknotesIcon className={iconCls} />
        View earnings
      </Link>
    </>
  ) : (
    refreshButton
  )

  return (
    <div>
      <PageHeader title="Overview" description={description} actions={actions} />

      {error ? (
        <div className="mb-6 rounded-[10px] border border-bb-accent/20 bg-bb-accent-soft px-4 py-3 text-sm text-bb-accent-strong" role="alert">
          {error}
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bb-card">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="mt-3 h-7 w-20" />
                <Skeleton className="mt-2 h-3 w-28" />
              </div>
            ))
          : stats.map((s) => <StatCard key={s.label} label={s.label} value={s.value} hint={s.hint} icon={s.icon} to={s.to} />)}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <LineChartCard
            title="Clicks"
            subtitle={
              isBrand
                ? `Last 14 days${brandSummary?.campaign?.title ? ` · ${brandSummary.campaign.title}` : ''}`
                : 'Last 14 days · your top collaboration'
            }
            data={timeline}
            height={260}
            loading={loading}
          />
        </div>

        <div className="lg:col-span-4">
          {isInfluencer ? (
            <PayoutsCard title="Payouts" payouts={payouts} />
          ) : (
            <Section
              title="Campaigns"
              description="By status"
              className="h-full"
              actions={
                <Link to="/dashboard/brand/campaigns" className="bb-link text-sm">
                  Manage
                </Link>
              }
            >
              <dl className="-mx-5 divide-y divide-bb-border/10 border-t border-bb-border/10">
                {[
                  { k: 'Published', v: counts.published },
                  { k: 'Draft', v: counts.draft },
                  { k: 'Closed', v: counts.closed },
                  { k: 'Total', v: counts.all },
                ].map((x) => (
                  <div key={x.k} className="flex items-center justify-between px-5 py-3 text-sm">
                    <dt className="text-bb-muted">{x.k}</dt>
                    <dd className="font-medium tabular-nums">{loading ? <Skeleton className="h-4 w-8" /> : formatNumber(x.v)}</dd>
                  </div>
                ))}
              </dl>
              {isBrand ? (
                <div className="mt-4 grid gap-2">
                  <Link to="/dashboard/brand/products" className="bb-btn-ghost h-9 w-full">
                    Manage products
                  </Link>
                </div>
              ) : null}
            </Section>
          )}
        </div>
      </div>

      <div className="mt-6">
        <CollaborationsTable
          title="Recent collaborations"
          collaborations={collaborations}
          role={isInfluencer ? 'influencer' : isBrand ? 'brand' : 'admin'}
        />
      </div>
    </div>
  )
}
