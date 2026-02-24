import type { BrandCampaignSummary } from '../entities/BrandCampaignSummary'
import type { Campaign } from '../entities/Campaign'
import type { Collaboration } from '../entities/Collaboration'
import type { DashboardTimelinePoint } from '../entities/DashboardTimelinePoint'
import type { InfluencerDashboard } from '../entities/InfluencerDashboard'
import type { Payout } from '../entities/Payout'

export type TimelineGroup = 'day'

export type ListCampaignsParams = {
  page?: number
  size?: number
  status?: 'draft' | 'published' | 'closed'
}

export type ListCollaborationsParams = {
  page?: number
  size?: number
}

export type TimelineParams = {
  from: string
  to: string
  group?: TimelineGroup
}

export interface IDashboardRepository {
  getInfluencerDashboard(): Promise<InfluencerDashboard>
  listInfluencerPayouts(): Promise<Payout[]>

  listCampaigns(params: ListCampaignsParams): Promise<Campaign[]>
  listCollaborations(params: ListCollaborationsParams): Promise<Collaboration[]>

  getBrandCampaignSummary(campaignId: string): Promise<BrandCampaignSummary>
  getBrandCampaignTimeline(campaignId: string, params: TimelineParams): Promise<DashboardTimelinePoint[]>

  getCollaborationTimeline(collaborationId: string, params: TimelineParams): Promise<DashboardTimelinePoint[]>
}