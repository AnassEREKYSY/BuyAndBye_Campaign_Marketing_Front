import { BrandCampaignSummary } from "../../domain/entities/BrandCampaignSummary"
import { Campaign } from "../../domain/entities/Campaign"
import { Collaboration } from "../../domain/entities/Collaboration"
import { DashboardTimelinePoint } from "../../domain/entities/DashboardTimelinePoint"
import { InfluencerDashboard } from "../../domain/entities/InfluencerDashboard"
import { Payout } from "../../domain/entities/Payout"
import { IDashboardRepository, ListCampaignsParams, ListCollaborationsParams, TimelineParams } from "../../domain/repositories/IDashboardRepository"
import { DashboardApiClient } from "../api/DashboardApiClient"
import { BrandCampaignSummaryMapper } from "../mapper/BrandCampaignSummaryMapper"
import { CampaignMapper } from "../mapper/CampaignMapper"
import { CollaborationMapper } from "../mapper/CollaborationMapper"
import { InfluencerDashboardMapper } from "../mapper/InfluencerDashboardMapper"
import { PayoutMapper } from "../mapper/PayoutMapper"
import { TimelineMapper } from "../mapper/TimelineMapper"


export class DashboardRepository implements IDashboardRepository {
  constructor(private readonly api: DashboardApiClient) {}

  async getInfluencerDashboard(): Promise<InfluencerDashboard> {
    const res = await this.api.getInfluencerDashboard()
    return InfluencerDashboardMapper.toDomain(res.data.data)
  }

  async listInfluencerPayouts(): Promise<Payout[]> {
    const res = await this.api.listInfluencerPayouts()
    return PayoutMapper.toDomainList(res.data.data ?? [])
  }

  async listCampaigns(params: ListCampaignsParams): Promise<Campaign[]> {
    const res = await this.api.listCampaigns({
      page: params.page ?? 1,
      size: params.size ?? 20,
      status: params.status,
    })
    return CampaignMapper.toDomainList(res.data.data ?? [])
  }

  async listCollaborations(params: ListCollaborationsParams): Promise<Collaboration[]> {
    const res = await this.api.listCollaborations({
      page: params.page ?? 1,
      size: params.size ?? 20,
    })
    return CollaborationMapper.toDomainList(res.data.data ?? [])
  }

  async getBrandCampaignSummary(campaignId: string): Promise<BrandCampaignSummary> {
    const res = await this.api.getBrandCampaignSummary(campaignId)
    return BrandCampaignSummaryMapper.toDomain(res.data.data)
  }

  async getBrandCampaignTimeline(campaignId: string, params: TimelineParams): Promise<DashboardTimelinePoint[]> {
    const res = await this.api.getBrandCampaignTimeline(campaignId, {
      from: params.from,
      to: params.to,
      group: params.group ?? 'day',
    })
    return TimelineMapper.toDomain(res.data.data ?? [])
  }

  async getCollaborationTimeline(
    collaborationId: string,
    params: TimelineParams,
  ): Promise<DashboardTimelinePoint[]> {
    const res = await this.api.getCollaborationTimeline(collaborationId, {
      from: params.from,
      to: params.to,
      group: params.group ?? 'day',
    })
    return TimelineMapper.toDomain(res.data.data ?? [])
  }
}