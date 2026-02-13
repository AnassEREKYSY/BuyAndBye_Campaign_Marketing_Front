import { UserRole } from "../../../domain/entities/UserRole"
import { ProfileStatus } from "../../../domain/entities/ProfileStatus"

export interface ApiUserResponse {
  id: string
  email: string
  display_name: string
  photo_url: string | null
  role: UserRole
  status: ProfileStatus
  profile_completed: boolean
  profile_skipped: boolean
  email_verified_at: string | null
  created_at: string
  updated_at: string

  profile: null | {
    phone_number: string | null
    birth_date: string | null
    gender: string | null
    country_code: string | null
    locale: string | null
    buyer_categories: string[] | null
    buyer_interests: string[] | null
    payment_methods: string[] | null
  }

  seller_profile: null | {
    store_name: string | null
    company_name: string | null
    vat_number: string | null
    support_email: string | null
    support_phone: string | null
    category_tags: string[] | null
    store_description: string | null
    store_banner_url: string | null
  }
}
