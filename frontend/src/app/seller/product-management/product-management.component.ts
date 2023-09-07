import { Component, OnInit } from '@angular/core';
import {Warehouse} from "../../models/warehouse.model";
import {SellerService} from "../../services/seller.service";
import {Product} from "../../models/product.model";
import {UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {NzNotificationService} from "ng-zorro-antd/notification";

@Component({
  selector: 'app-product-management',
  templateUrl: './product-management.component.html',
  styleUrls: ['./product-management.component.css']
})
export class ProductManagementComponent implements OnInit {

  listOfData: Product[] = [];
  addNewVisible = false;

  productSelected!: Product;
  importQuantityVisible = false;
  quantityInventory = 0;

  productDetail = {}
  isDetail = false;

  isUpdating = false;

  validateForm!: UntypedFormGroup;
  constructor(
    private fb : UntypedFormBuilder,
    private notification : NzNotificationService,
    private sellerService : SellerService
  ) { }

  getAllProducts() {
    this.sellerService.getAllProducts().subscribe({
      next: (data) => {
        this.listOfData = data;
      },
      error: (error) => {
        console.log(error)
      }
    })
  }

  getProductDetail() {
    if (this.productSelected.product_id) {

      this.sellerService.getProduct(this.productSelected.product_id).subscribe({
        next: (data) => {
          this.productDetail = data;
        },
        error: err => {
          console.log(err);
        }
      })
    }
  }

  ngOnInit(): void {
    this.getAllProducts();
    this.validateForm = this.fb.group({
      title: [null, [Validators.required]],
      description: [null, [Validators.required]],
      price: [null, [Validators.required]],
      length: [null, [Validators.required]],
      width: [null, [Validators.required]],
      height: [null, Validators.required],
      category: [null, Validators.required],
      image: [null, [Validators.required]]
    })
  }

  addNew() {
    this.addNewVisible = true;
    this.isUpdating = false;
  }

  handleCancel() {
    this.addNewVisible = false;
  }

  handleDetailClick(product : Product) {
    this.productSelected = product;
    this.isDetail = true;
    this.getProductDetail();
  }

  closeDetail() {
    this.isDetail = false;
  }

  handleImportClick(product : Product) {
    this.productSelected = product;
    this.importQuantityVisible = true;
    this.quantityInventory = 0;
  }
  handleUpdateClick(product : Product) {
    this.productSelected = product;
    this.isUpdating = true;
  }

  closeImport() {
    this.importQuantityVisible = false;
  }

  closeUpdating() {
    this.isUpdating = false;
  }

  updateProduct() {
    this.sellerService.updateProduct(this.productSelected).subscribe({
      next: (data) => {
        console.log(data);
        this.notification.create("success", "Product", "Update successfully");
        this.isUpdating = false;
      },
      error: err => {
        console.log(err);
        this.notification.create("error", "Product", "Update failed");
      }
    })
  }

  deleteProduct(productId : number | undefined) {
    if (productId) {
      this.sellerService.deleteProduct(productId).subscribe({
        next: (data) => {
          console.log(data);
          this.notification.create("success", "Product", "Delete successfully");
        },
        error: err => {
          this.notification.create("error", "Product", "Delete failed");
        }
      })
    }
  }
  importProduct() {
    if (this.productSelected.product_id && this.quantityInventory > 0) {
      this.sellerService.importProduct(this.productSelected.product_id, this.quantityInventory).subscribe({
        next: (data) => {
          console.log(data);
          this.notification.create("success", "Send In Bound", "Successfully");
          this.closeImport();
          this.getAllProducts();
        },
        error: (err) => {
          console.log(err);
          this.notification.create("error", "Send In Bound", "Failed");
        }
      })
    }
  }

  onImagePicked(event: Event) {
    if (event.target) {
      const file = (event.target as any).files[0]; // Here we use only the first file (single file)
      this.validateForm.patchValue({ image: file});
    }
  }

  handleOk() {
    if (this.validateForm.valid) {
      const product = {
        ...this.validateForm.value,
        image: this.validateForm.get("image")?.value
      }
        this.sellerService.addNewProduct(product).subscribe({
          next: (data) => {
            console.log(data);
            this.notification.create("success", "Product", "Create new product successfully");
            this.getAllProducts();
            this.addNewVisible = false;
          },
          error: (err) => {
            console.log((err));
          }
        })
    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

}
