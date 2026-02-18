import { ReactNode, useMemo } from 'react'
import { SellerProvider } from './SellerProvider'
import { SellerContainer } from '@core/modules/seller/infrastructure/container/SellerContainer'
import { useAppHttpClient, useAppBackendBaseUrl } from '@/app/providers/AppProviders'

export const SellerRouteProviders = ({ children }: { children: ReactNode }) => {
  const httpClient = useAppHttpClient()
  const backendBaseUrl = useAppBackendBaseUrl()

  const sellerContainer = useMemo(() => SellerContainer.getInstance(httpClient, backendBaseUrl), [httpClient, backendBaseUrl])

  return (
    <SellerProvider
      getSellerProductsUseCase={sellerContainer.getSellerProductsUseCase}
      createProductUseCase={sellerContainer.createProductUseCase}
      updateProductUseCase={sellerContainer.updateProductUseCase}
      deleteProductUseCase={sellerContainer.deleteProductUseCase}
      updateProductStatusUseCase={sellerContainer.updateProductStatusUseCase}
    >
      {children}
    </SellerProvider>
  )
}