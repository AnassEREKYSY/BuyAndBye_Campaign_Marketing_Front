import { IUserRepository } from "../repositories/IUserRepository"
import { UpdateSellerProfileDTO } from "../dtos/UpdateSellerProfileDTO"

export class UpdateSellerProfileUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(data: UpdateSellerProfileDTO): Promise<void> {
    await this.userRepository.updateSellerProfile(data)
  }
}
