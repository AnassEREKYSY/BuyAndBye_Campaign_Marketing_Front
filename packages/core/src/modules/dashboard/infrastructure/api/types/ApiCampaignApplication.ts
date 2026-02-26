export type ApiApplicantSummary = {
  id: string
  display_name: string
  photo_url: string | null
}

export type ApiCampaignApplication = {
  id: string
  campaign_id: string
  influencer_id: string
  message: string | null
  status: 'pending' | 'shortlisted' | 'accepted' | 'rejected'
  influencer?: ApiApplicantSummary
  created_at: string | null
  updated_at: string | null
}