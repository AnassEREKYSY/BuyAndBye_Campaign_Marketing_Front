import { DashboardTimelinePoint } from '../../domain/entities/DashboardTimelinePoint'
import type { ApiTimelinePoint } from '../api/types/ApiTimelinePoint'

export class TimelineMapper {
  static toDomain(items: ApiTimelinePoint[]): DashboardTimelinePoint[] {
    return (items ?? [])
      .map((p) => {
        const date = String(p?.date ?? p?.day ?? p?.label ?? p?.x ?? p?.time ?? '').slice(0, 10) || ''
        const total = Number(p?.total ?? p?.clicks ?? p?.count ?? p?.y ?? 0) || 0
        const unique = p?.unique !== undefined ? Number(p.unique) || 0 : undefined
        return { date, total, unique }
      })
      .filter((p) => Boolean(p.date))
  }
}