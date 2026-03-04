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
  if (body?.data !== undefined) return body.data as T
  return body as T
}

function unwrapPaginated<T>(res: any): Paginated<T> {
  const body = res?.data ?? res

  if (Array.isArray(body)) return { data: body as T[] }

  if (body && Array.isArray(body.data)) {
    return { data: body.data as T[], meta: body.meta, links: body.links }
  }

  const inner = body?.data

  if (Array.isArray(inner)) return { data: inner as T[] }

  if (inner && Array.isArray(inner.data)) {
    return { data: inner.data as T[], meta: inner.meta, links: inner.links }
  }

  return { data: [] }
}

function apiPrefix(http: AxiosInstance) {
  const base = String((http as any)?.defaults?.baseURL ?? '').replace(/\/+$/, '')
  return base.endsWith('/api/v1') ? '' : '/api/v1'
}

export class NotificationApiClient {
  private readonly prefix: string

  constructor(private readonly http: AxiosInstance) {
    this.prefix = apiPrefix(http)
  }

  async list(params?: { page?: number; size?: number; unread?: boolean }): Promise<Paginated<InboxNotification>> {
    const q = new URLSearchParams()
    if (params?.page) q.set('page', String(params.page))
    if (params?.size) q.set('size', String(params.size))
    if (typeof params?.unread === 'boolean') q.set('unread', params.unread ? '1' : '0')

    const res = await this.http.get(`${this.prefix}/notifications${q.toString() ? `?${q.toString()}` : ''}`)
    return unwrapPaginated<InboxNotification>(res)
  }

  async unreadCount(): Promise<number> {
    const res = await this.http.get(`${this.prefix}/notifications/unread-count`)
    const payload = unwrap<any>(res)
    const n = Number(payload?.count ?? payload ?? 0)
    return Number.isFinite(n) ? n : 0
  }

  async markRead(id: string): Promise<void> {
    await this.http.post(`${this.prefix}/notifications/${id}/read`)
  }

  async markAllRead(): Promise<void> {
    await this.http.post(`${this.prefix}/notifications/read-all`)
  }

  async remove(id: string): Promise<void> {
    await this.http.delete(`${this.prefix}/notifications/${id}`)
  }
}