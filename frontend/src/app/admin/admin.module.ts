import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { LayoutComponent } from './layout/layout.component';
import {NzLayoutModule} from "ng-zorro-antd/layout";
import {NzMenuModule} from "ng-zorro-antd/menu";
import { CategoriesComponent } from './categories/categories.component';
import { WarehousesComponent } from './warehouses/warehouses.component';
import {NzTableModule} from "ng-zorro-antd/table";
import {NzDividerModule} from "ng-zorro-antd/divider";
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzModalModule} from "ng-zorro-antd/modal";
import {NzFormModule} from "ng-zorro-antd/form";
import {ReactiveFormsModule} from "@angular/forms";
import {NzInputModule} from "ng-zorro-antd/input";
import {NzSelectModule} from "ng-zorro-antd/select";
import {NzIconModule} from "ng-zorro-antd/icon";
import {NzNotificationModule} from "ng-zorro-antd/notification";


@NgModule({
  declarations: [
    LayoutComponent,
    CategoriesComponent,
    WarehousesComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    NzLayoutModule,
    NzMenuModule,
    NzTableModule,
    NzDividerModule,
    NzButtonModule,
    NzModalModule,
    NzFormModule,
    ReactiveFormsModule,
    NzInputModule,
    NzSelectModule,
    NzIconModule,
    NzNotificationModule
  ]
})
export class AdminModule { }
