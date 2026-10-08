import { Link } from 'react-router-dom'
import { CubeIcon, MegaphoneIcon } from '@heroicons/react/24/outline'

export function BrandManagementTopButtons() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Link to="/dashboard/brand/products" className="bb-btn-ghost">
        <CubeIcon className="h-[18px] w-[18px]" />
        Manage products
      </Link>
      <Link to="/dashboard/brand/campaigns" className="bb-btn-ghost">
        <MegaphoneIcon className="h-[18px] w-[18px]" />
        Manage campaigns
      </Link>
    </div>
  )
}
