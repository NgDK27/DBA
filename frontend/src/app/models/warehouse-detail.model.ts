export class WarehouseDetail {
  result1?: Result1[];
  result2?: {
    available_area ?: number
  }[]
}

type Result1 = {
  product_id?: number,
  total_quantity?: number,
  occupied_area?: number,
  name?: String,
  province?: String,
  city?: String,
  district?: String,
  street?: String,
  number?: String,
  total_area_volume?: number
}
