import type { ReactNode } from 'react'

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
    <div className="bb-page px-4 py-6 md:px-6">
      <div className="bb-pop bb-gradient-border bb-glass bb-ring overflow-hidden rounded-[26px] border">
        <div className="p-5 sm:p-6" style={{ borderColor: 'rgb(var(--bb-border) / 0.10)' }}>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="bb-chip">
                <span
                  className="inline-block h-2 w-2 rounded-full"
                  style={{
                    backgroundColor: 'rgb(var(--bb-accent) / 0.90)',
                    boxShadow: '0 0 18px rgb(var(--bb-accent) / 0.35)',
                  }}
                />
                Settings · Profile
              </div>

              <h1 className="mt-3 text-2xl font-black tracking-tight bb-title-text sm:text-3xl">{title}</h1>
              {subtitle ? <p className="mt-2 text-sm bb-subtle-text">{subtitle}</p> : null}
            </div>

            <div className="hidden sm:block rounded-2xl border px-4 py-3 text-xs font-bold bb-muted-text"
                 style={{ borderColor: 'rgb(var(--bb-border) / 0.10)', backgroundColor: 'rgb(var(--bb-border) / 0.04)' }}
            >
              Tip: keep your profile complete.
            </div>
          </div>
        </div>

        <div
          className="grid grid-cols-1 gap-4 border-t p-4 md:grid-cols-[320px_1fr] md:gap-5 md:p-5"
          style={{ borderColor: 'rgb(var(--bb-border) / 0.10)' }}
        >
          <aside className="rounded-3xl border p-3 bb-soft-scroll"
                 style={{ borderColor: 'rgb(var(--bb-border) / 0.10)', backgroundColor: 'rgb(var(--bb-border) / 0.03)' }}
          >
            <nav className="space-y-1">
              {items.map((it) => {
                const active = it.key === activeKey
                return (
                  <button
                    key={it.key}
                    type="button"
                    onClick={() => onSelect(it.key)}
                    className={cx(
                      'group relative flex w-full items-start gap-3 rounded-2xl p-3 text-left transition will-change-transform',
                      'hover:-translate-y-[1px]',
                    )}
                    style={{
                      backgroundColor: active ? 'rgb(var(--bb-border) / 0.06)' : 'transparent',
                    }}
                  >
                    <span
                      className="mt-0.5 grid h-10 w-10 place-items-center rounded-2xl border transition"
                      style={{
                        borderColor: 'rgb(var(--bb-border) / 0.10)',
                        backgroundColor: active ? 'rgb(var(--bb-border) / 0.06)' : 'rgb(var(--bb-border) / 0.04)',
                        color: 'rgb(var(--bb-text) / 0.90)',
                      }}
                    >
                      {it.icon}
                    </span>

                    <span className="flex-1">
                      <span className="block text-sm font-extrabold" style={{ color: 'rgb(var(--bb-text) / 0.94)' }}>
                        {it.label}
                      </span>
                      {it.description ? (
                        <span className="mt-1 block text-xs leading-5 bb-muted-text">{it.description}</span>
                      ) : null}
                    </span>

                    <span
                      className="absolute right-3 top-1/2 h-8 w-1 -translate-y-1/2 rounded-full transition"
                      style={{
                        background: active
                          ? 'linear-gradient(180deg, rgb(var(--bb-primary) / 0.85), rgb(var(--bb-accent) / 0.70), rgb(var(--bb-cyan) / 0.70))'
                          : 'transparent',
                      }}
                    />
                  </button>
                )
              })}
            </nav>
          </aside>

          <section className="bb-gradient-border rounded-[24px]">
            <div
              className="rounded-[24px] border p-5 sm:p-6"
              style={{
                borderColor: 'rgb(var(--bb-border) / 0.10)',
                backgroundColor: 'rgb(var(--bb-card) / 0.70)',
              }}
            >
              {children}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}