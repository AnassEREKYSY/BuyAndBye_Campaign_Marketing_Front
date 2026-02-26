import { Link } from 'react-router-dom'

export function DashboardTopBar() {
  return (
    <div className="bb-gradient-border bb-glass bb-ring relative overflow-hidden rounded-[26px] border border-white/10 px-5 py-4">
      <div className="pointer-events-none absolute inset-0 bb-spotlight" />
      <div className="pointer-events-none absolute inset-0 bb-grid" />
      <div className="pointer-events-none absolute inset-0 bb-noise" />

      <div className="relative flex items-center justify-center">
        <Link to="/campaigns" className="bb-btn-primary h-12 px-6">
          Browse campaigns
        </Link>
      </div>
    </div>
  )
}