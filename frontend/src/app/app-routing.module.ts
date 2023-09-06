import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CartUserComponent } from './user-module/components/cart-user/cart-user.component';
import { CheckoutUserComponent } from './user-module/components/checkout-user/checkout-user.component';
import { ContactUserComponent } from './user-module/components/contact-user/contact-user.component';
import { HomeUserComponent } from './user-module/components/home-user/home-user.component';
import { LayoutUserComponent } from './user-module/components/layout-user/layout-user.component';
import { ShopDetailUserComponent } from './user-module/components/shop-detail-user/shop-detail-user.component';
import { ShopUserComponent } from './user-module/components/shop-user/shop-user.component';
import {LoginComponent} from "./login/login.component";
import {RegisterComponent} from "./register/register.component";
import {OrderUserComponent} from "./user-module/components/order-user/order-user.component";

const routes: Routes = [
  {
    path: '', redirectTo: 'user/login', pathMatch: 'full',
  },
  {
    path: 'user',
    component: LayoutUserComponent,
    children: [
      { path: 'shop', component: ShopUserComponent, },
      { path: 'shopdetail/:productId', component: ShopDetailUserComponent },
      { path: 'cart', component: CartUserComponent },
      { path: 'order', component: OrderUserComponent},
      { path: 'contact', component: ContactUserComponent }
    ]
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)
  },
  {
    path: 'seller',
    loadChildren: () => import('./seller/seller.module').then(m => m.SellerModule)
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  { path: '**', redirectTo: 'exception/404' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
