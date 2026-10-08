import { MegaphoneIcon } from '@heroicons/react/24/outline'
import type { Campaign } from '@core/modules/dashboard'
import { Section, StatusBadge, EmptyState } from '@/shared/components/ui'

type Props = {
  title: string
  campaigns: Campaign[]
  canApply: boolean
  onSelect?: (id: string) => void
  selectedId?: string | null
}

export function CampaignList({ title, campaigns, canApply, onSelect, selectedId }: Props) {
  return (
    <Section
      title={title}
      description={canApply ? 'Apply from the campaign details.' : 'Brands can browse but cannot apply.'}
      actions={<span className="text-xs text-bb-muted">{campaigns.length} campaigns</span>}
    >
      {campaigns.length === 0 ? (
        <EmptyState icon={<MegaphoneIcon className="h-5 w-5" />} title="No campaigns found" />
      ) : (
        <ul className="-mx-5 border-t border-bb-border/10">
          {campaigns.slice(0, 8).map((c) => (
            <li key={c.id} className="border-b border-bb-border/10 last:border-b-0">
              <button
                type="button"
                onClick={() => onSelect?.(c.id)}
                className={`flex w-full items-center justify-between gap-3 px-5 py-3 text-left transition-colors hover:bg-bb-subtle ${
                  selectedId === c.id ? 'bg-bb-subtle' : ''
                }`}
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{c.title}</p>
                  <p className="mt-0.5 truncate text-xs text-bb-muted">
                    {c.commissionType ? `${c.commissionType} · ${c.commissionValue ?? 0}` : 'No commission set'}
                  </p>
                </div>
                <StatusBadge status={c.status} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </Section>
  )
}
