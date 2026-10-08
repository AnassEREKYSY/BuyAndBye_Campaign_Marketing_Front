import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowPathIcon, CursorArrowRaysIcon, UsersIcon, UserGroupIcon, BanknotesIcon, ChartBarIcon } from '@heroicons/react/24/outline'
import { PageHeader, Section, Stat, StatusBadge, EmptyState, Skeleton, Segmented, formatNumber, formatMoney } from '@/shared/components/ui'
import { env } from '@/shared/config/env'
import { useOverview, changeLabel, type BrandOverview, type RangeDays } from '../../application/useOverview'
import { ClicksChart, ChartLegend, BarList } from '../components/Charts'

const ranges: Array<{ value: RangeDays; label: string }> = [
  { value: 7, label: '7 days' },
  { value: 30, label: '30 days' },
  { value: 90, label: '90 days' },
]

function avatarUrl(url: string | null) {
  if (!url) return ''
  return /^https?:\/\//.test(url) ? url : `${env.BACKEND_BASE_URL}${url}`
}

function LoadingState() {
  return (
    <div className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-[108px]" />
        ))}
      </div>
      <Skeleton className="h-80" />
      <div className="grid gap-4 lg:grid-cols-3">
        <Skeleton className="h-64 lg:col-span-2" />
        <Skeleton className="h-64" />
      </div>
    </div>
  )
}

export default function AnalyticsPage() {
  const [days, setDays] = useState<RangeDays>(30)
  const { data, loading, error, reload } = useOverview<BrandOverview>('brand', days)

  const t = data?.totals
  const change = t?.change_pct ?? null
  const totalCampaignClicks = (data?.campaigns ?? []).reduce((s, c) => s + c.clicks, 0)

  return (
    <div>
      <PageHeader
        title="Analytics"
        description="Clicks, creators and payouts across all your campaigns."
        actions={
          <>
            <Segmented value={days} options={ranges} onChange={setDays} />
            <button type="button" className="bb-btn-ghost h-9 w-9 px-0" onClick={() => void reload()} aria-label="Refresh">
              <ArrowPathIcon className="h-4 w-4" />
            </button>
          </>
        }
      />

      {error ? <p className="mb-4 rounded-[10px] bg-bb-accent-soft px-4 py-3 text-sm text-bb-accent-strong">{error}</p> : null}

      {loading && !data ? (
        <LoadingState />
      ) : data && t ? (
        <div className={`grid gap-4 transition-opacity ${loading ? 'opacity-60' : ''}`}>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Stat label="Clicks" value={formatNumber(t.clicks)} hint={changeLabel(change, days)} tone={change === null ? undefined : change >= 0 ? 'up' : 'down'} icon={<CursorArrowRaysIcon className="h-4 w-4" />} />
            <Stat label="Unique visitors" value={formatNumber(t.unique_clicks)} hint={t.clicks ? `${Math.round((t.unique_clicks / t.clicks) * 100)}% of clicks` : undefined} icon={<UsersIcon className="h-4 w-4" />} />
            <Stat label="Active creators" value={formatNumber(t.active_collaborations)} hint={`${t.pending_applications} application${t.pending_applications === 1 ? '' : 's'} to review`} icon={<UserGroupIcon className="h-4 w-4" />} />
            <Stat label="Payouts to approve" value={formatMoney(data.payouts.pending, data.payouts.currency)} hint={`${formatMoney(data.payouts.paid, data.payouts.currency)} paid so far`} icon={<BanknotesIcon className="h-4 w-4" />} />
          </div>

          <Section title="Clicks over time" description={`${formatNumber(t.clicks)} clicks in the last ${days} days · ${formatNumber(t.all_time_clicks)} all time`} actions={<ChartLegend />}>
            <ClicksChart series={data.series} />
          </Section>

          <div className="grid gap-4 lg:grid-cols-3">
            <Section className="lg:col-span-2" title="Campaigns" description="Ranked by clicks in this period." bodyClassName="pb-2" actions={<Link to="/dashboard/brand/campaigns" className="bb-link text-sm">Manage</Link>}>
              {data.campaigns.length === 0 ? (
                <div className="px-5 pb-3">
                  <EmptyState title="No campaigns yet" text="Create a campaign to start tracking clicks." action={<Link to="/dashboard/brand/campaigns" className="bb-btn-primary">New campaign</Link>} />
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="bb-table">
                    <thead className="bb-thead">
                      <tr>
                        <th className="bb-th">Campaign</th>
                        <th className="bb-th text-right">Clicks</th>
                        <th className="bb-th text-right">Unique</th>
                        <th className="bb-th text-right">Creators</th>
                        <th className="bb-th">Share</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.campaigns.map((c) => (
                        <tr key={c.id} className="bb-tr bb-tr-hover">
                          <td className="bb-td">
                            <Link to={`/campaigns/${c.id}`} className="font-medium hover:underline">
                              {c.title}
                            </Link>
                            <div className="mt-1">
                              <StatusBadge status={c.status} />
                            </div>
                          </td>
                          <td className="bb-td text-right tabular-nums">{formatNumber(c.clicks)}</td>
                          <td className="bb-td text-right tabular-nums text-bb-muted">{formatNumber(c.unique_clicks)}</td>
                          <td className="bb-td text-right tabular-nums">{c.collaborators}</td>
                          <td className="bb-td w-40">
                            <div className="h-1.5 overflow-hidden rounded-full bg-bb-border/[0.07]">
                              <div className="h-full rounded-full bg-bb-primary" style={{ width: `${totalCampaignClicks ? (c.clicks / totalCampaignClicks) * 100 : 0}%` }} />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Section>

            <Section title="Top creators" description="Most clicks in this period.">
              {data.top_creators.length === 0 ? (
                <p className="py-6 text-center text-sm text-bb-muted">No creator activity yet.</p>
              ) : (
                <ol className="grid gap-3">
                  {data.top_creators.map((c, i) => (
                    <li key={c.id} className="flex items-center gap-3">
                      <span className="w-4 text-xs tabular-nums text-bb-muted">{i + 1}</span>
                      <span className="bb-avatar">
                        {c.photo_url ? <img src={avatarUrl(c.photo_url)} alt="" className="h-full w-full object-cover" /> : c.display_name.slice(0, 1)}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium">{c.display_name}</span>
                        <span className="block text-xs text-bb-muted">
                          {c.campaigns} campaign{c.campaigns === 1 ? '' : 's'}
                        </span>
                      </span>
                      <span className="text-sm font-medium tabular-nums">{formatNumber(c.clicks)}</span>
                    </li>
                  ))}
                </ol>
              )}
            </Section>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Section title="Traffic sources" description="Where clicks come from.">
              <BarList items={data.sources} labelKey="source" />
            </Section>
            <Section title="Devices">
              <BarList items={data.devices} labelKey="device" />
            </Section>
            <Section title="Payouts" description="All periods, all campaigns.">
              <dl className="grid gap-3 text-sm">
                {(
                  [
                    ['Pending', data.payouts.pending, 'pending'],
                    ['Approved', data.payouts.approved, 'approved'],
                    ['Paid', data.payouts.paid, 'paid'],
                  ] as const
                ).map(([label, amount, status]) => (
                  <div key={label} className="flex items-center justify-between">
                    <dt>
                      <StatusBadge status={status} />
                    </dt>
                    <dd className="font-medium tabular-nums">
                      <span className="sr-only">{label}: </span>
                      {formatMoney(amount, data.payouts.currency)}
                    </dd>
                  </div>
                ))}
                <div className="flex items-center justify-between border-t border-bb-border/10 pt-3">
                  <dt className="text-bb-muted">Total</dt>
                  <dd className="font-semibold tabular-nums">{formatMoney(data.payouts.pending + data.payouts.approved + data.payouts.paid, data.payouts.currency)}</dd>
                </div>
              </dl>
            </Section>
          </div>
        </div>
      ) : !error ? (
        <EmptyState icon={<ChartBarIcon className="h-5 w-5" />} title="Nothing to show yet" />
      ) : null}
    </div>
  )
}
