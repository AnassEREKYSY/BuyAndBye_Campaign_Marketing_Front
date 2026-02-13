import { UserRole } from "./UserRole"
import { ProfileStatus } from "./ProfileStatus"

export interface UserProfile {
  phoneNumber: string | null
  birthDate: string | null
  gender: string | null
  countryCode: string | null
  locale: string | null
  buyerCategories: string[] | null
  buyerInterests: string[] | null
  paymentMethods: string[] | null
}

export interface SellerProfile {
  storeName: string | null
  companyName: string | null
  vatNumber: string | null
  supportEmail: string | null
  supportPhone: string | null
  categoryTags: string[] | null
  storeDescription: string | null
  storeBannerUrl: string | null
}

export interface User {
  id: string
  displayName: string
  email: string
  role: UserRole
  profileStatus: ProfileStatus
  createdAt: string
  updatedAt: string
  avatarUrl: string
  profile: UserProfile | null
  sellerProfile: SellerProfile | null
}
