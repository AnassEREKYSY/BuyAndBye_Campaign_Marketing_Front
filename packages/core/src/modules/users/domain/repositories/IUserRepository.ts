import { UpdateUserProfileDTO } from '../dtos/UpdateUserProfileDTO';
import { UpdateSellerProfileDTO } from '../dtos/UpdateSellerProfileDTO';
import { BecomeSellerDTO } from '../dtos/BecomeSellerDTO';

export interface IUserRepository {
  becomeSeller(payload: BecomeSellerDTO): Promise<void>;
  updateUserProfile(data: UpdateUserProfileDTO): Promise<void>;
  updateSellerProfile(data: UpdateSellerProfileDTO): Promise<void>;
}
