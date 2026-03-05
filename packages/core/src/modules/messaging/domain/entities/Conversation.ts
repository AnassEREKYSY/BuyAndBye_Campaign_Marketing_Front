import type { Message } from './Message'

export type Conversation = {
  id: string
  campaign_id: string
  campaign_application_id: string
  brand_user_id: string
  influencer_user_id: string
  status: 'open' | 'closed'
  closed_at?: string | null
  closed_reason?: string | null
  messages_count?: number
  updated_at?: string
  campaign?: { id: string; title: string }
  participants?: Array<{ user_id: string; last_read_at?: string | null }> | null
  messages?: Message[]
}