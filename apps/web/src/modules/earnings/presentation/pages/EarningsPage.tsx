import { useState } from 'react'
import { Link } from 'react-router-dom'
import { BanknotesIcon, CheckCircleIcon, ClockIcon, CursorArrowRaysIcon } from '@heroicons/react/24/outline'
import { PageHeader, Section, Stat, StatusBadge, EmptyState, Skeleton, Segmented, formatMoney, formatNumber, formatDate } from '@/shared/components/ui'
import { useOverview, changeLabel, type CreatorOverview, type RangeDays } from '@/modules/analytics/application/useOverview'
import { ClicksChart, ChartLegend, MoneyBars } from '@/modules/analytics/presentation/components/Charts'

const ranges: Array<{ value: RangeDays; label: string }> = [
  { value: 7, label: '7 days' },
  { value: 30, label: '30 days' },
  { value: 90, label: '90 days' },
]

export default function EarningsPage() {
  const [days, setDays] = useState<RangeDays>(30)
  const { data, loading, error } = useOverview<CreatorOverview>('influencer', days)
  const e = data?.earnings
  const cur = e?.currency ?? 'MAD'

  return (
    <div>
      <PageHeader
        title="Earnings"
        description="What you earned, what is on the way, and the clicks behind it."
        actions={
          <Link to="/links" className="bb-btn-ghost">
            Links & QR codes
          </Link>
        }
      />

      {error ? <p className="mb-4 rounded-[10px] bg-bb-accent-soft px-4 py-3 text-sm text-bb-accent-strong">{error}</p> : null}

      {loading && !data ? (
        <div className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[0, 1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-[108px]" />
            ))}
          </div>
          <Skeleton className="h-72" />
        </div>
      ) : data && e ? (
        <div className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Stat label="Paid out" value={formatMoney(e.paid, cur)} hint="Already sent to you" icon={<CheckCircleIcon className="h-4 w-4" />} />
            <Stat label="Approved" value={formatMoney(e.approved, cur)} hint="Approved, payment on the way" icon={<BanknotesIcon className="h-4 w-4" />} />
            <Stat label="Pending" value={formatMoney(e.pending, cur)} hint="Waiting for brand approval" icon={<ClockIcon className="h-4 w-4" />} />
            <Stat
              label={`Clicks · ${days} days`}
              value={formatNumber(data.totals.clicks)}
              hint={changeLabel(data.totals.change_pct, days)}
              tone={data.totals.change_pct === null ? undefined : data.totals.change_pct >= 0 ? 'up' : 'down'}
              icon={<CursorArrowRaysIcon className="h-4 w-4" />}
            />
          </div>

          <div className="grid gap-4 lg:grid-cols-5">
            <Section className="lg:col-span-3" title="Clicks on your links" actions={<Segmented value={days} options={ranges} onChange={setDays} />}>
              <div className="mb-3">
                <ChartLegend />
              </div>
              <ClicksChart series={data.series} height={240} />
            </Section>
            <Section className="lg:col-span-2" title="Earnings by month" description={`${formatMoney(e.total, cur)} earned in total`}>
              <MoneyBars data={e.monthly} currency={cur} height={268} />
            </Section>
          </div>

          <Section title="Payout history" description="Each period is closed by the brand, then approved and paid." bodyClassName="pb-2">
            {e.payouts.length === 0 ? (
              <div className="px-5 pb-3">
                <EmptyState icon={<BanknotesIcon className="h-5 w-5" />} title="No payouts yet" text="Once a brand closes a period for one of your collaborations, it shows up here." action={<Link to="/campaigns" className="bb-btn-primary">Find campaigns</Link>} />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="bb-table">
                  <thead className="bb-thead">
                    <tr>
                      <th className="bb-th">Campaign</th>
                      <th className="bb-th">Period</th>
                      <th className="bb-th text-right">Clicks</th>
                      <th className="bb-th text-right">Unique</th>
                      <th className="bb-th text-right">Amount</th>
                      <th className="bb-th">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {e.payouts.map((p) => (
                      <tr key={p.id} className="bb-tr bb-tr-hover">
                        <td className="bb-td font-medium">{p.campaign_title}</td>
                        <td className="bb-td whitespace-nowrap text-bb-muted">
                          {formatDate(p.period_start, { day: 'numeric', month: 'short' })} – {formatDate(p.period_end)}
                        </td>
                        <td className="bb-td text-right tabular-nums">{formatNumber(p.clicks_total)}</td>
                        <td className="bb-td text-right tabular-nums text-bb-muted">{formatNumber(p.clicks_unique)}</td>
                        <td className="bb-td text-right font-medium tabular-nums">{formatMoney(p.amount, p.currency)}</td>
                        <td className="bb-td">
                          <StatusBadge status={p.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Section>
        </div>
      ) : null}
    </div>
  )
}
