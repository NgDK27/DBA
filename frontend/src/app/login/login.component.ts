import { Component, OnInit } from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {UserService} from "../services/user.service";
import {error} from "@ant-design/icons-angular";
import {Route, Router} from "@angular/router";
import {NzNotificationService} from "ng-zorro-antd/notification";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  validateForm!: UntypedFormGroup;

  submitForm(): void {
    if (this.validateForm.valid) {
      this.userService.login(this.validateForm.value.username, this.validateForm.value.password).subscribe({
        next: (data) => {
          const role = data.split(" ");
          if (role[1] === "warehouse_admin") {
            this.route.navigateByUrl("/admin")
            this.userService.setRole(role[1]);
          } else if (role[1] === 'seller') {
            this.route.navigateByUrl("seller")
            this.userService.setRole(role[1]);
          } else {
            this.route.navigateByUrl("user/shop");
            this.userService.setRole(role[1]);
          }
        },
        error: (error) => {
          console.log("Error", error)
          this.notification.create("error", "Login Failed", "Check your username or password")
        },
        complete: () => {

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

  constructor(
    private fb: UntypedFormBuilder,
    private route : Router,
    private userService : UserService,
    private notification : NzNotificationService
  ) {}

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      username: [null, [Validators.required]],
      password: [null, [Validators.required]],
    });
  }

}
