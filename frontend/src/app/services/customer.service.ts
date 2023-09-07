import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Product} from "../models/product.model";
import {ProductDetail} from "../models/product-detail.model";
import {Order} from "../models/order";
import {OrderDetail} from "../models/order-detail";
import {Category} from "../models/category.model";

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(private http: HttpClient) { }

  getAllProducts() {
    return this.http.get<Product[]>("https://localhost/customers/getAllProducts", {
      withCredentials: true
    })
  }

  getCategories() {
    return this.http.get<Category[]>("https://localhost/customers/categories", {
      withCredentials: true
    })
  }

  getProductWithFilter(
    minPrice : number | undefined,
    maxPrice : number | undefined,
    sortField : string | undefined,
    sortOrder : "DESC" | "ASC",
    search : string | undefined,
    categoryId: number | undefined,
  ) {
    let params = ''
    if (minPrice) {
      params += `minPrice=${minPrice}`
    }
    if (maxPrice && params !== '') {
      params += `&maxPrice=${maxPrice}`
    } else if (maxPrice) {
      params += `maxPrice=${maxPrice}`
    }
    if (sortField && params !== '') {
      params += `&sortField=${sortField}&sortOrder=${sortOrder}`
    } else  if (sortField){
      params += `sortField=${sortField}&sortOrder=${sortOrder}`
    }
    if (search && params !== '') {
      params += `&search=${search}`
    } else if (search) {
      params += `search=${search}`
    }
    if (categoryId && params !== '') {
      params += `&category=${categoryId}`
    } else if (categoryId) {
      params += `category=${categoryId}`
    }
    return this.http.get<Product[]>(`https://localhost/customers/getAllProducts?${params}`, {
      withCredentials: true,
    })
  }

  getProductDetail(productId : string) {
    return this.http.get<ProductDetail[]>(`https://localhost/customers/getProduct/${productId}`, {
      withCredentials: true
    })
  }

  addToCart(productId : number, quantity: number) {
    return this.http.post("https://localhost/customers/addCart", {
      productId,
      quantity
    }, {
      withCredentials: true
    })
  }

  placeOrder() {
    return this.http.post("https://localhost/customers/placeOrder", {}, {
      withCredentials: true
    })
  }

  getAllOrders() {
    return this.http.get<Order[]>("https://localhost/customers/getAllOrders", {
      withCredentials: true
    })
  }

  getOrderDetail(orderId : number) {
    return this.http.get<OrderDetail[]>(`https://localhost:443/customers/getOrder/${orderId}`, {
      withCredentials: true
    })
  }

  updateStatusOrder(orderId : number, status: "Accept" | "Reject") {
    return this.http.put(`https://localhost:443/customers/updateStatus/${orderId}`, {
      newStatus: status
    }, {
      withCredentials: true
    })
  }
}
