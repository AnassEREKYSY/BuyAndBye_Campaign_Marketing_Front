import { useContext } from 'react'
import { SellerContext } from './SellerContext'

export function useSeller() {
  const ctx = useContext(SellerContext)
  if (!ctx) throw new Error('useSeller must be used within SellerProvider')
  return ctx
}