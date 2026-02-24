import type { Product } from './Product'

export type CampaignStatus = 'draft' | 'published' | 'closed'
export type CommissionType = 'percent' | 'fixed'

export class Campaign {
  constructor(
    public readonly id: string,
    public readonly brandId: string,
    public readonly productId: string,
    public readonly title: string,
    public readonly objective: string | null,
    public readonly commissionType: CommissionType,
    public readonly commissionValue: number,
    public readonly budget: number | null,
    public readonly startAt: string | null,
    public readonly endAt: string | null,
    public readonly status: CampaignStatus,
    public readonly product?: Product | null,
    public readonly createdAt?: string | null,
    public readonly updatedAt?: string | null,
  ) {}
}