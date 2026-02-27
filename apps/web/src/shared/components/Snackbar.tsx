import { useEffect, useMemo, useRef, useState } from 'react'
import { NotificationType } from '@buyandbye/core'
import { useNotification } from '@/shared/context/notification'
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline'

function tone(type: NotificationType) {
  switch (type) {
    case 'success':
      return { wrap: 'bb-snack-success', label: 'Success', Icon: CheckCircleIcon }
    case 'error':
      return { wrap: 'bb-snack-error', label: 'Error', Icon: XCircleIcon }
    case 'warning':
      return { wrap: 'bb-snack-warning', label: 'Warning', Icon: ExclamationTriangleIcon }
    case 'info':
    default:
      return { wrap: 'bb-snack-info', label: 'Info', Icon: InformationCircleIcon }
  }
}

export function Snackbar() {
  const { current } = useNotification()
  const [visible, setVisible] = useState(false)
  const [progressKey, setProgressKey] = useState(0)
  const timer = useRef<number | null>(null)

  const duration = current?.options?.duration ?? 1800
  const t = useMemo(() => (current ? tone(current.type) : null), [current])

  useEffect(() => {
    if (!current) return
    setVisible(true)
    setProgressKey((k) => k + 1)
    if (timer.current) window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setVisible(false), Math.max(450, duration - 180))
    return () => {
      if (timer.current) window.clearTimeout(timer.current)
    }
  }, [current, duration])

  if (!current || !t) return null
  const Icon = t.Icon

  return (
    <div className="pointer-events-none fixed inset-x-0 top-4 z-[60] flex justify-center px-4">
      <div
        className={['pointer-events-auto w-full max-w-xl', 'bb-snack', t.wrap, visible ? 'bb-snack-in' : 'bb-snack-out'].join(' ')}
        role="status"
        aria-live="polite"
        style={{
          backgroundColor: 'rgb(var(--bb-surface) / 0.92)',
          color: 'rgb(var(--bb-text) / 0.95)',
        }}
      >
        <div className="flex items-start gap-3 px-4 py-3">
          <span
            className="mt-0.5 rounded-xl border p-2"
            style={{
              borderColor: 'rgb(var(--bb-border) / 0.10)',
              backgroundColor: 'rgb(var(--bb-border) / 0.04)',
            }}
          >
            <Icon className="h-5 w-5" />
          </span>

          <div className="min-w-0 flex-1">
            <p className="text-xs font-extrabold tracking-wide" style={{ color: 'rgb(var(--bb-muted) / 0.85)' }}>
              {t.label}
            </p>
            <p className="mt-0.5 truncate text-sm font-extrabold leading-6">{current.message}</p>
          </div>
        </div>

        <div className="h-1 w-full" style={{ backgroundColor: 'rgb(var(--bb-border) / 0.06)' }}>
          <div
            key={progressKey}
            className="h-full"
            style={{
              width: '100%',
              transformOrigin: 'left',
              backgroundColor: 'rgb(var(--bb-accent) / 0.55)',
              animation: `bb-snack-progress ${duration}ms linear forwards`,
            }}
          />
        </div>

        <style>{`
          @keyframes bb-snack-progress {
            from { transform: scaleX(1); opacity: 0.9; }
            to { transform: scaleX(0); opacity: 0.55; }
          }
        `}</style>
      </div>
    </div>
  )
}