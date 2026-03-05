export type ApiMessage = {
  id: string
  conversation_id: string
  sender_id: string
  body: string
  created_at: string
  sender?: { id: string; email: string } | null
}