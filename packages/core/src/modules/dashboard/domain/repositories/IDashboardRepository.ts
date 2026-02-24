import type { BrandCampaignSummary } from '../entities/BrandCampaignSummary'
import type { Campaign } from '../entities/Campaign'
import type { Collaboration } from '../entities/Collaboration'
import type { DashboardTimelinePoint } from '../entities/DashboardTimelinePoint'
import type { InfluencerDashboard } from '../entities/InfluencerDashboard'
import type { Payout } from '../entities/Payout'
import type { Product } from '../entities/Product'
import type { CreateCampaignDTO, CreateProductDTO, UpdateCampaignDTO, UpdateProductDTO } from '../dtos'

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

export interface IDashboardRepository {
  getInfluencerDashboard(): Promise<InfluencerDashboard>
  listInfluencerPayouts(): Promise<Payout[]>

  listCampaigns(params: ListCampaignsParams): Promise<Campaign[]>
  createCampaign(dto: CreateCampaignDTO): Promise<Campaign>
  updateCampaign(id: string, dto: UpdateCampaignDTO): Promise<Campaign>
  publishCampaign(id: string): Promise<Campaign>
  deleteCampaign(id: string): Promise<void>

  listCollaborations(params: ListCollaborationsParams): Promise<Collaboration[]>

  getBrandCampaignSummary(campaignId: string): Promise<BrandCampaignSummary>
  getBrandCampaignTimeline(campaignId: string, params: TimelineParams): Promise<DashboardTimelinePoint[]>

  getCollaborationTimeline(collaborationId: string, params: TimelineParams): Promise<DashboardTimelinePoint[]>

  listBrandProducts(params: ListProductsParams): Promise<Product[]>
  createProduct(dto: CreateProductDTO): Promise<Product>
  updateProduct(id: string, dto: UpdateProductDTO): Promise<Product>
  deleteProduct(id: string): Promise<void>
}