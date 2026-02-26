import type { ApplicationStatus } from './ApplicationStatus'

export type ApplicantSummary = {
  id: string
  displayName: string
  photoUrl: string | null
}

export class CampaignApplication {
  constructor(
    public readonly id: string,
    public readonly campaignId: string,
    public readonly influencerId: string,
    public readonly message: string | null,
    public readonly status: ApplicationStatus,
    public readonly influencer: ApplicantSummary | null,
    public readonly createdAt: string | null,
    public readonly updatedAt: string | null
  ) {}
}