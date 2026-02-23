import { ReactNode } from 'react'

type Item = {
  key: string
  label: string
  icon?: ReactNode
  description?: string
}

function cx(...classes: Array<string | false | undefined | null>) {
  return classes.filter(Boolean).join(' ')
}

export function ProfileShell({
  title,
  subtitle,
  items,
  activeKey,
  onSelect,
  children,
}: {
  title: string
  subtitle?: string
  items: Item[]
  activeKey: string
  onSelect: (key: string) => void
  children: ReactNode
}) {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 text-white sm:px-6">
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bb-glass bb-ring">
        <div className="pointer-events-none absolute inset-0 bb-spotlight" />
        <div className="pointer-events-none absolute inset-0 bb-grid" />
        <div className="pointer-events-none absolute inset-0 bb-noise" />

        <div className="relative px-5 py-6 sm:px-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.14em] text-white/70">
                Settings
                <span className="h-1.5 w-1.5 rounded-full bg-white/40" />
                Profile
              </p>

              <h1 className="mt-3 text-2xl font-black tracking-tight sm:text-3xl">{title}</h1>
              {subtitle ? <p className="mt-2 text-sm text-white/60">{subtitle}</p> : null}
            </div>

            <div className="flex items-center gap-2">
              <div className="hidden sm:block rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-xs font-bold text-white/60">
                Tip: keep your profile complete to unlock more features.
              </div>
            </div>
          </div>
        </div>

        <div className="relative grid grid-cols-1 gap-4 border-t border-white/10 p-4 md:grid-cols-[320px_1fr] md:gap-5 md:p-5">
          {/* Sidebar */}
          <aside className="rounded-3xl border border-white/10 bg-black/20 p-3 bb-soft-scroll">
            <nav className="space-y-1">
              {items.map((it) => {
                const active = it.key === activeKey
                return (
                  <button
                    key={it.key}
                    onClick={() => onSelect(it.key)}
                    className={cx(
                      'group relative flex w-full items-start gap-3 rounded-2xl p-3 text-left transition',
                      'hover:bg-white/6 hover:-translate-y-[1px]',
                      active ? 'bg-white/10' : 'bg-transparent',
                    )}
                  >
                    <span
                      className={cx(
                        'mt-0.5 grid h-10 w-10 place-items-center rounded-2xl border transition',
                        active ? 'border-white/20 bg-white/10' : 'border-white/10 bg-white/5',
                      )}
                    >
                      {it.icon}
                    </span>

                    <span className="flex-1">
                      <span className={cx('block text-sm font-extrabold', active ? 'text-white' : 'text-white/85')}>
                        {it.label}
                      </span>
                      {it.description ? (
                        <span className="mt-1 block text-xs leading-5 text-white/45">{it.description}</span>
                      ) : null}
                    </span>

                    {/* Active indicator */}
                    <span
                      className={cx(
                        'absolute right-3 top-1/2 h-8 w-1 -translate-y-1/2 rounded-full transition',
                        active ? 'bg-gradient-to-b from-indigo-400/90 via-sky-300/70 to-cyan-300/70' : 'bg-transparent',
                      )}
                    />
                  </button>
                )
              })}
            </nav>
          </aside>

          {/* Content */}
          <section className="bb-gradient-border rounded-[24px]">
            <div className="rounded-[24px] border border-white/10 bg-black/20 p-5 sm:p-6">
              <div className="animate-[fadeIn_.22s_ease-out]">{children}</div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}