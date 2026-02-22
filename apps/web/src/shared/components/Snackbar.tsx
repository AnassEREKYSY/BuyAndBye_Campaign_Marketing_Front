import { useEffect, useState } from 'react'
import { NotificationType } from '@buyandbye/core'
import { useNotification } from '@/shared/context/notification'

function typeClasses(type: NotificationType) {
  switch (type) {
    case 'success':
      return 'border-emerald-400/25 bg-emerald-500/10 text-emerald-50'
    case 'error':
      return 'border-red-400/25 bg-red-500/10 text-red-50'
    case 'warning':
      return 'border-amber-400/25 bg-amber-500/10 text-amber-50'
    case 'info':
    default:
      return 'border-cyan-400/25 bg-cyan-500/10 text-cyan-50'
  }
}

function typeDot(type: NotificationType) {
  switch (type) {
    case 'success':
      return 'bg-emerald-400'
    case 'error':
      return 'bg-red-400'
    case 'warning':
      return 'bg-amber-400'
    case 'info':
    default:
      return 'bg-cyan-400'
  }
}

export function Snackbar() {
  const { current } = useNotification()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!current) return
    setVisible(true)
    const t = window.setTimeout(() => setVisible(false), (current.options?.duration ?? 2800) - 200)
    return () => window.clearTimeout(t)
  }, [current])

  if (!current) return null

  return (
    <div className="pointer-events-none fixed inset-x-0 top-4 z-[60] flex justify-center px-4">
      <div
        className={[
          'pointer-events-auto w-full max-w-lg rounded-2xl border px-4 py-3',
          'shadow-[0_20px_60px_rgba(0,0,0,0.55)] backdrop-blur',
          'transition duration-200',
          visible ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0',
          typeClasses(current.type),
        ].join(' ')}
      >
        <div className="flex items-start gap-3">
          <span className={`mt-1.5 h-2.5 w-2.5 rounded-full ${typeDot(current.type)}`} />
          <p className="text-sm font-extrabold leading-6">{current.message}</p>
        </div>
      </div>
    </div>
  )
}