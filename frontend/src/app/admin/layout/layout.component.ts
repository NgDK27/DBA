import { Component, OnInit } from '@angular/core';
import {UserService} from "../../services/user.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {

  constructor(
    private userService : UserService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  logout() {
    this.userService.logout();
    this.router.navigateByUrl("/login");
  }

}
