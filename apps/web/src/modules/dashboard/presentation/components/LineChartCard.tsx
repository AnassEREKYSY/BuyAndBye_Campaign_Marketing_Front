import { useId, useMemo } from 'react'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { ChartBarIcon } from '@heroicons/react/24/outline'
import type { DashboardTimelinePoint } from '@core/modules/dashboard'
import { Section, Skeleton, EmptyState, formatNumber, formatDate } from '@/shared/components/ui'

type Props = {
  title: string
  subtitle: string
  data: DashboardTimelinePoint[]
  height?: number
  loading?: boolean
}

const PRIMARY = 'rgb(var(--bb-primary))'
const GRID = 'rgb(var(--bb-border) / 0.08)'
const AXIS = 'rgb(var(--bb-muted))'

function shortDate(d: string) {
  return formatDate(d, { day: 'numeric', month: 'short' })
}

function ChartTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload: DashboardTimelinePoint }> }) {
  if (!active || !payload?.length) return null
  const p = payload[0].payload
  return (
    <div className="bb-popover px-3 py-2 text-xs">
      <p className="text-bb-muted">{formatDate(p.date)}</p>
      <p className="mt-0.5 font-medium text-bb-text">{formatNumber(p.total)} clicks</p>
    </div>
  )
}

export function LineChartCard({ title, subtitle, data, height = 220, loading = false }: Props) {
  const gradientId = `bb-area-${useId().replace(/:/g, '')}`

  const { points, total, hasData } = useMemo(() => {
    const pts = (Array.isArray(data) ? data : [])
      .slice(-14)
      .map((p) => ({ ...p, total: Number.isFinite(Number(p.total)) ? Number(p.total) : 0 }))
    const sum = pts.reduce((acc, p) => acc + p.total, 0)
    return { points: pts, total: sum, hasData: pts.length > 0 && sum > 0 }
  }, [data])

  return (
    <Section
      title={title}
      description={subtitle}
      actions={hasData && !loading ? <span className="text-sm font-medium tabular-nums">{formatNumber(total)} total</span> : null}
    >
      {loading ? (
        <div style={{ height }}>
          <Skeleton className="h-full w-full" />
        </div>
      ) : !hasData ? (
        <div style={{ height }} className="grid place-items-center">
          <EmptyState
            icon={<ChartBarIcon className="h-5 w-5" />}
            title="No clicks yet"
            text="Clicks will show up here as soon as people use the tracked links."
          />
        </div>
      ) : (
        <div style={{ height }} className="-ml-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={points} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={PRIMARY} stopOpacity={0.22} />
                  <stop offset="100%" stopColor={PRIMARY} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke={GRID} vertical={false} />
              <XAxis
                dataKey="date"
                tickFormatter={shortDate}
                tick={{ fill: AXIS, fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                minTickGap={24}
                tickMargin={8}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fill: AXIS, fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                width={40}
              />
              <Tooltip content={<ChartTooltip />} cursor={{ stroke: GRID, strokeWidth: 1 }} />
              <Area
                type="monotone"
                dataKey="total"
                stroke={PRIMARY}
                strokeWidth={2}
                fill={`url(#${gradientId})`}
                dot={false}
                activeDot={{ r: 4, fill: PRIMARY, stroke: 'rgb(var(--bb-card))', strokeWidth: 2 }}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </Section>
  )
}
