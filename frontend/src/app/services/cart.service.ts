import { Injectable } from '@angular/core';
import {ProductDetail} from "../models/product-detail.model";

type CartAItem = {
  productDetail: ProductDetail;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private cart: CartAItem[];

  constructor() {
    const cartExist = sessionStorage.getItem("cart");
    if (cartExist) {
      this.cart = JSON.parse(cartExist);
    } else this.cart = [];
  }

  pushProduct(productDetail : ProductDetail, quantity: number) {
    let index = 0;
    const cartItemExist = this.cart.find((cartItem, i) => {
      index = i;
      return productDetail.product_id === cartItem.productDetail.product_id;
    })

    if (cartItemExist) {
      cartItemExist.quantity += quantity;
      this.cart[index] = cartItemExist;
    } else {
      this.cart.push({
        productDetail,
        quantity
      })
    }
    sessionStorage.setItem("cart", JSON.stringify(this.cart));
  }

  getCart() {
    return this.cart;
  }

  clearCart() {
    this.cart = [];
    sessionStorage.removeItem("cart");
  }

}
