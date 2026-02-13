export interface UpdateUserProfileDTO {
    displayName?: string
    photo?: File
    phoneNumber?: string
    birthDate?: string
    gender?: string
    countryCode?: string
    locale?: string
    buyerCategories?: string[]
    buyerInterests?: string[]
    paymentMethods?: string[]
  }
