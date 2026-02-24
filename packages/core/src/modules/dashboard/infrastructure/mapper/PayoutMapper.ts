import { Payout } from '../../domain/entities/Payout'
import type { ApiPayout } from '../api/types/ApiPayout'

export class PayoutMapper {
  static toDomain(p: ApiPayout): Payout {
    return {
      id: p.id,
      collaborationId: p.collaboration_id,
      amount: Number(p.amount) || 0,
      currency: p.currency,
      status: p.status,
      createdAt: p.created_at,
    }
  }

  static toDomainList(items: ApiPayout[]): Payout[] {
    return (items ?? []).map((x) => this.toDomain(x))
  }
}