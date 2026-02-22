import { useEffect, useMemo, useRef, useState } from 'react'
import { NotificationType } from '@buyandbye/core'
import { useNotification } from '@/shared/context/notification'

function tone(type: NotificationType) {
  switch (type) {
    case 'success':
      return {
        wrap: 'border-emerald-400/25 bg-emerald-500/10 text-emerald-50',
        dot: 'bg-emerald-400',
        bar: 'bg-emerald-400/70',
        label: 'Success',
      }
    case 'error':
      return {
        wrap: 'border-rose-400/25 bg-rose-500/10 text-rose-50',
        dot: 'bg-rose-400',
        bar: 'bg-rose-400/70',
        label: 'Error',
      }
    case 'warning':
      return {
        wrap: 'border-amber-400/25 bg-amber-500/10 text-amber-50',
        dot: 'bg-amber-400',
        bar: 'bg-amber-400/70',
        label: 'Warning',
      }
    case 'info':
    default:
      return {
        wrap: 'border-sky-400/25 bg-sky-500/10 text-sky-50',
        dot: 'bg-sky-400',
        bar: 'bg-sky-400/70',
        label: 'Info',
      }
  }
}

export function Snackbar() {
  const { current } = useNotification()
  const [visible, setVisible] = useState(false)
  const [progressKey, setProgressKey] = useState(0)
  const timer = useRef<number | null>(null)

  const duration = current?.options?.duration ?? 2800
  const t = useMemo(() => (current ? tone(current.type) : null), [current])

  useEffect(() => {
    if (!current) return
    setVisible(true)
    setProgressKey((k) => k + 1)
    if (timer.current) window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setVisible(false), Math.max(400, duration - 180))
    return () => {
      if (timer.current) window.clearTimeout(timer.current)
    }
  }, [current, duration])

  if (!current || !t) return null

  return (
    <div className="pointer-events-none fixed inset-x-0 top-4 z-[60] flex justify-center px-4">
      <div
        className={[
          'pointer-events-auto w-full max-w-xl overflow-hidden rounded-2xl border backdrop-blur',
          'shadow-[0_24px_80px_rgba(0,0,0,0.55)]',
          'transition duration-200 will-change-transform',
          visible ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0',
          t.wrap,
        ].join(' ')}
      >
        <div className="flex items-start gap-3 px-4 py-3">
          <span className={`mt-1.5 h-2.5 w-2.5 rounded-full ${t.dot}`} />
          <div className="min-w-0">
            <p className="text-xs font-extrabold tracking-wide text-white/85">{t.label}</p>
            <p className="mt-0.5 truncate text-sm font-extrabold leading-6">{current.message}</p>
          </div>
        </div>

        <div className="h-1 w-full bg-white/5">
          <div
            key={progressKey}
            className={`h-full ${t.bar}`}
            style={{
              width: '100%',
              transformOrigin: 'left',
              animation: `bb-snack-progress ${duration}ms linear forwards`,
            }}
          />
        </div>

        <style>{`
          @keyframes bb-snack-progress {
            from { transform: scaleX(1); opacity: 0.95; }
            to { transform: scaleX(0); opacity: 0.6; }
          }
        `}</style>
      </div>
    </div>
  )
}