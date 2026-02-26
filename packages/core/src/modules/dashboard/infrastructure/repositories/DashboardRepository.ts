import type { BrandCampaignSummary } from '../../domain/entities/BrandCampaignSummary'
import type { Campaign } from '../../domain/entities/Campaign'
import type { Collaboration } from '../../domain/entities/Collaboration'
import type { DashboardTimelinePoint } from '../../domain/entities/DashboardTimelinePoint'
import type { InfluencerDashboard } from '../../domain/entities/InfluencerDashboard'
import type { Payout } from '../../domain/entities/Payout'
import type { Product } from '../../domain/entities/Product'
import type { CampaignPayoutTier } from '../../domain/entities/CampaignPayoutTier'
import type { CampaignApplication } from '../../domain/entities/CampaignApplication'
import type {
  IDashboardRepository,
  ListCampaignsParams,
  ListCollaborationsParams,
  ListProductsParams,
  TimelineParams,
  ListCampaignApplicationsParams,
} from '../../domain/repositories/IDashboardRepository'
import type {
  CreateCampaignDTO,
  CreateProductDTO,
  UpdateCampaignDTO,
  UpdateProductDTO,
  CreateCampaignPayoutTierDTO,
  UpdateCampaignPayoutTierDTO,
} from '../../domain/dtos'
import { DashboardApiClient } from '../api/DashboardApiClient'
import { BrandCampaignSummaryMapper } from '../mapper/BrandCampaignSummaryMapper'
import { CampaignMapper } from '../mapper/CampaignMapper'
import { CollaborationMapper } from '../mapper/CollaborationMapper'
import { InfluencerDashboardMapper } from '../mapper/InfluencerDashboardMapper'
import { PayoutMapper } from '../mapper/PayoutMapper'
import { TimelineMapper } from '../mapper/TimelineMapper'
import { ProductMapper } from '../mapper/ProductMapper'
import { CampaignPayoutTierMapper } from '../mapper/CampaignPayoutTierMapper'
import { CampaignApplicationMapper } from '../mapper/CampaignApplicationMapper'
import type { InfluencerPublicProfile } from '../../domain/entities/InfluencerPublicProfile'
import { InfluencerPublicProfileMapper } from '../mapper/InfluencerPublicProfileMapper'

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
      scope: params.scope ?? 'mine',
    })
    return CampaignMapper.toDomainList(res.data.data ?? [])
  }

  async createCampaign(dto: CreateCampaignDTO): Promise<Campaign> {
    const res = await this.api.createCampaign({
      product_id: dto.productId,
      title: dto.title,
      objective: dto.objective ?? null,
      commission_type: dto.commissionType,
      commission_value: dto.commissionValue,
      budget: dto.budget ?? null,
      start_at: dto.startAt ?? null,
      end_at: dto.endAt ?? null,
    })
    return CampaignMapper.toDomain(res.data.data)
  }

  async updateCampaign(id: string, dto: UpdateCampaignDTO): Promise<Campaign> {
    const res = await this.api.updateCampaign(id, {
      title: dto.title ?? undefined,
      objective: dto.objective ?? undefined,
      commission_type: dto.commissionType ?? undefined,
      commission_value: dto.commissionValue ?? undefined,
      budget: dto.budget ?? undefined,
      start_at: dto.startAt ?? undefined,
      end_at: dto.endAt ?? undefined,
      status: dto.status ?? undefined,
    })
    return CampaignMapper.toDomain(res.data.data)
  }

  async publishCampaign(id: string): Promise<Campaign> {
    const res = await this.api.publishCampaign(id)
    return CampaignMapper.toDomain(res.data.data)
  }

  async deleteCampaign(id: string): Promise<void> {
    await this.api.deleteCampaign(id)
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

  async getCollaborationTimeline(collaborationId: string, params: TimelineParams): Promise<DashboardTimelinePoint[]> {
    const res = await this.api.getCollaborationTimeline(collaborationId, {
      from: params.from,
      to: params.to,
      group: params.group ?? 'day',
    })
    return TimelineMapper.toDomain(res.data.data ?? [])
  }

  async listBrandProducts(params: ListProductsParams): Promise<Product[]> {
    const res = await this.api.listBrandProducts({
      page: params.page ?? 1,
      size: params.size ?? 20,
    })
    return ProductMapper.toDomainList(res.data.data ?? [])
  }

  async createProduct(dto: CreateProductDTO): Promise<Product> {
    const res = await this.api.createProduct({
      name: dto.name,
      description: dto.description ?? null,
      price: dto.price ?? null,
      currency: dto.currency ?? null,
      landing_url: dto.landingUrl ?? null,
      images: dto.images ?? null,
    })
    return ProductMapper.toDomain(res.data.data)
  }

  async updateProduct(id: string, dto: UpdateProductDTO): Promise<Product> {
    const res = await this.api.updateProduct(id, {
      name: dto.name ?? undefined,
      description: dto.description ?? undefined,
      price: dto.price ?? undefined,
      currency: dto.currency ?? undefined,
      landing_url: dto.landingUrl ?? undefined,
      status: dto.status ?? undefined,
      images: dto.images ?? undefined,
    })
    return ProductMapper.toDomain(res.data.data)
  }

  async deleteProduct(id: string): Promise<void> {
    await this.api.deleteProduct(id)
  }

  async listCampaignTiers(campaignId: string): Promise<CampaignPayoutTier[]> {
    const res = await this.api.listCampaignTiers(campaignId)
    return CampaignPayoutTierMapper.toDomainList((res.data as any)?.data ?? [])
  }

  async createCampaignTier(campaignId: string, dto: CreateCampaignPayoutTierDTO): Promise<CampaignPayoutTier> {
    const res = await this.api.createCampaignTier(campaignId, {
      metric: dto.metric,
      from_value: dto.fromValue,
      to_value: dto.toValue ?? null,
      payout_amount: dto.payoutAmount,
      currency: dto.currency ?? null,
    })
    return CampaignPayoutTierMapper.toDomain(res.data.data as any)
  }

  async updateCampaignTier(tierId: string, dto: UpdateCampaignPayoutTierDTO): Promise<CampaignPayoutTier> {
    const res = await this.api.updateCampaignTier(tierId, {
      metric: dto.metric ?? undefined,
      from_value: dto.fromValue ?? undefined,
      to_value: dto.toValue ?? undefined,
      payout_amount: dto.payoutAmount ?? undefined,
      currency: dto.currency ?? undefined,
    })
    return CampaignPayoutTierMapper.toDomain(res.data.data as any)
  }

  async deleteCampaignTier(tierId: string): Promise<void> {
    await this.api.deleteCampaignTier(tierId)
  }

  async listBrandCampaignApplications(campaignId: string, params: ListCampaignApplicationsParams): Promise<CampaignApplication[]> {
    const res = await this.api.listBrandCampaignApplications(campaignId, {
      page: params.page ?? 1,
      size: params.size ?? 20,
    })
    return CampaignApplicationMapper.toDomainList(res.data.data ?? [])
  }

  async shortlistApplication(applicationId: string): Promise<CampaignApplication> {
    const res = await this.api.shortlistApplication(applicationId)
    return CampaignApplicationMapper.toDomain(res.data.data as any)
  }

  async acceptApplication(applicationId: string): Promise<CampaignApplication> {
    const res = await this.api.acceptApplication(applicationId)
    return CampaignApplicationMapper.toDomain(res.data.data as any)
  }

  async rejectApplication(applicationId: string): Promise<CampaignApplication> {
    const res = await this.api.rejectApplication(applicationId)
    return CampaignApplicationMapper.toDomain(res.data.data as any)
  }

  async getInfluencerPublicProfile(influencerId: string): Promise<InfluencerPublicProfile> {
    const res = await this.api.getInfluencerPublicProfile(influencerId)
    return InfluencerPublicProfileMapper.toDomain(res.data.data as any)
  }
}