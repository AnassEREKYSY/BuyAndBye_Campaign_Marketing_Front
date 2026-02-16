import { ReactNode } from 'react'
import { SellerContext, SellerContextValue } from './SellerContext'

interface SellerProviderProps extends SellerContextValue {
  children: ReactNode
}

export function SellerProvider({
  children,
  getSellerProductsUseCase,
  createProductUseCase,
  updateProductUseCase,
  deleteProductUseCase,
  updateProductStatusUseCase,
}: SellerProviderProps) { 
  return (
    <SellerContext.Provider value={{ getSellerProductsUseCase, createProductUseCase, updateProductUseCase, deleteProductUseCase , updateProductStatusUseCase,}}>
      {children}
    </SellerContext.Provider>
  )
}