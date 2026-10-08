import { useMemo } from 'react'
import { EmptyState, Skeleton } from '@/shared/components/ui'
import { FormFooter, Input, PrimaryButton, SectionTitle } from './ui'
import { GlobeAltIcon } from '@heroicons/react/24/outline'
import { useSocialLinksForm } from '../../application/hooks/useSocialLinksForm'

function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M7.5 3h9A4.5 4.5 0 0 1 21 7.5v9A4.5 4.5 0 0 1 16.5 21h-9A4.5 4.5 0 0 1 3 16.5v-9A4.5 4.5 0 0 1 7.5 3Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" stroke="currentColor" strokeWidth="2" />
      <path d="M17.5 6.5h.01" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

function TikTokIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M14 3v10.2a3.8 3.8 0 1 1-3.3-3.77" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M14 3c.8 2.8 2.8 4.8 6 5.2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function YouTubeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M21 8.2a3 3 0 0 0-2.1-2.12C17.1 5.5 12 5.5 12 5.5s-5.1 0-6.9.58A3 3 0 0 0 3 8.2 31 31 0 0 0 2.5 12 31 31 0 0 0 3 15.8a3 3 0 0 0 2.1 2.12c1.8.58 6.9.58 6.9.58s5.1 0 6.9-.58A3 3 0 0 0 21 15.8c.33-1.26.5-2.53.5-3.8s-.17-2.54-.5-3.8Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M10.5 9.5 15.5 12l-5 2.5V9.5Z" fill="currentColor" />
    </svg>
  )
}

function MediaKitIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M7 3h7l3 3v15H7V3Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M14 3v3h3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M9 10h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M9 14h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M9 18h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function SocialRow({
  label,
  placeholder,
  value,
  onChange,
  preview,
  icon,
  readOnly,
}: {
  label: string
  placeholder: string
  value: string
  onChange: (v: string) => void
  preview?: string
  icon: React.ReactNode
  readOnly?: boolean
}) {
  return (
    <label className="grid gap-3 py-4 sm:grid-cols-[200px_1fr] sm:items-center">
      <span className="flex items-center gap-3">
        <span className="bb-stat-icon h-8 w-8">{icon}</span>
        <span className="min-w-0">
          <span className="block text-sm font-medium">{label}</span>
          <span className="block truncate text-xs text-bb-muted">{preview || 'Not set'}</span>
        </span>
      </span>
      <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} readOnly={readOnly} />
    </label>
  )
}

function normalizeHost(url: string) {
  try {
    if (!url.trim()) return ''
    const u = new URL(url)
    return `${u.hostname}${u.pathname}`.replace(/\/$/, '')
  } catch {
    return ''
  }
}

export function SocialMediaSection() {
  const vm = useSocialLinksForm()

  const role = vm.profile?.role ?? null

  const websiteValue = useMemo(() => ((vm.profile as any)?.influencerProfile as any)?.website_url ?? '', [vm.profile])

  if (!vm.profile)
    return (
      <div className="space-y-3">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-32 w-full" />
      </div>
    )

  if (role !== 'influencer') {
    return (
      <div className="space-y-5">
        <SectionTitle title="Social media" subtitle="Social links are part of creator profiles." />
        <EmptyState title="Nothing to set up here" text="Brand accounts don't have social links yet. Your website and contact details are under Personal information." />
      </div>
    )
  }

  const scoreTone = vm.score.label === 'Strong' ? 'bb-badge-green' : vm.score.label === 'Good start' ? 'bb-badge-brown' : ''

  return (
    <form
      className="space-y-5"
      onSubmit={async (e) => {
        e.preventDefault()
        await vm.submit()
      }}
    >
      <SectionTitle
        title="Social media"
        subtitle="Links brands see when you apply. Use the clean profile URL, without tracking parameters."
        right={<span className={`bb-badge ${scoreTone}`}>{vm.score.label}</span>}
      />

      <div className="divide-y divide-bb-border/10">
        <SocialRow
          label="Instagram"
          placeholder="https://instagram.com/username"
          value={vm.instagram}
          onChange={vm.setInstagram}
          preview={normalizeHost(vm.instagram)}
          icon={<InstagramIcon className="h-[18px] w-[18px]" />}
        />
        <SocialRow
          label="TikTok"
          placeholder="https://tiktok.com/@username"
          value={vm.tiktok}
          onChange={vm.setTiktok}
          preview={normalizeHost(vm.tiktok)}
          icon={<TikTokIcon className="h-[18px] w-[18px]" />}
        />
        <SocialRow
          label="YouTube"
          placeholder="https://youtube.com/@username"
          value={vm.youtube}
          onChange={vm.setYoutube}
          preview={normalizeHost(vm.youtube)}
          icon={<YouTubeIcon className="h-[18px] w-[18px]" />}
        />
        <SocialRow
          label="Media kit"
          placeholder="https://drive.google.com/…"
          value={vm.mediaKit}
          onChange={vm.setMediaKit}
          preview={normalizeHost(vm.mediaKit)}
          icon={<MediaKitIcon className="h-[18px] w-[18px]" />}
        />
        <SocialRow
          label="Website"
          placeholder="https://your-site.com"
          value={websiteValue}
          onChange={() => {}}
          readOnly
          preview={normalizeHost(websiteValue)}
          icon={<GlobeAltIcon className="h-[18px] w-[18px]" />}
        />
      </div>

      <FormFooter>
        <PrimaryButton type="submit" disabled={vm.isLoading}>
          Save links
        </PrimaryButton>
      </FormFooter>
    </form>
  )
}
