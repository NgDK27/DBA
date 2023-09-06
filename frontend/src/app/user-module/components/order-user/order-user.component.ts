import { Component, OnInit } from '@angular/core';
import {Order} from "../../../models/order";
import {OrderDetail} from "../../../models/order-detail";
import {CustomerService} from "../../../services/customer.service";
import {NzNotificationService} from "ng-zorro-antd/notification";

@Component({
  selector: 'app-order-user',
  templateUrl: './order-user.component.html',
  styleUrls: ['./order-user.component.css']
})
export class OrderUserComponent implements OnInit {
  listOfOrders : Order[] = [];
  orderSelected : Order = {};
  listOfOrderDetail : OrderDetail[] = [];


  constructor(
    private notification : NzNotificationService,
    private customerService : CustomerService
  ) { }

  loadOrders() {
    this.customerService.getAllOrders().subscribe({
      next: (data) => {
        this.listOfOrders = data;
        if (this.listOfOrders.length > 0) {
          this.orderSelected = this.listOfOrders[0];
          this.orderSelected.order_id && this.loadOrderDetails(this.orderSelected.order_id);
        }
      }
    })
  }

  loadOrderDetails(orderId :number) {
    this.customerService.getOrderDetail(orderId).subscribe({
      next: (data) => {
        this.listOfOrderDetail = data;
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  onRowClick(order : Order) {
    this.orderSelected = order;
    order.order_id && this.loadOrderDetails(order.order_id);
  }

  rejectOrder() {
    this.orderSelected.order_id
    && this.customerService.updateStatusOrder(this.orderSelected.order_id, "Reject").subscribe({
      next: (data) => {
        this.notification.create("success", "Order", "Reject order successfully");
        this.loadOrders();
      }
    })
  }

  acceptOrder() {
    this.orderSelected.order_id
    && this.customerService.updateStatusOrder(this.orderSelected.order_id, "Accept").subscribe({
      next: (data) => {
        this.notification.create("success", "Order", "Accept order successfully");
        this.loadOrders();
      }
    })
  }

  ngOnInit(): void {
    this.loadOrders();
  }
}
