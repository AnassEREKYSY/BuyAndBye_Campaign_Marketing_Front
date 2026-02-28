import { useMemo } from 'react'
import { env } from '@/shared/config/env'
import { Field, GhostButton, Input, PrimaryButton, SectionTitle, SubtleCard, Textarea } from './ui'
import { usePersonalInfoForm } from '../../application/hooks/usePersonalInfoForm'

function toAbsolute(url: string) {
  const u = (url ?? '').trim()
  if (!u) return ''
  if (u.startsWith('http://') || u.startsWith('https://')) return u
  const base = env.BACKEND_BASE_URL.replace(/\/$/, '')
  const path = u.startsWith('/') ? u : `/${u}`
  return `${base}${path}`
}

function Avatar({ url, fallback }: { url?: string | null; fallback: string }) {
  const src = toAbsolute(url ?? '')
  return (
    <div className="flex items-center gap-4">
      <div
        className="h-14 w-14 overflow-hidden rounded-3xl border"
        style={{
          borderColor: 'rgb(var(--bb-border) / 0.10)',
          backgroundColor: 'rgb(var(--bb-border) / 0.04)',
          boxShadow: '0 18px 60px rgb(0 0 0 / 0.10)',
        }}
      >
        {src ? (
          <img src={src} alt="avatar" className="h-full w-full object-cover" />
        ) : (
          <div className="grid h-full w-full place-items-center text-sm font-extrabold" style={{ color: 'rgb(var(--bb-muted) / 0.90)' }}>
            {fallback.slice(0, 2).toUpperCase()}
          </div>
        )}
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
    const badge = vm.profile.role === 'brand' ? 'Brand account' : 'Influencer account'
    return (
      <SubtleCard>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Avatar url={vm.headerImageUrl} fallback={vm.profile.display_name || vm.profile.email} />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-extrabold bb-title-text">{vm.profile.display_name}</h2>
                <span
                  className="rounded-full border px-2.5 py-1 text-[11px] font-extrabold"
                  style={{
                    borderColor: 'rgb(var(--bb-border) / 0.10)',
                    backgroundColor: 'rgb(var(--bb-border) / 0.04)',
                    color: 'rgb(var(--bb-muted) / 0.90)',
                  }}
                >
                  {badge}
                </span>
                <span
                  className="rounded-full border px-2.5 py-1 text-[11px] font-extrabold"
                  style={{
                    borderColor: 'rgb(var(--bb-border) / 0.10)',
                    backgroundColor: 'rgb(var(--bb-border) / 0.04)',
                    color: 'rgb(var(--bb-muted) / 0.82)',
                  }}
                >
                  Keep it complete ✨
                </span>
              </div>
              <p className="mt-1 text-sm bb-subtle-text">{vm.profile.email}</p>
            </div>
          </div>

          <GhostButton onClick={vm.refresh} disabled={vm.isLoading}>
            Refresh
          </GhostButton>
        </div>
      </SubtleCard>
    )
  }, [vm.profile, vm.refresh, vm.isLoading, vm.headerImageUrl])

  if (!vm.profile && vm.isLoading) return <div className="bb-subtle-text">Loading profile…</div>
  if (!vm.profile && vm.error) return <div className="text-rose-200">{vm.error}</div>
  if (!vm.profile) return <div className="bb-subtle-text">No profile loaded.</div>

  return (
    <div className="space-y-6">
      {header}

      {vm.role === 'brand' ? (
        <form
          className="space-y-6"
          onSubmit={async (e) => {
            e.preventDefault()
            await vm.submitBrand()
          }}
        >
          <SectionTitle title="Brand profile" subtitle="Update your public brand identity and contact details." />

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
              {vm.brandForm.logoPreview ? (
                <div
                  className="mt-3 rounded-2xl border p-3"
                  style={{ borderColor: 'rgb(var(--bb-border) / 0.10)', backgroundColor: 'rgb(var(--bb-border) / 0.04)' }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="h-10 w-10 overflow-hidden rounded-2xl border"
                      style={{ borderColor: 'rgb(var(--bb-border) / 0.10)', backgroundColor: 'rgb(var(--bb-border) / 0.04)' }}
                    >
                      <img src={vm.brandForm.logoPreview} alt="logo preview" className="h-full w-full object-cover" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-extrabold bb-title-text">{vm.brandForm.logo?.name}</p>
                      <p className="text-xs bb-subtle-text">Ready to upload</p>
                    </div>
                  </div>
                </div>
              ) : null}
            </Field>
          </div>

          <Field label="Description">
            <Textarea
              value={vm.brandForm.description}
              onChange={(e) => vm.setDescription(e.target.value)}
              rows={4}
              placeholder="We sell amazing products…"
            />
          </Field>

          <div
            className="flex flex-col gap-3 rounded-3xl border p-4 sm:flex-row sm:items-center sm:justify-between"
            style={{ borderColor: 'rgb(var(--bb-border) / 0.10)', backgroundColor: 'rgb(var(--bb-border) / 0.04)' }}
          >
            <p className="text-sm bb-subtle-text">Your changes will be saved securely.</p>
            <PrimaryButton type="submit" disabled={vm.isLoading}>
              Save changes
            </PrimaryButton>
          </div>
        </form>
      ) : (
        <form
          className="space-y-6"
          onSubmit={async (e) => {
            e.preventDefault()
            await vm.submitInfluencer()
          }}
        >
          <SectionTitle title="Influencer profile" subtitle="Tell brands who you are and where you create content." />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field label="Profile image" hint="PNG/JPG">
              <Input type="file" accept="image/*" onChange={(e) => vm.setPhoto(e.target.files?.[0] ?? null)} />
              {vm.influencerForm.photoPreview ? (
                <div
                  className="mt-3 rounded-2xl border p-3"
                  style={{ borderColor: 'rgb(var(--bb-border) / 0.10)', backgroundColor: 'rgb(var(--bb-border) / 0.04)' }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="h-10 w-10 overflow-hidden rounded-2xl border"
                      style={{ borderColor: 'rgb(var(--bb-border) / 0.10)', backgroundColor: 'rgb(var(--bb-border) / 0.04)' }}
                    >
                      <img src={vm.influencerForm.photoPreview} alt="photo preview" className="h-full w-full object-cover" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-extrabold bb-title-text">{vm.influencerForm.photo?.name}</p>
                      <p className="text-xs bb-subtle-text">Ready to upload</p>
                    </div>
                  </div>
                </div>
              ) : null}
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

            <Field label="Followers Instagram">
              <Input
                value={vm.influencerForm.followersIg}
                onChange={(e) => vm.setFollowersIg(e.target.value === '' ? '' : Number(e.target.value))}
                type="number"
                placeholder="50000"
              />
            </Field>

            <Field label="Followers TikTok">
              <Input
                value={vm.influencerForm.followersTt}
                onChange={(e) => vm.setFollowersTt(e.target.value === '' ? '' : Number(e.target.value))}
                type="number"
                placeholder="120000"
              />
            </Field>

            <Field label="Followers YouTube">
              <Input
                value={vm.influencerForm.followersYt}
                onChange={(e) => vm.setFollowersYt(e.target.value === '' ? '' : Number(e.target.value))}
                type="number"
                placeholder="10000"
              />
            </Field>

            <Field label="Avg engagement rate (%)">
              <Input
                value={vm.influencerForm.engagement}
                onChange={(e) => vm.setEngagement(e.target.value === '' ? '' : Number(e.target.value))}
                type="number"
                step="0.1"
                placeholder="4.2"
              />
            </Field>
          </div>

          <div
            className="flex flex-col gap-3 rounded-3xl border p-4 sm:flex-row sm:items-center sm:justify-between"
            style={{ borderColor: 'rgb(var(--bb-border) / 0.10)', backgroundColor: 'rgb(var(--bb-border) / 0.04)' }}
          >
            <p className="text-sm bb-subtle-text">Your changes will be saved securely.</p>
            <PrimaryButton type="submit" disabled={vm.isLoading}>
              Save changes
            </PrimaryButton>
          </div>
        </form>
      )}
    </div>
  )
}