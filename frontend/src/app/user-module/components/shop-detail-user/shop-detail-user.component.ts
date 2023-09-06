import { Component, OnInit } from '@angular/core';
import {ProductDetail} from "../../../models/product-detail.model";
import {ActivatedRoute, Router} from "@angular/router";
import {CustomerService} from "../../../services/customer.service";
import {CartService} from "../../../services/cart.service";

@Component({
  selector: 'app-shop-detail-user',
  templateUrl: './shop-detail-user.component.html',
  styleUrls: ['./shop-detail-user.component.css']
})
export class ShopDetailUserComponent implements OnInit {

  productDetail: ProductDetail = {};
  numberOfProduct = 0;

  constructor(
    private routerActivated : ActivatedRoute,
    private router : Router,
    private customerService: CustomerService,
    private cartService: CartService
  ) { }

  ngOnInit(): void {
    const idProduct = this.routerActivated.snapshot.paramMap.get("productId");
    if (idProduct) {
      this.customerService.getProductDetail(idProduct).subscribe({
        next: (data) => {
          this.productDetail = data[0];
          console.log(this.productDetail.image);
        },
        error: (err) => {
          console.log(err)
        }
      })
    }
  }

  increaseProduct() {
    this.numberOfProduct++;
  }

  decreaseProduct() {
    this.numberOfProduct > 0 && this.numberOfProduct--;
  }

  addToCart() {
    if (this.numberOfProduct == 0) {
      return;
    }
    if (this.productDetail.product_id) {
      this.customerService.addToCart(this.productDetail.product_id, this.numberOfProduct).subscribe({
        next: (data) => {
          console.log("data :", data);
          this.cartService.pushProduct(this.productDetail, this.numberOfProduct);
          this.router.navigateByUrl("/user/cart");
        },
        error: (err) => {
          console.log(err)
        }
      })
    }
  }
}
