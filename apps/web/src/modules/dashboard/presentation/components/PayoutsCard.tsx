import { Link } from 'react-router-dom'
import { BanknotesIcon } from '@heroicons/react/24/outline'
import type { Payout } from '@core/modules/dashboard'
import { Section, StatusBadge, EmptyState, formatMoney, formatDate } from '@/shared/components/ui'

type Props = {
  title: string
  payouts: Payout[]
}

export function PayoutsCard({ title, payouts }: Props) {
  const currency = payouts[0]?.currency ?? 'MAD'
  const total = payouts.reduce((acc, p) => acc + (Number(p.amount) || 0), 0)

  return (
    <Section
      title={title}
      description={payouts.length ? `${formatMoney(total, currency)} in total` : undefined}
      actions={
        payouts.length ? (
          <Link to="/earnings" className="bb-link text-sm">
            View all
          </Link>
        ) : null
      }
      className="h-full"
    >
      {payouts.length === 0 ? (
        <EmptyState icon={<BanknotesIcon className="h-5 w-5" />} title="No payouts yet" text="Payouts appear once a period closes." />
      ) : (
        <ul className="-mx-5 divide-y divide-bb-border/10 border-t border-bb-border/10">
          {payouts.slice(0, 6).map((p) => (
            <li key={p.id} className="flex items-center justify-between gap-3 px-5 py-3">
              <div className="min-w-0">
                <p className="text-sm font-medium tabular-nums">{formatMoney(p.amount, p.currency)}</p>
                <p className="mt-0.5 text-xs text-bb-muted">{p.createdAt ? formatDate(p.createdAt) : 'Payout'}</p>
              </div>
              <StatusBadge status={p.status} />
            </li>
          ))}
        </ul>
      )}
    </Section>
  )
}
