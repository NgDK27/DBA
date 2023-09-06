import { Component, OnInit } from '@angular/core';
import {Category} from "../../models/category.model";
import {AdminService} from "../../services/admin.service";
import {UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, ValidationErrors, Validators} from "@angular/forms";
import {Observable, Observer} from "rxjs";
import {NzNotificationService} from "ng-zorro-antd/notification";

interface Person {
  key: string;
  name: string;
  age: number;
  address: string;
}

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {

  listOfData: Category[] = [];
  categorySelected !: Category;

  validateForm!: UntypedFormGroup;
  listOfControl: Array<{ id: number; key: string; value: string  }> = [];

  addNewVisible = false;
  isUpdating = false;

  constructor(
    private fb: UntypedFormBuilder,
    private adminService: AdminService,
    private notification: NzNotificationService
  ) { }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      name: ['', [Validators.required]],
      parent: [null, []]
    });
    this.addField();
    this.loadAllCategories();
  }

  loadAllCategories() {
    this.adminService.getAllCategories().subscribe({
      next: (data) => {
        this.listOfData = data;
      },
      error: (error) => {
        console.log(error)
      }
    })
  }

  removeField(i: { id: number; key: string; value: string }, e: MouseEvent): void {
    e.preventDefault();
    if (this.listOfControl.length > 1) {
      const index = this.listOfControl.indexOf(i);
      this.listOfControl.splice(index, 1);
      console.log(this.listOfControl);
      this.validateForm.removeControl(i.key);
      this.validateForm.removeControl(i.value);
    }

  }

  addField(e?: MouseEvent): void {
    if (e) {
      e.preventDefault();
    }
    const id = this.listOfControl.length > 0 ? this.listOfControl[this.listOfControl.length - 1].id + 1 : 0;

    const control = {
      id,
      key: `attribute_${id}_key`,
      value: `attribute_${id}_value`
    };
    const index = this.listOfControl.push(control);
    console.log(this.listOfControl[this.listOfControl.length - 1]);
    this.validateForm.addControl(
      this.listOfControl[index - 1].key,
      new UntypedFormControl(null, Validators.required)
    );
    this.validateForm.addControl(
      this.listOfControl[index - 1].value,
      new UntypedFormControl(null, Validators.required)
    )
  }

  addNew() {
    this.addNewVisible = true;
    this.isUpdating = false;
  }

  handleCancel() {
    this.addNewVisible = false;
  }

  handleUpdateClick(category: Category) {
    this.addNewVisible = true;
    this.isUpdating = true;
    this.categorySelected = category;
    this.validateForm.patchValue({
      name: this.categorySelected.name
    })
    this.listOfControl = [];
    Object.keys(this.validateForm.value).forEach((item)=> {
      if (item.startsWith("attribute_")) {
        this.validateForm.removeControl(item);
      }
    })
    const patchValue : Record<string, string> = {}
    this.categorySelected.attributes?.forEach((item, index) => {
      this.addField();
      patchValue[`attribute_${index}_key`] = item.key;
      patchValue[`attribute_${index}_value`] = item.value;
    })
    this.validateForm.patchValue(patchValue);
  }

  handleOk() {
    if (this.validateForm.valid) {
      console.log('submit', this.validateForm.value);
      const attributes : {key: string, value: string}[] = [];
      Object.keys(this.validateForm.value).forEach((item)=> {
        if (item.startsWith("attribute_") && item.endsWith("_key")) {
          const prefix = item.replace("_key", "");
          attributes.push({
            key: this.validateForm.value[item],
            value: this.validateForm.value[prefix + "_value"]
          })
        }
      })
      if (!this.isUpdating) {
        this.adminService.createNewCategory(
          this.validateForm.value['name'],
          this.validateForm.value['parent'],
          attributes
        ).subscribe({
          next: (data) => {
            this.loadAllCategories();
            this.addNewVisible = false;
          },
          error: (err) => {
            console.log(err)
          }
        })
      } else {
        if (this.categorySelected.categoryId) {
          this.adminService.updateCategory(
            this.categorySelected.categoryId,
            this.validateForm.value['name'],
            attributes
            ).subscribe({
            next: (data) => {
              console.log(data);
              this.loadAllCategories();
              this.addNewVisible = false;
            },
            error: err => {
              console.log(err);
            }
          })
        }
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

  deleteCategory(category : Category) {
    this.adminService.deleteCategory(category).subscribe({
      next: (data) => {
        console.log(data);
        this.notification.create("success", "Notification", "Delete successfully");
        this.loadAllCategories();
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  mapContent(data : Category) {
    return data.attributes?.reduce((acc, attribute, index) => {
      return acc + attribute.key + " : " + attribute.value + ";\n";
    }, "")
  }
}
