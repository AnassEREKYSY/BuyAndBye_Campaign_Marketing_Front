import { UserRole } from "@core/modules/auth/domain/entities"

export type ApiRegisterRequest = {
  email: string
  password: string
  display_name: string
  role: UserRole
  photo?: File
}