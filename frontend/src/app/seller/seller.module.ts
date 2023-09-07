import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SellerRoutingModule } from './seller-routing.module';
import { LayoutComponent } from './layout/layout.component';
import {NzLayoutModule} from "ng-zorro-antd/layout";
import {NzMenuModule} from "ng-zorro-antd/menu";
import {NzTransitionPatchModule} from "ng-zorro-antd/core/transition-patch/transition-patch.module";
import { ProductManagementComponent } from './product-management/product-management.component';
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzDividerModule} from "ng-zorro-antd/divider";
import {NzModalModule} from "ng-zorro-antd/modal";
import {NzTableModule} from "ng-zorro-antd/table";
import {NzWaveModule} from "ng-zorro-antd/core/wave";
import {NzFormModule} from "ng-zorro-antd/form";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NzInputModule} from "ng-zorro-antd/input";
import {NzNotificationModule} from "ng-zorro-antd/notification";


@NgModule({
  declarations: [
    LayoutComponent,
    ProductManagementComponent
  ],
  imports: [
    CommonModule,
    SellerRoutingModule,
    NzLayoutModule,
    NzMenuModule,
    NzButtonModule,
    NzDividerModule,
    NzModalModule,
    NzTableModule,
    NzFormModule,
    ReactiveFormsModule,
    NzInputModule,
    NzNotificationModule,
    FormsModule
  ]
})
export class SellerModule { }
