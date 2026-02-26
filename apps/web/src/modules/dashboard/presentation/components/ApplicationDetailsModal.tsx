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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-2xl rounded-2xl border border-white/10 bg-[#0e0f12] text-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 p-4">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 overflow-hidden rounded-full border border-white/10 bg-white/5">
              {photo ? <img src={photo} className="h-full w-full object-cover" /> : null}
            </div>
            <div>
              <p className="text-sm font-extrabold">{name}</p>
              <p className="text-xs text-white/50">{application.influencerId}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-extrabold text-white/90"
          >
            Close
          </button>
        </div>

        <div className="space-y-4 p-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-wider text-white/50">Application</p>
            <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
              <div className="text-white/50">Status</div>
              <div className="font-bold">{application.status}</div>

              <div className="text-white/50">Campaign</div>
              <div className="font-bold">{application.campaignId}</div>

              <div className="text-white/50">Created</div>
              <div className="font-bold">{application.createdAt ? new Date(application.createdAt).toLocaleString() : '—'}</div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-wider text-white/50">Message</p>
            <p className="mt-3 whitespace-pre-wrap text-sm text-white/80">
              {(application.message ?? '').trim() ? application.message : '—'}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-wider text-white/50">Note</p>
            <p className="mt-2 text-sm text-white/70">
              When you finalize a candidate, collaboration starts automatically (tracking link + promo code),
              and payouts are handled by your existing endpoints.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}