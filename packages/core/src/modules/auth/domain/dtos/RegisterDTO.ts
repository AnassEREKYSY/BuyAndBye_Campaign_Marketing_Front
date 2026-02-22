import { UserRole } from "../entities"

export interface RegisterDTO {
  email: string
  displayName: string
  password: string
  role: UserRole  
  photo?: File
}