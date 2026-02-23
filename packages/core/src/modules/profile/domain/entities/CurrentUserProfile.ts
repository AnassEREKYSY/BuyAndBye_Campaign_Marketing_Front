import { UserRole } from "@core/modules/auth/domain/entities";
import { BrandProfile } from "./BrandProfile";
import { InfluencerProfile } from "./InfluencerProfile";

export interface CurrentUserProfile {
  id: string;
  email: string;
  display_name: string;
  role: UserRole;
  photo_url?: string | null;
  brandProfile?: BrandProfile | null;
  influencerProfile?: InfluencerProfile | null;
}