import { Component, OnInit } from '@angular/core';
import {CartService} from "../../../services/cart.service";
import {ProductDetail} from "../../../models/product-detail.model";
import {CustomerService} from "../../../services/customer.service";
import {Router} from "@angular/router";
import {NzNotificationService} from "ng-zorro-antd/notification";

@Component({
  selector: 'app-cart-user',
  templateUrl: './cart-user.component.html',
  styleUrls: ['./cart-user.component.css']
})
export class CartUserComponent implements OnInit {

  shippingFee = 0;

  cart : {
    productDetail: ProductDetail,
    quantity: number
  }[] = [];

  constructor(
    private cartService : CartService,
    private customerService: CustomerService,
    private router: Router,
    private notification : NzNotificationService
  ) { }

  ngOnInit(): void {
    this.cart = this.cartService.getCart();
    console.log(this.cart)
  }

  placeOrder() {
    if (this.cart.length == 0) {
      this.notification.create("warning", "Order", "Cart is empty");
      return;
    }
    this.customerService.placeOrder().subscribe({
      next: (data) => {
        console.log('data :', data)
        this.cartService.clearCart();
        this.router.navigateByUrl("user/shop");
        this.notification.create("success", "Order", "Order successfully");
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  calculatePrice(price : number | undefined, quantity: number) {
    return (price || 0) * quantity;
  }

  total() {
    return this.cart.reduce((acc, cartItem, index) => {
      return acc + (cartItem.productDetail.price || 0) * cartItem.quantity;
    }, 0)
  }

  totalForPayment() {
    return this.total() + this.shippingFee;
  }

}
