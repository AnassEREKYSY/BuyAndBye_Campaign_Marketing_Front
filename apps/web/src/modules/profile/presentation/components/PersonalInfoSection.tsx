import { useMemo } from 'react'
import { env } from '@/shared/config/env'
import { EmptyState, Skeleton } from '@/shared/components/ui'
import { Field, FormFooter, GhostButton, Input, PrimaryButton, SectionTitle, Textarea } from './ui'
import { usePersonalInfoForm } from '../../application/hooks/usePersonalInfoForm'

function toAbsolute(url: string) {
  const u = (url ?? '').trim()
  if (!u) return ''
  if (u.startsWith('http://') || u.startsWith('https://')) return u
  const base = env.BACKEND_BASE_URL.replace(/\/$/, '')
  const path = u.startsWith('/') ? u : `/${u}`
  return `${base}${path}`
}

function initials(s: string) {
  const parts = (s ?? '').split(/[\s@._-]+/).filter(Boolean)
  return ((parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')).toUpperCase() || '?'
}

function Avatar({ url, fallback }: { url?: string | null; fallback: string }) {
  const src = toAbsolute(url ?? '')
  return (
    <div className="bb-avatar h-14 w-14 text-base">
      {src ? <img src={src} alt="" className="h-full w-full object-cover" /> : initials(fallback)}
    </div>
  )
}

function FilePreview({ src, name }: { src: string; name?: string }) {
  return (
    <div className="bb-soft-box mt-2 flex items-center gap-3 p-2.5">
      <img src={src} alt="" className="h-9 w-9 rounded-[8px] object-cover" />
      <div className="min-w-0">
        <p className="truncate text-sm font-medium">{name}</p>
        <p className="text-xs text-bb-muted">Uploaded when you save</p>
      </div>
    </div>
  )
}

const INDUSTRIES = [
  'Beauty',
  'Fashion',
  'Tech',
  'Fitness',
  'Food',
  'Travel',
  'Gaming',
  'Lifestyle',
  'Home & Living',
  'Finance',
  'Education',
  'Health',
  'Automotive',
  'Other',
] as const

const NICHES = [
  'Tech',
  'Beauty',
  'Fashion',
  'Fitness',
  'Food',
  'Travel',
  'Gaming',
  'Lifestyle',
  'Education',
  'Finance',
  'Health',
  'Business',
  'Entertainment',
  'Sports',
  'Parenting',
  'Cars',
  'Home & Living',
  'Art & Design',
  'Photography',
  'Other',
] as const

export function PersonalInfoSection() {
  const vm = usePersonalInfoForm()

  const header = useMemo(() => {
    if (!vm.profile) return null
    const badge = vm.profile.role === 'brand' ? 'Brand' : 'Creator'
    return (
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-4">
          <Avatar url={vm.headerImageUrl} fallback={vm.profile.display_name || vm.profile.email} />
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="truncate text-lg font-semibold">{vm.profile.display_name}</h2>
              <span className="bb-badge bb-badge-brown">{badge}</span>
            </div>
            <p className="mt-0.5 truncate text-sm text-bb-muted">{vm.profile.email}</p>
          </div>
        </div>
        <GhostButton type="button" className="h-9" onClick={vm.refresh} disabled={vm.isLoading}>
          Refresh
        </GhostButton>
      </div>
    )
  }, [vm.profile, vm.refresh, vm.isLoading, vm.headerImageUrl])

  if (!vm.profile && vm.isLoading)
    return (
      <div className="space-y-4">
        <Skeleton className="h-14 w-64" />
        <Skeleton className="h-40 w-full" />
      </div>
    )
  if (!vm.profile && vm.error) return <div className="rounded-[10px] bg-bb-accent-soft p-4 text-sm text-bb-accent-strong">{vm.error}</div>
  if (!vm.profile) return <EmptyState title="No profile loaded" text="Try refreshing the page." />

  return (
    <div className="space-y-8">
      {header}

      {vm.role === 'brand' ? (
        <form
          className="space-y-5 border-t border-bb-border/10 pt-6"
          onSubmit={async (e) => {
            e.preventDefault()
            await vm.submitBrand()
          }}
        >
          <SectionTitle title="Brand profile" subtitle="What creators see about your brand, and how to reach you." />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field label="Brand name">
              <Input value={vm.brandForm.brandName} onChange={(e) => vm.setBrandName(e.target.value)} placeholder="My Brand" />
            </Field>

            <Field label="Website">
              <Input value={vm.brandForm.website} onChange={(e) => vm.setWebsite(e.target.value)} placeholder="https://brand.com" />
            </Field>

            <Field label="Industry">
              <select value={vm.brandForm.industry} onChange={(e) => vm.setIndustry(e.target.value)} className="bb-select w-full">
                <option value="">Select an industry</option>
                {INDUSTRIES.map((x) => (
                  <option key={x} value={x}>
                    {x}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Contact email">
              <Input value={vm.brandForm.contactEmail} onChange={(e) => vm.setContactEmail(e.target.value)} placeholder="contact@brand.com" />
            </Field>

            <Field label="Contact phone">
              <Input value={vm.brandForm.contactPhone} onChange={(e) => vm.setContactPhone(e.target.value)} placeholder="+212600000000" />
            </Field>

            <Field label="Brand logo" hint="PNG/JPG">
              <Input type="file" accept="image/*" onChange={(e) => vm.setLogo(e.target.files?.[0] ?? null)} />
              {vm.brandForm.logoPreview ? <FilePreview src={vm.brandForm.logoPreview} name={vm.brandForm.logo?.name} /> : null}
            </Field>
          </div>

          <Field label="Description">
            <Textarea
              value={vm.brandForm.description}
              onChange={(e) => vm.setDescription(e.target.value)}
              rows={4}
              placeholder="What you sell and who it is for"
            />
          </Field>

          <FormFooter>
            <PrimaryButton type="submit" disabled={vm.isLoading}>
              Save changes
            </PrimaryButton>
          </FormFooter>
        </form>
      ) : (
        <form
          className="space-y-5 border-t border-bb-border/10 pt-6"
          onSubmit={async (e) => {
            e.preventDefault()
            await vm.submitInfluencer()
          }}
        >
          <SectionTitle title="Creator profile" subtitle="What brands see when you apply to a campaign." />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field label="Profile image" hint="PNG/JPG">
              <Input type="file" accept="image/*" onChange={(e) => vm.setPhoto(e.target.files?.[0] ?? null)} />
              {vm.influencerForm.photoPreview ? <FilePreview src={vm.influencerForm.photoPreview} name={vm.influencerForm.photo?.name} /> : null}
            </Field>

            <Field label="Niche">
              <select value={vm.influencerForm.niche} onChange={(e) => vm.setNiche(e.target.value)} className="bb-select w-full">
                <option value="">Select a niche</option>
                {NICHES.map((x) => (
                  <option key={x} value={x}>
                    {x}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Country code">
              <Input value={vm.influencerForm.country} onChange={(e) => vm.setCountry(e.target.value)} placeholder="MA, FR, ES…" />
            </Field>

            <Field label="Language">
              <Input value={vm.influencerForm.language} onChange={(e) => vm.setLanguage(e.target.value)} placeholder="fr, en, ar…" />
            </Field>

            <Field label="Media kit URL">
              <Input value={vm.influencerForm.mediaKit} onChange={(e) => vm.setMediaKit(e.target.value)} placeholder="https://drive.google.com/…" />
            </Field>

            <Field label="Instagram URL">
              <Input value={vm.influencerForm.instagram} onChange={(e) => vm.setInstagram(e.target.value)} placeholder="https://instagram.com/username" />
            </Field>

            <Field label="TikTok URL">
              <Input value={vm.influencerForm.tiktok} onChange={(e) => vm.setTiktok(e.target.value)} placeholder="https://tiktok.com/@username" />
            </Field>

            <Field label="YouTube URL">
              <Input value={vm.influencerForm.youtube} onChange={(e) => vm.setYoutube(e.target.value)} placeholder="https://youtube.com/@username" />
            </Field>

            <Field label="Instagram followers">
              <Input
                value={vm.influencerForm.followersIg}
                onChange={(e) => vm.setFollowersIg(e.target.value === '' ? '' : Number(e.target.value))}
                type="number"
                placeholder="50000"
              />
            </Field>

            <Field label="TikTok followers">
              <Input
                value={vm.influencerForm.followersTt}
                onChange={(e) => vm.setFollowersTt(e.target.value === '' ? '' : Number(e.target.value))}
                type="number"
                placeholder="120000"
              />
            </Field>

            <Field label="YouTube followers">
              <Input
                value={vm.influencerForm.followersYt}
                onChange={(e) => vm.setFollowersYt(e.target.value === '' ? '' : Number(e.target.value))}
                type="number"
                placeholder="10000"
              />
            </Field>

            <Field label="Average engagement rate (%)">
              <Input
                value={vm.influencerForm.engagement}
                onChange={(e) => vm.setEngagement(e.target.value === '' ? '' : Number(e.target.value))}
                type="number"
                step="0.1"
                placeholder="4.2"
              />
            </Field>
          </div>

          <FormFooter>
            <PrimaryButton type="submit" disabled={vm.isLoading}>
              Save changes
            </PrimaryButton>
          </FormFooter>
        </form>
      )}
    </div>
  )
}