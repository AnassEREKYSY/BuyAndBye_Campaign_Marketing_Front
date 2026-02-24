import { useNavigate } from 'react-router-dom'

export function BrandManagementTopButtons() {
  const nav = useNavigate()

  return (
    <div className="mt-4 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
      <button onClick={() => nav('/dashboard/brand/products')} className="bb-btn-ghost h-11 w-full px-5 sm:w-auto">
        Manage products
      </button>
      <button onClick={() => nav('/dashboard/brand/campaigns')} className="bb-btn-ghost h-11 w-full px-5 sm:w-auto">
        Manage campaigns
      </button>
    </div>
  )
}