import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { ChartBarIcon } from '@heroicons/react/24/outline'
import { EmptyState, formatDate, formatMoney, formatNumber } from '@/shared/components/ui'
import type { Breakdown, SeriesPoint } from '../../application/useOverview'

const PRIMARY = 'rgb(var(--bb-primary))'
const ACCENT = 'rgb(var(--bb-accent))'
const GRID = 'rgb(var(--bb-border) / 0.08)'
const AXIS = { fill: 'rgb(var(--bb-muted))', fontSize: 12 }

function TooltipBox({ title, rows }: { title: string; rows: Array<{ label: string; value: string; color: string }> }) {
  return (
    <div className="bb-popover px-3 py-2 text-xs">
      <p className="text-bb-muted">{title}</p>
      {rows.map((r) => (
        <p key={r.label} className="mt-1 flex items-center gap-2 text-bb-text">
          <span className="h-2 w-2 rounded-full" style={{ background: r.color }} />
          <span className="font-medium tabular-nums">{r.value}</span>
          <span className="text-bb-muted">{r.label}</span>
        </p>
      ))}
    </div>
  )
}

/** Clicks and unique visitors per day. */
export function ClicksChart({ series, height = 260 }: { series: SeriesPoint[]; height?: number }) {
  const hasData = series.some((p) => p.clicks > 0)
  if (!hasData) {
    return <EmptyState icon={<ChartBarIcon className="h-5 w-5" />} title="No clicks in this period" text="Clicks appear here as soon as people open a tracked link." />
  }

  const interval = series.length > 31 ? 13 : series.length > 8 ? 4 : 0

  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={series} margin={{ top: 8, right: 4, left: -12, bottom: 0 }}>
          <CartesianGrid stroke={GRID} vertical={false} />
          <XAxis dataKey="date" tick={AXIS} tickLine={false} axisLine={false} interval={interval} tickFormatter={(d) => formatDate(d, { day: 'numeric', month: 'short' })} />
          <YAxis tick={AXIS} tickLine={false} axisLine={false} allowDecimals={false} width={44} />
          <Tooltip
            cursor={{ stroke: 'rgb(var(--bb-border) / 0.2)' }}
            content={({ active, payload }) =>
              active && payload?.length ? (
                <TooltipBox
                  title={formatDate((payload[0].payload as SeriesPoint).date, { weekday: 'short', day: 'numeric', month: 'short' })}
                  rows={[
                    { label: 'clicks', value: formatNumber((payload[0].payload as SeriesPoint).clicks), color: PRIMARY },
                    { label: 'unique', value: formatNumber((payload[0].payload as SeriesPoint).unique_clicks), color: ACCENT },
                  ]}
                />
              ) : null
            }
          />
          <Area type="monotone" dataKey="clicks" stroke={PRIMARY} strokeWidth={2} fill={PRIMARY} fillOpacity={0.12} />
          <Area type="monotone" dataKey="unique_clicks" stroke={ACCENT} strokeWidth={1.5} fill="none" strokeDasharray="4 3" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export function ChartLegend() {
  return (
    <div className="flex items-center gap-4 text-xs text-bb-muted">
      <span className="flex items-center gap-1.5">
        <span className="h-0.5 w-4 rounded bg-bb-primary" /> Clicks
      </span>
      <span className="flex items-center gap-1.5">
        <span className="h-0.5 w-4 rounded border-t-2 border-dashed border-bb-accent" /> Unique visitors
      </span>
    </div>
  )
}

/** Monthly amounts as simple bars. */
export function MoneyBars({ data, currency, height = 220 }: { data: Array<{ month: string; amount: number }>; currency: string; height?: number }) {
  if (!data.length) {
    return <EmptyState title="No payouts yet" text="Payout periods show up here once a brand closes them." />
  }
  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 4, left: -8, bottom: 0 }}>
          <CartesianGrid stroke={GRID} vertical={false} />
          <XAxis dataKey="month" tick={AXIS} tickLine={false} axisLine={false} tickFormatter={(m) => formatDate(`${m}-01`, { month: 'short' })} />
          <YAxis tick={AXIS} tickLine={false} axisLine={false} width={48} />
          <Tooltip
            cursor={{ fill: 'rgb(var(--bb-border) / 0.05)' }}
            content={({ active, payload }) =>
              active && payload?.length ? (
                <TooltipBox
                  title={formatDate(`${(payload[0].payload as { month: string }).month}-01`, { month: 'long', year: 'numeric' })}
                  rows={[{ label: '', value: formatMoney(Number(payload[0].value), currency), color: PRIMARY }]}
                />
              ) : null
            }
          />
          <Bar dataKey="amount" fill={PRIMARY} radius={[4, 4, 0, 0]} maxBarSize={44} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

/** Horizontal bars for small breakdowns (sources, devices). */
export function BarList({ items, labelKey }: { items: Breakdown[]; labelKey: 'source' | 'device' }) {
  const total = items.reduce((s, i) => s + i.clicks, 0)
  if (!total) return <p className="py-6 text-center text-sm text-bb-muted">No data for this period.</p>
  const max = Math.max(...items.map((i) => i.clicks))
  return (
    <ul className="grid gap-2.5">
      {items
        .filter((i) => i.clicks > 0)
        .map((i, idx) => (
          <li key={String(i[labelKey])}>
            <div className="mb-1 flex items-center justify-between text-sm">
              <span>{i[labelKey]}</span>
              <span className="tabular-nums text-bb-muted">
                {formatNumber(i.clicks)} · {Math.round((i.clicks / total) * 100)}%
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-bb-border/[0.07]">
              <div className={`h-full rounded-full ${idx === 0 ? 'bg-bb-primary' : 'bg-bb-primary/50'}`} style={{ width: `${(i.clicks / max) * 100}%` }} />
            </div>
          </li>
        ))}
    </ul>
  )
}
