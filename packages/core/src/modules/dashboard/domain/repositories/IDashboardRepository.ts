import type { BrandCampaignSummary } from '../entities/BrandCampaignSummary'
import type { Campaign } from '../entities/Campaign'
import type { Collaboration } from '../entities/Collaboration'
import type { DashboardTimelinePoint } from '../entities/DashboardTimelinePoint'
import type { InfluencerDashboard } from '../entities/InfluencerDashboard'
import type { Payout } from '../entities/Payout'
import type { Product } from '../entities/Product'
import type { CampaignPayoutTier } from '../entities/CampaignPayoutTier'
import type { CampaignApplication } from '../entities/CampaignApplication'
import type {
  CreateCampaignDTO,
  CreateProductDTO,
  UpdateCampaignDTO,
  UpdateProductDTO,
  CreateCampaignPayoutTierDTO,
  UpdateCampaignPayoutTierDTO,
} from '../dtos'
import type { InfluencerPublicProfile } from '../entities/InfluencerPublicProfile'

export type TimelineGroup = 'day'

export type ListCampaignsParams = {
  page?: number
  size?: number
  status?: 'draft' | 'published' | 'closed'
  scope?: 'mine' | 'all'
}

export type ListCollaborationsParams = {
  page?: number
  size?: number
}

export type ListProductsParams = {
  page?: number
  size?: number
}

export type TimelineParams = {
  from: string
  to: string
  group?: TimelineGroup
}

export type ListCampaignApplicationsParams = {
  page?: number
  size?: number
}

export interface IDashboardRepository {
  getInfluencerDashboard(): Promise<InfluencerDashboard>
  listInfluencerPayouts(): Promise<Payout[]>

  listCampaigns(params: ListCampaignsParams): Promise<Campaign[]>
  createCampaign(dto: CreateCampaignDTO): Promise<Campaign>
  updateCampaign(id: string, dto: UpdateCampaignDTO): Promise<Campaign>
  publishCampaign(id: string): Promise<Campaign>
  deleteCampaign(id: string): Promise<void>

  listCollaborations(params: ListCollaborationsParams): Promise<Collaboration[]>
  getCollaboration(id: string): Promise<Collaboration>

  getBrandCampaignSummary(campaignId: string): Promise<BrandCampaignSummary>
  getBrandCampaignTimeline(campaignId: string, params: TimelineParams): Promise<DashboardTimelinePoint[]>

  getCollaborationTimeline(collaborationId: string, params: TimelineParams): Promise<DashboardTimelinePoint[]>

  listBrandProducts(params: ListProductsParams): Promise<Product[]>
  createProduct(dto: CreateProductDTO): Promise<Product>
  updateProduct(id: string, dto: UpdateProductDTO): Promise<Product>
  deleteProduct(id: string): Promise<void>

  listCampaignTiers(campaignId: string): Promise<CampaignPayoutTier[]>
  createCampaignTier(campaignId: string, dto: CreateCampaignPayoutTierDTO): Promise<CampaignPayoutTier>
  updateCampaignTier(tierId: string, dto: UpdateCampaignPayoutTierDTO): Promise<CampaignPayoutTier>
  deleteCampaignTier(tierId: string): Promise<void>

  listBrandCampaignApplications(campaignId: string, params: ListCampaignApplicationsParams): Promise<CampaignApplication[]>
  shortlistApplication(applicationId: string): Promise<CampaignApplication>
  acceptApplication(applicationId: string): Promise<CampaignApplication>
  rejectApplication(applicationId: string): Promise<CampaignApplication>

  getInfluencerPublicProfile(influencerId: string): Promise<InfluencerPublicProfile>
}