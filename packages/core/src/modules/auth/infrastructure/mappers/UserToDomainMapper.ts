import { ApiUserResponse } from "../api/types/ApiUserResponse"
import { User } from "../../domain/entities/User"

export class UserToDomainMapper {
  static map(apiUser: ApiUserResponse, backendBaseUrl: string): User {
    return {
      id: apiUser.id,
      displayName: apiUser.display_name,
      email: apiUser.email,
      role: apiUser.role,
      profileStatus: apiUser.status,
      createdAt: apiUser.created_at,
      updatedAt: apiUser.updated_at,
      avatarUrl: apiUser.photo_url
      ? `${backendBaseUrl}${apiUser.photo_url}`
      : "",

      profile: apiUser.profile
        ? {
            phoneNumber: apiUser.profile.phone_number,
            birthDate: apiUser.profile.birth_date,
            gender: apiUser.profile.gender,
            countryCode: apiUser.profile.country_code,
            locale: apiUser.profile.locale,
            buyerCategories: apiUser.profile.buyer_categories,
            buyerInterests: apiUser.profile.buyer_interests,
            paymentMethods: apiUser.profile.payment_methods,
          }
        : null,

      sellerProfile: apiUser.seller_profile
        ? {
            storeName: apiUser.seller_profile.store_name,
            companyName: apiUser.seller_profile.company_name,
            vatNumber: apiUser.seller_profile.vat_number,
            supportEmail: apiUser.seller_profile.support_email,
            supportPhone: apiUser.seller_profile.support_phone,
            categoryTags: apiUser.seller_profile.category_tags,
            storeDescription: apiUser.seller_profile.store_description,
            storeBannerUrl: apiUser.seller_profile.store_banner_url
            ? `${backendBaseUrl}${apiUser.seller_profile.store_banner_url}`
            : null,
          }
        : null,
    }
  }
}
