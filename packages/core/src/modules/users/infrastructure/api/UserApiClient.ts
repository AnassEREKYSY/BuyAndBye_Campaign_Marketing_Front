import { ApiResponse } from '../../../auth/infrastructure/api/types/ApiResponse'
import { UpdateUserProfileDTO } from '../../domain/dtos/UpdateUserProfileDTO'
import { UpdateSellerProfileDTO } from '../../domain/dtos/UpdateSellerProfileDTO'
import { BecomeSellerDTO } from '../../domain/dtos/BecomeSellerDTO'
import { HttpClient } from '../../../../shared/services/http/HttpClient'

export class UserApiClient {
  constructor(private httpClient: HttpClient) {}

  async becomeSeller(payload: BecomeSellerDTO): Promise<void> {
    const response = await this.httpClient.post<ApiResponse>(
      '/users/become-seller',
      {
        store_name: payload.storeName,
        country_code: payload.countryCode,
      }
    )

    if (!response.data.success) {
      throw new Error(response.data.message)
    }
  }

  async updateUserProfile(data: UpdateUserProfileDTO): Promise<void> {
    const formData = new FormData()

    if (data.displayName) formData.append('display_name', data.displayName)
    if (data.photo) formData.append('photo', data.photo)
    if (data.phoneNumber) formData.append('phone_number', data.phoneNumber)
    if (data.birthDate) formData.append('birth_date', data.birthDate)
    if (data.gender) formData.append('gender', data.gender)
    if (data.countryCode) formData.append('country_code', data.countryCode)
    if (data.locale) formData.append('locale', data.locale)

    if (data.buyerCategories)
      data.buyerCategories.forEach(v =>
        formData.append('buyer_categories[]', v)
      )

    if (data.buyerInterests)
      data.buyerInterests.forEach(v =>
        formData.append('buyer_interests[]', v)
      )

    if (data.paymentMethods)
      data.paymentMethods.forEach(v =>
        formData.append('payment_methods[]', v)
      )

    await this.httpClient.put(
      '/users/profile',
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    )
  }

  async updateSellerProfile(data: UpdateSellerProfileDTO): Promise<void> {
    const formData = new FormData()

    if (data.storeName) formData.append('store_name', data.storeName)
    if (data.companyName) formData.append('company_name', data.companyName)
    if (data.vatNumber) formData.append('vat_number', data.vatNumber)
    if (data.supportEmail) formData.append('support_email', data.supportEmail)
    if (data.supportPhone) formData.append('support_phone', data.supportPhone)
    if (data.storeDescription)
      formData.append('store_description', data.storeDescription)
    if (data.storeBanner) formData.append('store_banner', data.storeBanner)

    if (data.categoryTags)
      data.categoryTags.forEach(v =>
        formData.append('category_tags[]', v)
      )

    await this.httpClient.put(
      '/users/seller-profile',
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    )
  }
}
