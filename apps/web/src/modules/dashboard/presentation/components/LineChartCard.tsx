import { useMemo } from 'react'
import type { DashboardTimelinePoint } from '@core/modules/dashboard'

type Props = {
  title: string
  subtitle: string
  data: DashboardTimelinePoint[]
  height?: number
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}

export function LineChartCard({ title, subtitle, data, height = 220 }: Props) {
  const { path, max, min, last, trendUp } = useMemo(() => {
    const points = data.slice(-14)
    const values = points.map((p) => p.total)
    const minV = values.length ? Math.min(...values) : 0
    const maxV = values.length ? Math.max(...values) : 0

    const w = 900
    const h = 300
    const pad = 18

    const dx = points.length > 1 ? (w - pad * 2) / (points.length - 1) : 0
    const norm = (v: number) => {
      if (maxV === minV) return h / 2
      const t = (v - minV) / (maxV - minV)
      return pad + (1 - t) * (h - pad * 2)
    }

    const d = points
      .map((p, i) => {
        const x = pad + i * dx
        const y = norm(p.total)
        return `${i === 0 ? 'M' : 'L'} ${x} ${y}`
      })
      .join(' ')

    const lastV = points.at(-1)?.total ?? 0
    const prevV = points.length > 1 ? points.at(-2)?.total ?? lastV : lastV

    return {
      path: d,
      min: minV,
      max: maxV,
      last: lastV,
      trendUp: lastV >= prevV,
    }
  }, [data])

  return (
    <div className="rounded-3xl border border-white/10 bg-[#0e0f12] p-4 text-white shadow-[0_16px_44px_rgba(0,0,0,0.45)]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-extrabold tracking-tight">{title}</p>
          <p className="mt-0.5 text-xs font-semibold text-white/50">{subtitle}</p>
        </div>

        <div
          className={`rounded-full border px-3 py-1 text-xs font-extrabold ${
            trendUp
              ? 'border-emerald-500/25 bg-emerald-500/10 text-emerald-200'
              : 'border-rose-500/25 bg-rose-500/10 text-rose-200'
          }`}
        >
          {last}
        </div>
      </div>

      <div className="mt-3 rounded-2xl border border-white/10 bg-black/20">
        <svg viewBox="0 0 900 300" className="w-full" style={{ height }}>
          <path d={path} fill="none" stroke="currentColor" strokeWidth="3" opacity={0.9} />
          <path d={`${path} L 882 282 L 18 282 Z`} fill="currentColor" opacity={0.08} />
        </svg>
      </div>

      <div className="mt-3 flex items-center justify-between text-xs font-semibold text-white/45">
        <span>Min: {clamp(min, 0, Number.MAX_SAFE_INTEGER)}</span>
        <span>Max: {clamp(max, 0, Number.MAX_SAFE_INTEGER)}</span>
      </div>
    </div>
  )
}