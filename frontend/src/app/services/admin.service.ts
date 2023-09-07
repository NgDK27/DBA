import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Category} from "../models/category.model";
import {Warehouse} from "../models/warehouse.model";
import {WarehouseForm} from "../models/warehouse-form.model";
import {WarehouseDetail} from "../models/warehouse-detail.model";

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http : HttpClient) { }

  getAllCategories() {
    return this.http.get<Category[]>("https://localhost/admins/categories", {
      withCredentials: true
    })
  }

  getCategory(id : number) {
    return this.http.get<Category>(`https://localhost/admins/categories/${id}`, {
      withCredentials: true
    })
  }

  createNewCategory(name: string, parentName: string, attributes: {
    key: string,
    value: string
  }[] | null) {
    return this.http.post<Category>("https://localhost/admins/categories", {
      name,
      parentName,
      attributes
    }, {
      withCredentials: true
    });
  }

  updateCategory(categoryId: number, name: string, attributes: {
    key: string,
    value: string
  }[] | null) {
    return this.http.put(`https://localhost/admins/categories/${categoryId}`, {
      name,
      attributes
    }, {
      withCredentials: true
    })
  }

  deleteCategory(category : Category) {
    return this.http.delete(`https://localhost/admins/categories/${category.categoryId}`, {
      withCredentials: true
    })
  }

  getAllWarehouses() {
    return this.http.get<Warehouse[]>("https://localhost/admins/warehouses", {
      withCredentials: true
    })
  }

  getWarehouse(warehouseId : number) {
    return this.http.get<WarehouseDetail>(`https://localhost/admins/warehouses/${warehouseId}`, {
      withCredentials: true
    })
  }

  addNewWarehouse(warehouse : WarehouseForm) {
    return this.http.post("https://localhost/admins/warehouses", warehouse, {
      withCredentials: true,
      responseType: "text"
    })
  }

  updateWarehouse(warehouse : WarehouseForm, warehouseId :number) {
    return this.http.put(`https://localhost/admins/warehouses/${warehouseId}`, warehouse, {
      withCredentials: true
    })
  }

  deleteWarehouse(warehouse : Warehouse) {
    return this.http.delete(`https://localhost/admins/warehouses?name=${warehouse.name}`, {
      withCredentials: true,
      responseType: "text"
    })
  }

  moveProduct(from : number, to : number, productId: number, quantity: number) {
    return this.http.post(`https://localhost/admins/moveProducts`, {
      sourceWarehouseId: from,
      destinationWarehouseId: to,
      productId: productId,
      quantity: quantity
    }, {
      withCredentials: true
    })
  }
}
