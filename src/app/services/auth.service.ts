import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from "../interfaces/user.type";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _authenticatedUser: User = {
    active: true,
    lastName: "Tejeda",
    secondLastName: "Gutierrez",
    createDate: new Date(),
    id: 1,
    secondName: "Josué",
    firstName: "Manlio",
    user: 'manliot',
    password: '1234'
  };

  constructor(private http: HttpClient) {
  }

  public getNames(names: { firstName?: boolean, secondName?: boolean, lastName?: boolean, secondLastName?: boolean, password?: string }) {
    // tslint:disable-next-line:prefer-const
    let output = [];
    if (names.firstName) {
      output.push(AuthService.validateName(this._authenticatedUser.firstName));
    }
    if (names.secondName) {
      output.push(AuthService.validateName(this._authenticatedUser.secondName));
    }
    if (names.lastName) {
      output.push(AuthService.validateName(this._authenticatedUser.lastName));
    }
    if (names.secondLastName) {
      output.push(AuthService.validateName(this._authenticatedUser.secondLastName));
    }
    if (names.password) {
      output.push(names.password);
    }
    return output.join(" ");
  }

  public AuthUser(credentials: { user?: string, password?: string }) {
    if (credentials.user === this._authenticatedUser.user && credentials.password === this._authenticatedUser.password) {
      return { message: 'Valid Credentials', state: 'success' }
    } else {
      return { message: 'Not Valid Credentials', state: 'error' }

    }
  }

  private static validateName(name: string) {
    if (!name || name === "null" || name === "undefined") {
      return "";
    }
    return name;
  }
}
