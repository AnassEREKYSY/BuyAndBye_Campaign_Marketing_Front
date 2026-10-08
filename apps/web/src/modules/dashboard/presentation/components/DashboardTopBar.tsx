import { Link } from 'react-router-dom'
import { ArrowRightIcon } from '@heroicons/react/24/outline'

/** Small quick-actions card. */
export function DashboardTopBar() {
  return (
    <div className="bb-card flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <p className="font-semibold">Find collaborations</p>
        <p className="mt-1 text-sm text-bb-muted">Browse open campaigns and apply in a few clicks.</p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Link to="/campaigns" className="bb-btn-primary">
          Browse campaigns
          <ArrowRightIcon className="h-4 w-4" />
        </Link>
        <Link to="/dashboard" className="bb-btn-ghost">
          Overview
        </Link>
      </div>
    </div>
  )
}
