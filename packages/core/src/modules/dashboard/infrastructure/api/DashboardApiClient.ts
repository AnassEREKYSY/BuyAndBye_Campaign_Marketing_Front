import type { ApiEnvelope } from './types/ApiEnvelope'
import type { ApiInfluencerDashboard } from './types/ApiInfluencerDashboard'
import type { ApiPayout } from './types/ApiPayout'
import type { ApiCampaign } from './types/ApiCampaign'
import type { ApiCollaboration } from './types/ApiCollaboration'
import type { ApiBrandCampaignSummary } from './types/ApiBrandCampaignSummary'
import type { ApiTimelinePoint } from './types/ApiTimelinePoint'
import { HttpClient } from '@core/shared/services/http/HttpClient'

export class DashboardApiClient {
  constructor(private readonly http: HttpClient) {}

  async getInfluencerDashboard() {
    return this.http.get<ApiEnvelope<ApiInfluencerDashboard>>('/api/v1/influencer/dashboard')
  }

  async listInfluencerPayouts() {
    return this.http.get<ApiEnvelope<ApiPayout[]>>('/api/v1/influencer/payouts')
  }

  async listCampaigns(params: { page: number; size: number; status?: string }) {
    const q = new URLSearchParams()
    q.set('page', String(params.page))
    q.set('size', String(params.size))
    if (params.status) q.set('status', params.status)
    return this.http.get<{ data: ApiCampaign[] }>(`/api/v1/campaigns?${q.toString()}`)
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
}