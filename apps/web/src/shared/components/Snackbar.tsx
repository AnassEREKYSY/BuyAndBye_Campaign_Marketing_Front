import { useEffect, useMemo, useRef, useState } from 'react'
import { NotificationType } from '@buyandbye/core'
import { useNotification } from '@/shared/context/notification'
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'

function tone(type: NotificationType) {
  switch (type) {
    case 'success':
      return { wrap: 'bb-snack-success', icon: 'text-bb-success', Icon: CheckCircleIcon }
    case 'error':
      return { wrap: 'bb-snack-error', icon: 'text-bb-accent-strong', Icon: XCircleIcon }
    case 'warning':
      return { wrap: 'bb-snack-warning', icon: 'text-bb-warning', Icon: ExclamationTriangleIcon }
    case 'info':
    default:
      return { wrap: 'bb-snack-info', icon: 'text-bb-primary-strong', Icon: InformationCircleIcon }
  }
}

export function Snackbar() {
  const { current, clear } = useNotification() as any
  const [visible, setVisible] = useState(false)
  const timer = useRef<number | null>(null)

  const duration = current?.options?.duration ?? 1800
  const t = useMemo(() => (current ? tone(current.type) : null), [current])

  useEffect(() => {
    if (!current) return
    setVisible(true)
    if (timer.current) window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setVisible(false), Math.max(450, duration - 180))
    return () => {
      if (timer.current) window.clearTimeout(timer.current)
    }
  }, [current, duration])

  useEffect(() => {
    if (!current) return
    if (!visible) {
      const id = window.setTimeout(() => clear?.(), 250)
      return () => window.clearTimeout(id)
    }
  }, [visible, current, clear])

  if (!current || !t) return null
  const Icon = t.Icon

  return (
    <div className="pointer-events-none fixed inset-x-0 top-4 z-[70] flex justify-center px-4">
      <div
        className={`bb-snack ${t.wrap} ${visible ? 'bb-snack-in' : 'bb-snack-out'} pointer-events-auto w-full max-w-md items-center`}
        role="status"
        aria-live="polite"
      >
        <Icon className={`h-5 w-5 shrink-0 ${t.icon}`} />
        <p className="min-w-0 flex-1 font-medium">{current.message}</p>
        <button
          type="button"
          className="bb-icon-btn -my-1 -mr-2 h-8 w-8 shrink-0"
          onClick={() => {
            setVisible(false)
            clear?.()
          }}
          aria-label="Dismiss"
        >
          <XMarkIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
