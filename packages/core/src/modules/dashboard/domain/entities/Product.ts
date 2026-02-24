import { ProductStatus } from "./ProductStatus";

export class Product {
  constructor(
    public readonly id: string,
    public readonly brandId: string,
    public readonly name: string,
    public readonly description: string | null,
    public readonly price: number | null,
    public readonly currency: string | null,
    public readonly landingUrl: string | null,
    public readonly status: ProductStatus,
    public readonly images: string[],
    public readonly createdAt: string | null,
    public readonly updatedAt: string | null,
  ) {}
}