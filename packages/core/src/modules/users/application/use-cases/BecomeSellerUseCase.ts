import { IUserRepository } from '../../domain/repositories/IUserRepository'
import { BecomeSellerDTO } from '../../domain/dtos/BecomeSellerDTO'

export class BecomeSellerUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(payload: BecomeSellerDTO): Promise<void> {
    await this.userRepository.becomeSeller(payload)
  }
}
