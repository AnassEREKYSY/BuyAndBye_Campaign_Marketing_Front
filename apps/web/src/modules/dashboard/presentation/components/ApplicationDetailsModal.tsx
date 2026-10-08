import type { CampaignApplication } from '@core/modules/dashboard/domain/entities'
import { Modal, StatusBadge, formatDate } from '@/shared/components/ui'

type Props = {
  open: boolean
  application: CampaignApplication | null
  onClose: () => void
}

export function ApplicationDetailsModal({ open, application, onClose }: Props) {
  if (!open || !application) return null

  const name = application.influencer?.displayName ?? 'Unknown creator'
  const photo = application.influencer?.photoUrl

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Application"
      footer={
        <button type="button" onClick={onClose} className="bb-btn-ghost">
          Close
        </button>
      }
    >
      <div className="flex items-center gap-3">
        <span className="bb-avatar h-10 w-10 text-sm">{photo ? <img src={photo} alt="" className="h-full w-full object-cover" /> : name.charAt(0).toUpperCase()}</span>
        <div className="min-w-0">
          <p className="truncate font-medium">{name}</p>
          <p className="text-xs text-bb-muted">Applied {formatDate(application.createdAt)}</p>
        </div>
        <span className="ml-auto">
          <StatusBadge status={application.status} />
        </span>
      </div>

      <div className="mt-5">
        <p className="text-xs text-bb-muted">Message</p>
        <p className="bb-soft-box mt-1.5 whitespace-pre-wrap p-3 text-sm">{(application.message ?? '').trim() ? application.message : 'No message.'}</p>
      </div>

      <p className="mt-4 text-xs leading-5 text-bb-muted">
        Accepting a creator starts the collaboration: a tracked link and a promo code are created for them.
      </p>
    </Modal>
  )
}
