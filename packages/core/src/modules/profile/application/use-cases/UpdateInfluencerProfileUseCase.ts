import { IProfileRepository } from "../../domain/repositories/IProfileRepository";
import { UpdateInfluencerProfileDTO } from "../../domain/dtos/UpdateInfluencerProfileDTO";

export class UpdateInfluencerProfileUseCase {
  constructor(private readonly repo: IProfileRepository) {}
  execute(dto: UpdateInfluencerProfileDTO) {
    return this.repo.updateInfluencerProfile(dto);
  }
}