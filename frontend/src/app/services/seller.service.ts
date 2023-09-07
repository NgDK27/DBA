import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Product} from "../models/product.model";
import {ProductForm} from "../models/product-form";

@Injectable({
  providedIn: 'root'
})
export class SellerService {

  constructor(private http : HttpClient) { }

  getAllProducts() {
    return this.http.get<Product[]>("https://localhost/sellers/getAllProducts", {
      withCredentials: true
    })
  }

  getProduct(productId : number) {
    return this.http.get(`https://localhost/sellers/getProduct/${productId}`, {
      withCredentials: true
    })
  }

  addNewProduct(product : ProductForm) {
    const body = new FormData();
    body.append("title", product.title as string);
    body.append("description", product.description as string);
    body.append("price", String(product.price));
    body.append("length", String(product.length));
    body.append("width", String(product.width));
    body.append("height", String(product.height));
    body.append("category_id", String(product.category));
    body.append("image", product.image ? product.image : "");

    return this.http.post("https://localhost/sellers/createProduct", body, {
      withCredentials: true,
      responseType: "text"
    })
  }

  updateProduct(product : Product) {
    return this.http.put(`https://localhost/sellers/products/${product.product_id}`, {
      title: product.title,
      description: product.description,
      price: product.price
    }, {
      withCredentials: true
    })
  }

  deleteProduct(productId : number) {
    return this.http.delete(`https://localhost/sellers/products/${productId}`, {
      withCredentials: true
    })
  }

  importProduct(productId: number, quantity: number) {
    return this.http.post("https://localhost/sellers/sendInbound", {
      productId,
      quantity
    }, {
      withCredentials: true
    })
  }
}
