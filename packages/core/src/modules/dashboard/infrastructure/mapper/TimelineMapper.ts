import { DashboardTimelinePoint } from '../../domain/entities/DashboardTimelinePoint'
import type { ApiTimelinePoint } from '../api/types/ApiTimelinePoint'

export class TimelineMapper {
  static toDomain(items: ApiTimelinePoint[]): DashboardTimelinePoint[] {
    return (items ?? [])
      .map((p) => {
        const date = String(p?.date ?? p?.day ?? p?.label ?? p?.x ?? p?.time ?? '').slice(0, 10) || ''
        const q = p as any
        const total = Number(q?.clicks_total ?? q?.total ?? q?.clicks ?? q?.count ?? q?.y ?? 0) || 0
        const rawUnique = q?.clicks_unique ?? q?.unique
        const unique = rawUnique !== undefined ? Number(rawUnique) || 0 : undefined
        return { date, total, unique }
      })
      .filter((p) => Boolean(p.date))
  }
}