import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { CheckIcon, ClipboardDocumentIcon, QrCodeIcon, ArrowTopRightOnSquareIcon, LinkIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { PageHeader, StatusBadge, EmptyState, Skeleton, Segmented, formatNumber, formatDate } from '@/shared/components/ui'
import { useOverview, type CreatorLink, type CreatorOverview, type RangeDays } from '@/modules/analytics/application/useOverview'
import { QrCodeModal } from '../components/QrCodeModal'

type Filter = 'active' | 'all'

function useCopy() {
  const [copied, setCopied] = useState<string | null>(null)
  async function copy(key: string, value: string) {
    try {
      await navigator.clipboard.writeText(value)
    } catch {
      const t = document.createElement('textarea')
      t.value = value
      document.body.appendChild(t)
      t.select()
      document.execCommand('copy')
      t.remove()
    }
    setCopied(key)
    setTimeout(() => setCopied((k) => (k === key ? null : k)), 1500)
  }
  return { copied, copy }
}

function CopyField({ label, value, copyKey, copied, onCopy, mono = false, children }: { label: string; value: string; copyKey: string; copied: string | null; onCopy: (k: string, v: string) => void; mono?: boolean; children?: React.ReactNode }) {
  const isCopied = copied === copyKey
  return (
    <div>
      <p className="mb-1 text-xs text-bb-muted">{label}</p>
      <div className="flex items-center gap-1 rounded-[10px] border border-bb-border/15 bg-bb-subtle py-1 pl-3 pr-1">
        <span className={`min-w-0 flex-1 truncate text-sm ${mono ? 'font-mono tracking-wide' : ''}`} title={value}>
          {value}
        </span>
        {children}
        <button type="button" className="bb-icon-btn h-8 w-8" onClick={() => onCopy(copyKey, value)} aria-label={`Copy ${label.toLowerCase()}`}>
          {isCopied ? <CheckIcon className="h-4 w-4 text-bb-success" /> : <ClipboardDocumentIcon className="h-4 w-4" />}
        </button>
      </div>
    </div>
  )
}

function hostOf(url: string | null) {
  try {
    return url ? new URL(url).host : 'the product page'
  } catch {
    return url ?? 'the product page'
  }
}

function commissionLabel(c: CreatorLink['commission']) {
  return c.type === 'percent' ? `${c.value}% commission` : `${c.value} MAD per sale`
}

export default function LinksPage() {
  const [days, setDays] = useState<RangeDays>(30)
  const [filter, setFilter] = useState<Filter>('active')
  const [query, setQuery] = useState('')
  const [qrFor, setQrFor] = useState<CreatorLink | null>(null)
  const { data, loading, error } = useOverview<CreatorOverview>('influencer', days)
  const { copied, copy } = useCopy()

  const links = useMemo(() => {
    const q = query.trim().toLowerCase()
    return (data?.links ?? [])
      .filter((l) => (filter === 'active' ? l.status === 'active' : true))
      .filter((l) => !q || `${l.campaign.title} ${l.brand_name ?? ''} ${l.promo_code ?? ''}`.toLowerCase().includes(q))
  }, [data, filter, query])

  const activeCount = (data?.links ?? []).filter((l) => l.status === 'active').length

  return (
    <div>
      <PageHeader title="Links & QR codes" description="Your tracked links and promo codes for every collaboration. Share them anywhere, every click is counted." />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <Segmented
            value={filter}
            onChange={setFilter}
            options={[
              { value: 'active', label: `Active (${activeCount})` },
              { value: 'all', label: `All (${data?.links.length ?? 0})` },
            ]}
          />
          <Segmented
            value={days}
            onChange={setDays}
            options={[
              { value: 7 as RangeDays, label: '7d' },
              { value: 30 as RangeDays, label: '30d' },
              { value: 90 as RangeDays, label: '90d' },
            ]}
          />
        </div>
        <label className="relative sm:w-64">
          <span className="sr-only">Search</span>
          <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-bb-muted" />
          <input className="bb-input pl-9" placeholder="Search campaign or code" value={query} onChange={(e) => setQuery(e.target.value)} />
        </label>
      </div>

      {error ? <p className="mb-4 rounded-[10px] bg-bb-accent-soft px-4 py-3 text-sm text-bb-accent-strong">{error}</p> : null}

      {loading && !data ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {[0, 1].map((i) => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      ) : links.length === 0 ? (
        <EmptyState
          icon={<LinkIcon className="h-5 w-5" />}
          title={query ? 'No match' : 'No links yet'}
          text={query ? 'Try another search.' : 'When a brand accepts your application, you get a tracked link and a promo code here.'}
          action={
            query ? null : (
              <Link to="/campaigns" className="bb-btn-primary">
                Find campaigns
              </Link>
            )
          }
        />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {links.map((l) => (
            <article key={l.collaboration_id} className="bb-card flex flex-col gap-4">
              <header className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <Link to={`/collaborations/${l.collaboration_id}`} className="block truncate font-semibold hover:underline">
                    {l.campaign.title}
                  </Link>
                  <p className="mt-0.5 text-sm text-bb-muted">
                    {l.brand_name ?? 'Brand'} · {commissionLabel(l.commission)}
                  </p>
                </div>
                <StatusBadge status={l.status} />
              </header>

              <div className="grid grid-cols-3 gap-2 rounded-[10px] bg-bb-subtle p-3 text-center">
                <div>
                  <p className="text-lg font-semibold tabular-nums">{formatNumber(l.clicks_in_range)}</p>
                  <p className="text-xs text-bb-muted">Clicks · {days}d</p>
                </div>
                <div>
                  <p className="text-lg font-semibold tabular-nums">{formatNumber(l.clicks)}</p>
                  <p className="text-xs text-bb-muted">All time</p>
                </div>
                <div>
                  <p className="text-lg font-semibold">{formatDate(l.accepted_at, { day: 'numeric', month: 'short' })}</p>
                  <p className="text-xs text-bb-muted">Started</p>
                </div>
              </div>

              {l.tracking.url ? (
                <CopyField label="Tracked link" value={l.tracking.url} copyKey={`${l.collaboration_id}-url`} copied={copied} onCopy={copy}>
                  <a href={l.tracking.url} target="_blank" rel="noreferrer" className="bb-icon-btn h-8 w-8" aria-label="Open link">
                    <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                  </a>
                </CopyField>
              ) : null}

              {l.promo_code ? <CopyField label="Promo code" value={l.promo_code} copyKey={`${l.collaboration_id}-promo`} copied={copied} onCopy={copy} mono /> : null}

              <footer className="mt-auto flex items-center justify-between gap-3 border-t border-bb-border/10 pt-4">
                <p className="min-w-0 truncate text-xs text-bb-muted" title={l.tracking.destination_url ?? ''}>
                  Opens {hostOf(l.tracking.destination_url)}
                </p>
                <button type="button" className="bb-btn-ghost h-9 shrink-0" onClick={() => setQrFor(l)} disabled={!l.tracking.url}>
                  <QrCodeIcon className="h-4 w-4" />
                  QR code
                </button>
              </footer>
            </article>
          ))}
        </div>
      )}

      <QrCodeModal
        open={Boolean(qrFor)}
        onClose={() => setQrFor(null)}
        url={qrFor?.tracking.url ?? ''}
        title={qrFor?.campaign.title ?? ''}
        fileName={`kickback-${qrFor?.tracking.code ?? 'link'}`}
      />
    </div>
  )
}
