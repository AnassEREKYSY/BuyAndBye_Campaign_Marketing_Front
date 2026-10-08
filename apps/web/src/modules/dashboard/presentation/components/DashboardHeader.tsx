import { useId, type ReactNode } from 'react'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { PageHeader } from '@/shared/components/ui'

type Props = {
  title: string
  subtitle: string
  search: string
  onSearch: (v: string) => void
  rightSlot?: ReactNode
  searchPlaceholder?: string
}

/** Page header with a search field. */
export function DashboardHeader({ title, subtitle, search, onSearch, rightSlot, searchPlaceholder }: Props) {
  const id = useId()

  return (
    <PageHeader
      title={title}
      description={subtitle}
      actions={
        <>
          <div className="relative w-full sm:w-72">
            <label htmlFor={id} className="sr-only">
              Search
            </label>
            <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-bb-muted" />
            <input
              id={id}
              type="search"
              value={search}
              onChange={(e) => onSearch(e.target.value)}
              placeholder={searchPlaceholder ?? 'Search'}
              className="bb-input pl-9"
            />
          </div>
          {rightSlot}
        </>
      }
    />
  )
}
