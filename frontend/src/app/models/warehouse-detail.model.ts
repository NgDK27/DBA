export class WarehouseDetail {
  result1?: Result1[];
  result2?: {
    available_area ?: number
  }[]
}

type Result1 = {
  product_id?: number,
  total_quantity?: number,
  occupied_area?: number
}
