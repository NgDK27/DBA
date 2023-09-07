import { Component, OnInit } from '@angular/core';
import {UserService} from "../../../services/user.service";
import {Router} from "@angular/router";
import {CartService} from "../../../services/cart.service";

@Component({
  selector: 'app-header-user',
  templateUrl: './header-user.component.html',
  styleUrls: ['./header-user.component.css']
})
export class HeaderUserComponent implements OnInit {

  constructor(
    private router : Router,
    private userService : UserService
  ) { }

  ngOnInit(): void {
  }

  getRole() {
    return this.userService.getRole();
  }

  navigateToCart() {
    if (this.getRole()) {
      this.router.navigateByUrl("/user/cart");
    } else {
      this.router.navigateByUrl("/login");
    }
  }

  navigateToOrder() {
    if (this.getRole()) {
      this.router.navigateByUrl("/user/order");
    } else {
      this.router.navigateByUrl("/login");
    }
  }

  logout() {
    this.userService.logout();
    this.router.navigateByUrl("/login");
  }

}
