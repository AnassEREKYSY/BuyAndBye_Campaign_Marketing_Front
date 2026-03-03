import type { AxiosInstance } from 'axios'

export type InboxNotification = {
  id: string
  type: string
  title: string
  body?: string | null
  data?: Record<string, any> | null
  actor?: { id: string } | null
  entity?: { type: string; id: string } | null
  read_at?: string | null
  created_at?: string | null
}

export type Paginated<T> = {
  data: T[]
  meta?: any
  links?: any
}

function unwrap<T = any>(res: any): T {
  const body = res?.data ?? res
  return (body?.data ?? body) as T
}

function unwrapPaginated<T>(res: any): Paginated<T> {
  const body = res?.data ?? res
  if (body && Array.isArray(body.data)) {
    return { data: body.data as T[], meta: body.meta, links: body.links }
  }
    const inner = body?.data
  if (inner && Array.isArray(inner.data)) {
    return { data: inner.data as T[], meta: inner.meta, links: inner.links }
  }
  return { data: [] }
}

export class NotificationApiClient {
  constructor(private readonly http: AxiosInstance) {}

  async list(params?: { page?: number; size?: number; unread?: boolean }): Promise<Paginated<InboxNotification>> {
    const q = new URLSearchParams()
    if (params?.page) q.set('page', String(params.page))
    if (params?.size) q.set('size', String(params.size))
    if (typeof params?.unread === 'boolean') q.set('unread', params.unread ? '1' : '0')

    const res = await this.http.get(`/api/v1/notifications${q.toString() ? `?${q.toString()}` : ''}`)
    return unwrapPaginated<InboxNotification>(res)
  }

  async unreadCount(): Promise<number> {
    const res = await this.http.get(`/api/v1/notifications/unread-count`)
    const payload = unwrap<any>(res)
    const n = Number(payload?.count ?? payload ?? 0)
    return Number.isFinite(n) ? n : 0
  }

  async markRead(id: string): Promise<void> {
    await this.http.post(`/api/v1/notifications/${id}/read`)
  }

  async markAllRead(): Promise<void> {
    await this.http.post(`/api/v1/notifications/read-all`)
  }

  async remove(id: string): Promise<void> {
    await this.http.delete(`/api/v1/notifications/${id}`)
  }
}