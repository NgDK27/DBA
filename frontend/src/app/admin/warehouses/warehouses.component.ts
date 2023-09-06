import { Component, OnInit } from '@angular/core';
import {AdminService} from "../../services/admin.service";
import {Warehouse} from "../../models/warehouse.model";
import {UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {WarehouseDetail} from "../../models/warehouse-detail.model";

@Component({
  selector: 'app-warehouses',
  templateUrl: './warehouses.component.html',
  styleUrls: ['./warehouses.component.css']
})
export class WarehousesComponent implements OnInit {
  validateForm!: UntypedFormGroup;
  moveProductForm !: UntypedFormGroup;
  listOfData: Warehouse[] = [];
  warehouseSelected !: Warehouse;
  warehouseDetail !: WarehouseDetail;
  addNewVisible = false;
  detailVisible = false;
  moveVisible = false;
  isUpdating = false;
  constructor(
    private fb: UntypedFormBuilder,
    private notification : NzNotificationService,
    private adminService: AdminService,
  ) { }

  ngOnInit(): void {
    this.loadAllWarehouses();
    this.validateForm = this.fb.group({
      name: [null, [Validators.required]],
      province: [null, [Validators.required]],
      city: [null, [Validators.required]],
      district: [null, [Validators.required]],
      street: [null, Validators.required],
      number: [null, [Validators.required]],
      area: [null, [Validators.required]]
    })
    this.moveProductForm = this.fb.group({
      from: [null, [Validators.required]],
      to: [null, Validators.required],
      productId: [null, [Validators.required]],
      quantity: [null, [Validators.required]]
    })
  }

  addNew() {
    this.addNewVisible = true;
    this.isUpdating = false;
    this.validateForm = this.fb.group({
      name: [null, [Validators.required]],
      province: [null, [Validators.required]],
      city: [null, [Validators.required]],
      district: [null, [Validators.required]],
      street: [null, Validators.required],
      number: [null, [Validators.required]],
      area: [null, [Validators.required]]
    })
  }

  handleCancel() {
    this.addNewVisible = false;
  }

  closeDetail() {
    this.detailVisible = false;
  }

  openDetail(warehouse : Warehouse) {
    this.detailVisible = true;
    this.warehouseSelected = warehouse;
    this.loadWarehouseDetail();
  }

  openMove(warehouse : Warehouse) {
    this.moveVisible = true;
    this.warehouseSelected = warehouse;
    this.moveProductForm.patchValue({
      from: this.warehouseSelected.warehouse_id
    })
  }

  openUpdate(warehouse : Warehouse) {
    this.isUpdating = true;
    this.addNewVisible = true;
    this.warehouseSelected = warehouse;
    this.validateForm = this.fb.group({
      name: [null, [Validators.required]],
      province: [null, [Validators.required]],
      city: [null, [Validators.required]],
      district: [null, [Validators.required]],
      street: [null, Validators.required],
      number: [null, [Validators.required]]
    })
    this.validateForm.patchValue({
      name: this.warehouseSelected.name
    })
  }

  submitMove() {
    if (this.moveProductForm.valid) {
      console.log(this.moveProductForm.value);
      this.adminService.moveProduct(
        this.moveProductForm.value["from"],
        this.moveProductForm.value["to"],
        this.moveProductForm.value["productId"],
        this.moveProductForm.value["quantity"]
      ).subscribe({
        next: (data) => {
          console.log(data);
          this.notification.create("success", "Product", "Products moved between warehouses.");
          this.moveVisible = false;
          this.loadAllWarehouses();
        },
        error: err => {
          console.log(err)
        }
      })
    }else {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({onlySelf: true});
        }
      });
    }
  }

  closeMove() {
    this.moveVisible = false;
  }

  handleOk() {
    if (this.validateForm.valid) {
      console.log('submit', this.validateForm.value);
      if (!this.isUpdating) {
        this.adminService.addNewWarehouse(this.validateForm.value).subscribe({
          next: (data) => {
            console.log(data);
            this.notification.create("success", "Notification", "Add new warehouse successfully");
            this.addNewVisible = false;
          },
          error: (err) => {
            console.log(err);
          }
        })
      } else {
        if (this.warehouseSelected.warehouse_id) this.adminService.updateWarehouse(this.validateForm.value, this.warehouseSelected.warehouse_id).subscribe({
          next: (data) => {
            console.log(data);
            this.notification.create("success", "Notification", "Update warehouse successfully");
            this.addNewVisible = false;
          },
          error: err => {
            console.log(err)
          }
        })
      }
    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  loadWarehouseDetail() {
    if (this.warehouseSelected.warehouse_id) {
      this.adminService.getWarehouse(this.warehouseSelected.warehouse_id).subscribe({
        next: (data) => {
          this.warehouseDetail = data;
        },
        error: err => {
          console.log(err);
        }
      })
    }
  }

  loadAllWarehouses() {
    this.adminService.getAllWarehouses().subscribe({
      next: (data) => {
        this.listOfData = data;
      },
      error: (error) => {
        console.log(error)
      }
    })
  }

  deleteWarehouse(warehouse: Warehouse) {
    this.adminService.deleteWarehouse(warehouse).subscribe({
      next: (data) => {
        console.log(data);
        this.notification.create("success", "Notification", "Delete warehouse successfully");
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  getAvailableArea() {
    if (this.warehouseDetail.result2 && this.warehouseDetail.result2[0]) return this.warehouseDetail.result2[0].available_area;
    return ''
  }

  getWare() {
    if (this.warehouseDetail.result1) {
      return this.warehouseDetail.result1;
    }
    return [];
  }
}
