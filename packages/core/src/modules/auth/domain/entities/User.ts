import { UserRole } from "./UserRole"
import { ProfileStatus } from "./ProfileStatus"

export interface User {
  id: string
  displayName: string
  email: string
  role: UserRole
  profileStatus: ProfileStatus
  createdAt: string
  updatedAt: string
  profileUrl?: string
  avatarUrl?: string
  profile?: Record<string, unknown> | null
  sellerProfile?: Record<string, unknown> | null
}
