import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LayoutComponent} from "./layout/layout.component";
import {ProductManagementComponent} from "./product-management/product-management.component";

const routes: Routes = [{
  path: '',
  component: LayoutComponent,
  children: [
    {
      path: 'product-management',
      component: ProductManagementComponent
    }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SellerRoutingModule { }
