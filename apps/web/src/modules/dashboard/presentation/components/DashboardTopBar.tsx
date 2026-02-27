import { Link } from 'react-router-dom'
import { ArrowRightIcon } from '@heroicons/react/24/outline'

export function DashboardTopBar() {
  return (
    <div className="bb-pop bb-surface px-5 py-5">
      <div className="pointer-events-none absolute inset-0 bb-spotlight" />
      <div className="pointer-events-none absolute inset-0 bb-noise" />

      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className="bb-chip">
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{
                backgroundColor: 'rgb(var(--bb-primary) / 0.90)',
                boxShadow: '0 0 18px rgb(var(--bb-primary) / 0.30)',
              }}
            />
            Quick actions
          </div>

          <p className="mt-3 text-lg font-black tracking-tight" style={{ color: 'rgb(var(--bb-text) / 0.95)' }}>
            Find collaborations, launch faster
          </p>
          <p className="mt-1 text-sm font-semibold" style={{ color: 'rgb(var(--bb-muted) / 0.90)' }}>
            Browse campaigns and jump into what matters.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link to="/campaigns" className="bb-btn-primary h-11 px-5">
            Browse campaigns
            <ArrowRightIcon className="ml-2 h-4 w-4" />
          </Link>
          <Link to="/dashboard" className="bb-btn-ghost h-11 px-5">
            Open dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}