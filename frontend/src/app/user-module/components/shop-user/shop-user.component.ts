import { Component, OnInit } from '@angular/core';
import {CustomerService} from "../../../services/customer.service";
import {Product} from "../../../models/product.model";
import {Router} from "@angular/router";
import {Category} from "../../../models/category.model";

@Component({
  selector: 'app-shop-user',
  templateUrl: './shop-user.component.html',
  styleUrls: ['./shop-user.component.css']
})
export class ShopUserComponent implements OnInit {

  listOfData: Product[] = [];
  productPerPage: number = 9;
  displayData: Product[] = [];
  pageIndex: number = 1;

  listCategories: Category[] = [];

  filterValue: {
    maxPrice?: number,
    minPrice?: number,
    sortField?: string,
    sortOrder: "DESC" | "ASC",
    search ?: string,
    category ?: number
  } = {
    sortOrder: "DESC",
  }

  constructor(
    private customerService: CustomerService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.customerService.getAllProducts().subscribe({
      next: (data) => {
        this.listOfData = data;
        this.displayData = this.listOfData.slice(0, this.productPerPage);
      },
      error: (err) => {
        console.log("error", err);
      }
    })
    this.customerService.getCategories().subscribe({
      next: (data) => {
        console.log(data);
        this.listCategories = data;
      },
      error: err => {
        console.log(err);
      }
    })
  }

  onProductClick(product : Product) {
    this.router.navigateByUrl(`user/shopdetail/${product.product_id}`)
  }

  changePageIndex(pageIndex : number) {
    const start = (pageIndex - 1) * this.productPerPage;
    const end = Math.min(pageIndex * this.productPerPage, this.listOfData.length)
    console.log(start, end);
    this.displayData = this.listOfData.slice(start, end);
    this.pageIndex = pageIndex;
  }

  setCategory(categoryId ?: number) {
    this.filterValue.category = categoryId;
    this.changeFilter();
  }

  setMinMaxPrice(minPrice: number | undefined, maxPrice: number | undefined) {
    this.filterValue.minPrice = minPrice;
    this.filterValue.maxPrice = maxPrice;
    this.changeFilter();
  }

  setSortField(field : string | undefined, order : "DESC" | "ASC") {
    this.filterValue.sortField = field;
    this.filterValue.sortOrder = order;
    this.changeFilter();
  }

  changeFilter() {
    console.log(this.filterValue);
    this.customerService.getProductWithFilter(
      this.filterValue.minPrice,
      this.filterValue.maxPrice,
      this.filterValue.sortField,
      this.filterValue.sortOrder,
      this.filterValue.search,
      this.filterValue.category
    ).subscribe({
      next: (data) => {
        this.listOfData = data;
        this.displayData = this.listOfData.slice(0, this.productPerPage);
        this.pageIndex = 1;
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

}
