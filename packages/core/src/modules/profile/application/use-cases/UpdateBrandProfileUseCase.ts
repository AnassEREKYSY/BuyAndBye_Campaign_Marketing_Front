import { IProfileRepository } from "../../domain/repositories/IProfileRepository";
import { UpdateBrandProfileDTO } from "../../domain/dtos/UpdateBrandProfileDTO";

export class UpdateBrandProfileUseCase {
  constructor(private readonly repo: IProfileRepository) {}
  execute(dto: UpdateBrandProfileDTO) {
    return this.repo.updateBrandProfile(dto);
  }
}