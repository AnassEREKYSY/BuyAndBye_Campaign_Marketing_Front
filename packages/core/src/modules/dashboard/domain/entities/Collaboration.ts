export type Collaboration = {
  id: string
  campaignId: string
  brandId: string
  influencerId: string
  acceptedAt?: string | null
  status: string

  tracking?: {
    code?: string | null
    url?: string | null
    destinationUrl?: string | null
  }

  promo?: {
    code?: string | null
  }

  campaign?: {
    id: string
    title: string
    status: string
    commissionType?: string
    commissionValue?: number
    budget?: number | null
    startAt?: string | null
    endAt?: string | null
    product?: { id: string; name: string; landingUrl?: string | null } | null
  } | null

  brand?: { id: string; displayName: string; photoUrl?: string | null } | null
  influencer?: { id: string; displayName: string; photoUrl?: string | null } | null

  createdAt?: string
  updatedAt?: string
}