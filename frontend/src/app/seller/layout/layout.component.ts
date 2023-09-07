import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {UserService} from "../../services/user.service";

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {

  constructor(
    private router : Router,
    private userService : UserService
  ) { }

  ngOnInit(): void {
  }

  logout() {
    this.userService.logout();
    this.router.navigateByUrl("/login");
  }

}
