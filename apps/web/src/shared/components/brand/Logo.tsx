export const APP_NAME = 'Kickback'

/** Kickback mark: a rounded square with an arrow that loops back. */
export function LogoMark({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <rect width="32" height="32" rx="8" fill="rgb(var(--bb-primary))" />
      <path
        d="M21.5 11.5H13a4.5 4.5 0 0 0 0 9h7"
        fill="none"
        stroke="#fff"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <path d="M18 8l3.8 3.5L18 15" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="23" cy="20.5" r="2" fill="rgb(var(--bb-accent))" />
    </svg>
  )
}

export function Logo({ size = 28 }: { size?: number }) {
  return (
    <span className="inline-flex items-center gap-2">
      <LogoMark size={size} />
      <span className="text-[15px] font-semibold tracking-tight text-bb-text">{APP_NAME}</span>
    </span>
  )
}
