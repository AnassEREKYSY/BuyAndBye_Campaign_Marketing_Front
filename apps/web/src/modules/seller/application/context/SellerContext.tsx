import { createContext } from "react"
import { GetSellerProductsUseCase } from "@core/modules/products/application/use-cases/GetSellerProductsUseCase" 
import { CreateProductUseCase } from "@core/modules/products/application/use-cases/CreateProductUseCase"
import { UpdateProductUseCase } from "@core/modules/products/application/use-cases/UpdateProductUseCase"
import { DeleteProductUseCase } from "@core/modules/products/application/use-cases/DeleteProductUseCase"
import { UpdateProductStatusUseCase } from "@core/modules/products/application/use-cases/UpdateProductStatusUseCase"

export interface SellerContextValue {
  getSellerProductsUseCase: GetSellerProductsUseCase
  createProductUseCase: CreateProductUseCase
  updateProductUseCase: UpdateProductUseCase
  deleteProductUseCase: DeleteProductUseCase
  updateProductStatusUseCase: UpdateProductStatusUseCase
}

export const SellerContext = createContext<SellerContextValue | undefined>(undefined)