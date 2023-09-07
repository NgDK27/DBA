import {LOCALE_ID, NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LayoutUserComponent } from './user-module/components/layout-user/layout-user.component';
import { HeaderUserComponent } from './user-module/components/header-user/header-user.component';
import { FooterUserComponent } from './user-module/components/footer-user/footer-user.component';
import { HomeUserComponent } from './user-module/components/home-user/home-user.component';
import { ShopUserComponent } from './user-module/components/shop-user/shop-user.component';
import { ShopDetailUserComponent } from './user-module/components/shop-detail-user/shop-detail-user.component';
import { CartUserComponent } from './user-module/components/cart-user/cart-user.component';
import { CheckoutUserComponent } from './user-module/components/checkout-user/checkout-user.component';
import { ContactUserComponent } from './user-module/components/contact-user/contact-user.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {NzFormModule} from "ng-zorro-antd/form";
import {NzInputModule} from "ng-zorro-antd/input";
import {NzCheckboxModule} from "ng-zorro-antd/checkbox";
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzSelectModule} from "ng-zorro-antd/select";
import {AdminModule} from "./admin/admin.module";
import {SellerModule} from "./seller/seller.module";
import {NzPaginationModule} from "ng-zorro-antd/pagination";
import {en_US, fr_FR, NZ_I18N} from "ng-zorro-antd/i18n";
import {NgOptimizedImage} from "@angular/common";
import {NzNoAnimationModule} from "ng-zorro-antd/core/no-animation";
import {NzNotificationModule} from "ng-zorro-antd/notification";
import { OrderUserComponent } from './user-module/components/order-user/order-user.component';
import { WelcomeComponent } from './welcome/welcome.component';

@NgModule({
  declarations: [
    AppComponent,
    LayoutUserComponent,
    HeaderUserComponent,
    FooterUserComponent,
    HomeUserComponent,
    ShopUserComponent,
    ShopDetailUserComponent,
    CartUserComponent,
    CheckoutUserComponent,
    ContactUserComponent,
    LoginComponent,
    RegisterComponent,
    OrderUserComponent,
    WelcomeComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzCheckboxModule,
    NzButtonModule,
    NzSelectModule,
    AdminModule,
    SellerModule,
    NzPaginationModule,
    NgOptimizedImage,
    NzNotificationModule
  ],
  providers: [{
    provide: NZ_I18N,
    useFactory: (localId: string) => {
      switch (localId) {
        case 'en':
          return en_US;
        case 'fr':
          return fr_FR;
        default:
          return en_US;
      }
    },
    deps: [LOCALE_ID]
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
