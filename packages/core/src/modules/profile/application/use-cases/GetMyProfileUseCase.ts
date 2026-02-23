import { IProfileRepository } from "../../domain/repositories/IProfileRepository";

export class GetMyProfileUseCase {
  constructor(private readonly repo: IProfileRepository) {}
  execute() {
    return this.repo.getMyProfile();
  }
}