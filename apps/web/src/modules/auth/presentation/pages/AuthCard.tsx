import type { ReactNode } from 'react'
import { LogoMark } from '@/shared/components/brand/Logo'

/** Centered card used by the sign-in and sign-up pages. */
export function AuthCard({ title, subtitle, children, footer }: { title: string; subtitle: string; children: ReactNode; footer?: ReactNode }) {
  return (
    <div className="px-4 py-12 sm:py-20">
      <div className="mx-auto w-full max-w-[400px] bb-pop">
        <div className="mb-8 text-center">
          <span className="inline-flex">
            <LogoMark size={40} />
          </span>
          <h1 className="mt-5 text-2xl font-semibold tracking-tight">{title}</h1>
          <p className="mt-1.5 text-sm text-bb-muted">{subtitle}</p>
        </div>
        <div className="bb-card p-6">{children}</div>
        {footer ? <div className="mt-6 text-center text-sm text-bb-muted">{footer}</div> : null}
      </div>
    </div>
  )
}

export function errorMessage(e: unknown, fallback: string) {
  const err = e as { response?: { data?: { message?: string; errors?: Record<string, string[]> } }; message?: string }
  const data = err?.response?.data
  const first = data?.errors ? Object.values(data.errors)[0]?.[0] : undefined
  return first ?? data?.message ?? fallback
}
