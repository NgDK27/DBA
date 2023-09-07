export class ProductDetail {
  product_id?: number;
  title?: string;
  description?: string;
  price?: number;
  image?: string;
  category?: string;
  quantity?: number;
  seller?: string;
  attributes?: {
    key : string,
    value: string
  }[]
}
