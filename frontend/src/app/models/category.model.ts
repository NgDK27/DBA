export class Category {
  _id ?: string;
  categoryId?: number;
  name?: string;
  attributes ?: {
    key: string
    value: string
  }[]
  parent?: string
  children?: Category[]
}
