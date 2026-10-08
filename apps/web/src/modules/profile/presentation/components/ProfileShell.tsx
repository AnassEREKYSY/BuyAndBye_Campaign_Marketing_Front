import type { ReactNode } from 'react'
import { PageHeader } from '@/shared/components/ui'

type Item = {
  key: string
  label: string
  icon?: ReactNode
  description?: string
}

export function ProfileShell({
  title,
  subtitle,
  items,
  activeKey,
  onSelect,
  children,
}: {
  title: string
  subtitle?: string
  items: Item[]
  activeKey: string
  onSelect: (key: string) => void
  children: ReactNode
}) {
  return (
    <div>
      <PageHeader title={title} description={subtitle} />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-[220px_1fr]">
        <nav aria-label="Profile sections" className="flex gap-1 overflow-x-auto md:flex-col md:overflow-visible">
          {items.map((it) => {
            const active = it.key === activeKey
            return (
              <button
                key={it.key}
                type="button"
                onClick={() => onSelect(it.key)}
                aria-current={active ? 'page' : undefined}
                className={`bb-side-link shrink-0 whitespace-nowrap text-left ${active ? 'bb-side-link-active' : ''}`}
              >
                {it.icon}
                {it.label}
              </button>
            )
          })}
        </nav>

        <section className="bb-card min-w-0 p-5 sm:p-6">{children}</section>
      </div>
    </div>
  )
}
