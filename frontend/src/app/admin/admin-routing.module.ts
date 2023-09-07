import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LayoutComponent} from "./layout/layout.component";
import {CategoriesComponent} from "./categories/categories.component";
import {WarehousesComponent} from "./warehouses/warehouses.component";

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
      path: 'categories',
      component: CategoriesComponent
      },
      {
        path: 'warehouses',
        component: WarehousesComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
