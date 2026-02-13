import { IUserRepository } from "../repositories/IUserRepository"
import { UpdateUserProfileDTO } from "../dtos/UpdateUserProfileDTO"

export class UpdateUserProfileUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(data: UpdateUserProfileDTO): Promise<void> {
    await this.userRepository.updateUserProfile(data)
  }
}
