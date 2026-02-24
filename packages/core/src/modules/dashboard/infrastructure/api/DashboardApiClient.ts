import type { ApiEnvelope } from './types/ApiEnvelope'
import type { ApiInfluencerDashboard } from './types/ApiInfluencerDashboard'
import type { ApiPayout } from './types/ApiPayout'
import type { ApiCampaign } from './types/ApiCampaign'
import type { ApiCollaboration } from './types/ApiCollaboration'
import type { ApiBrandCampaignSummary } from './types/ApiBrandCampaignSummary'
import type { ApiTimelinePoint } from './types/ApiTimelinePoint'
import type { ApiProduct } from './types/ApiProduct'
import { HttpClient } from '@core/shared/services/http/HttpClient'

export class DashboardApiClient {
  constructor(private readonly http: HttpClient) {}

  async getInfluencerDashboard() {
    return this.http.get<ApiEnvelope<ApiInfluencerDashboard>>('/api/v1/influencer/dashboard')
  }

  async listInfluencerPayouts() {
    return this.http.get<ApiEnvelope<ApiPayout[]>>('/api/v1/influencer/payouts')
  }

  async listCampaigns(params: { page: number; size: number; status?: string; scope?: 'mine' | 'all' }) {
    const q = new URLSearchParams()
    q.set('page', String(params.page))
    q.set('size', String(params.size))
    if (params.status) q.set('status', params.status)
    if (params.scope) q.set('scope', params.scope)
    return this.http.get<{ data: ApiCampaign[] }>(`/api/v1/campaigns?${q.toString()}`)
  }

  async createCampaign(payload: {
    product_id: string
    title: string
    objective?: string | null
    commission_type: 'percent' | 'fixed'
    commission_value: number
    budget?: number | null
    start_at?: string | null
    end_at?: string | null
  }) {
    return this.http.post<ApiEnvelope<ApiCampaign>>('/api/v1/campaigns', payload)
  }

  async updateCampaign(
    id: string,
    payload: {
      title?: string
      objective?: string | null
      commission_type?: 'percent' | 'fixed' | null
      commission_value?: number | null
      budget?: number | null
      start_at?: string | null
      end_at?: string | null
      status?: 'draft' | 'published' | 'closed' | null
    },
  ) {
    return this.http.put<ApiEnvelope<ApiCampaign>>(`/api/v1/campaigns/${id}`, payload)
  }

  async publishCampaign(id: string) {
    return this.http.post<ApiEnvelope<ApiCampaign>>(`/api/v1/campaigns/${id}/publish`, {})
  }

  async deleteCampaign(id: string) {
    return this.http.delete<ApiEnvelope<{ success: boolean }>>(`/api/v1/campaigns/${id}`)
  }

  async listCollaborations(params: { page: number; size: number }) {
    const q = new URLSearchParams()
    q.set('page', String(params.page))
    q.set('size', String(params.size))
    return this.http.get<{ data: ApiCollaboration[] }>(`/api/v1/collaborations?${q.toString()}`)
  }

  async getBrandCampaignSummary(campaignId: string) {
    return this.http.get<ApiEnvelope<ApiBrandCampaignSummary>>(`/api/v1/brand/campaigns/${campaignId}/summary`)
  }

  async getBrandCampaignTimeline(campaignId: string, params: { from: string; to: string; group: string }) {
    const q = new URLSearchParams()
    q.set('from', params.from)
    q.set('to', params.to)
    q.set('group', params.group)
    return this.http.get<ApiEnvelope<ApiTimelinePoint[]>>(`/api/v1/brand/campaigns/${campaignId}/timeline?${q.toString()}`)
  }

  async getCollaborationTimeline(collaborationId: string, params: { from: string; to: string; group: string }) {
    const q = new URLSearchParams()
    q.set('from', params.from)
    q.set('to', params.to)
    q.set('group', params.group)
    return this.http.get<ApiEnvelope<ApiTimelinePoint[]>>(`/api/v1/collaborations/${collaborationId}/timeline?${q.toString()}`)
  }

  async listBrandProducts(params: { page: number; size: number }) {
    const q = new URLSearchParams()
    q.set('page', String(params.page))
    q.set('size', String(params.size))
    return this.http.get<{ data: ApiProduct[] }>(`/api/v1/products?${q.toString()}`)
  }

  async createProduct(payload: {
    name: string
    description?: string | null
    price?: number | null
    currency?: string | null
    landing_url?: string | null
    images?: string[] | null
  }) {
    return this.http.post<ApiEnvelope<ApiProduct>>('/api/v1/products', payload)
  }

  async updateProduct(
    id: string,
    payload: {
      name?: string
      description?: string | null
      price?: number | null
      currency?: string | null
      landing_url?: string | null
      status?: 'draft' | 'active' | 'archived' | null
      images?: string[] | null
    },
  ) {
    return this.http.put<ApiEnvelope<ApiProduct>>(`/api/v1/products/${id}`, payload)
  }

  async deleteProduct(id: string) {
    return this.http.delete<ApiEnvelope<{ success: boolean }>>(`/api/v1/products/${id}`)
  }
}