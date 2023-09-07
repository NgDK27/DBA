import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  login(username: string, password: string)  {
    return this.http.post("https://localhost/login", {
      username,
      password
    }, {
      responseType: "text",
      withCredentials: true,
    })
  }

  register(username: string, email: string, password: string, role: string) : Observable<string> {
    return this.http.post(`https://localhost/${role}s/register`, {
      username,
      password,
      email
    }, {
      responseType: "text",
      withCredentials: true
    })
  }

  getRole() {
    const role = sessionStorage.getItem("role_user");
    if (role) {
      return role;
    }
    return null;
  }

  setRole(role : string) {
    sessionStorage.setItem("role_user", role);
  }

  logout() {
    sessionStorage.removeItem("role_user");
  }
}
