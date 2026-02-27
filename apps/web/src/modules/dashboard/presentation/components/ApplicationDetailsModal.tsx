import type { CampaignApplication } from '@core/modules/dashboard/domain/entities'

type Props = {
  open: boolean
  application: CampaignApplication | null
  onClose: () => void
}

export function ApplicationDetailsModal({ open, application, onClose }: Props) {
  if (!open || !application) return null

  const name = application.influencer?.displayName ?? 'Unknown influencer'
  const photo = application.influencer?.photoUrl

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="bb-surface bb-pop w-full max-w-2xl overflow-hidden rounded-[26px]">
        <div
          className="flex items-center justify-between border-b p-4"
          style={{ borderColor: 'rgb(var(--bb-border) / 0.10)', backgroundColor: 'rgb(var(--bb-surface) / 0.70)' }}
        >
          <div className="flex items-center gap-3">
            <div
              className="h-11 w-11 overflow-hidden rounded-full border"
              style={{ borderColor: 'rgb(var(--bb-border) / 0.10)', backgroundColor: 'rgb(var(--bb-border) / 0.04)' }}
            >
              {photo ? <img src={photo} alt="" className="h-full w-full object-cover" /> : null}
            </div>
            <div>
              <p className="text-sm font-extrabold" style={{ color: 'rgb(var(--bb-text) / 0.95)' }}>
                {name}
              </p>
              <p className="text-xs font-semibold" style={{ color: 'rgb(var(--bb-muted) / 0.82)' }}>
                {application.influencerId}
              </p>
            </div>
          </div>

          <button onClick={onClose} className="bb-btn-ghost h-10 px-4">
            Close
          </button>
        </div>

        <div className="space-y-4 p-4">
          <div className="bb-card p-4">
            <p className="text-xs font-extrabold uppercase tracking-wider" style={{ color: 'rgb(var(--bb-muted) / 0.82)' }}>
              Application
            </p>

            <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
              <div style={{ color: 'rgb(var(--bb-muted) / 0.85)' }}>Status</div>
              <div className="font-extrabold" style={{ color: 'rgb(var(--bb-text) / 0.92)' }}>
                {application.status}
              </div>

              <div style={{ color: 'rgb(var(--bb-muted) / 0.85)' }}>Campaign</div>
              <div className="font-extrabold" style={{ color: 'rgb(var(--bb-text) / 0.92)' }}>
                {application.campaignId}
              </div>

              <div style={{ color: 'rgb(var(--bb-muted) / 0.85)' }}>Created</div>
              <div className="font-extrabold" style={{ color: 'rgb(var(--bb-text) / 0.92)' }}>
                {application.createdAt ? new Date(application.createdAt).toLocaleString() : '—'}
              </div>
            </div>
          </div>

          <div className="bb-card p-4">
            <p className="text-xs font-extrabold uppercase tracking-wider" style={{ color: 'rgb(var(--bb-muted) / 0.82)' }}>
              Message
            </p>
            <p className="mt-3 whitespace-pre-wrap text-sm font-semibold" style={{ color: 'rgb(var(--bb-muted) / 0.90)' }}>
              {(application.message ?? '').trim() ? application.message : '—'}
            </p>
          </div>

          <div className="bb-card p-4">
            <p className="text-xs font-extrabold uppercase tracking-wider" style={{ color: 'rgb(var(--bb-muted) / 0.82)' }}>
              Note
            </p>
            <p className="mt-2 text-sm font-semibold" style={{ color: 'rgb(var(--bb-muted) / 0.90)' }}>
              When you finalize a candidate, collaboration starts automatically (tracking link + promo code), and payouts are handled by your existing endpoints.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}