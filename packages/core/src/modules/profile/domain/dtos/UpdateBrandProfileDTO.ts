export interface UpdateBrandProfileDTO {
  brand_name?: string;
  website_url?: string;
  industry?: string;
  contact_email?: string;
  contact_phone?: string;
  description?: string;
  logo?: File | null;
}