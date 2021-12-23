import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { SessionService } from './session.service';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AccountService {
  private readonly authenticationEndpoint = 'authentication/';
  private readonly shoppingEndPoint = 'shopping/';
  private readonly accountEndPoint = 'Account/';


  constructor(
    private http: HttpClient,
    private sessionService: SessionService
  ) { }

  register(model: any) {
    return this.http.post<any>(`${environment.apiUrl}${this.authenticationEndpoint}createCustomer`, model)
      .pipe(map(res => {
        if (res.token) {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          this.sessionService.setSessionObject('user', res);
          this.sessionService.userSession(res);
        }
        return res;
      }));
  }

  login(model: any) {
    return this.http.post<any>(`${environment.apiUrl}${this.authenticationEndpoint}signInCustomer`, model)
      .pipe(map(res => {
        if (res.token) {
          this.sessionService.setSessionObject('user', res);
          this.sessionService.userSession(res);
        }
        return res;
      }));
  }


  forgetPasswordEmail(model: any) {
    return this.http.post<any>(`${environment.apiUrl}${this.authenticationEndpoint}sendForgotPasswordEmail`, model);
  }

  resetPassword(model: any) {
    return this.http.post<any>(`${environment.apiUrl}${this.authenticationEndpoint}UpdateCustomer`, model);
  }

   emailVerify(model: any) {
    return this.http.post<any>(`${environment.apiUrl}${this.authenticationEndpoint}ValidateCustomer`, model);
  }

  getCustomer(partyId: number) {
    return this.http.get<any>(`${environment.apiUrl}${this.shoppingEndPoint}GetCustomer?partyId=${partyId}`);
  }

  updateCustomer(model: any) {
    return this.http.post<any>(`${environment.apiUrl}${this.shoppingEndPoint}UpdateCustomer`,model);
  }


  getLoyalityPoints() {
    return this.http.get<any>(`${environment.apiUrl}${this.accountEndPoint}Points`);
  }

  GetShipMethod() {
    return this.http.get<any>(`${environment.apiUrl}${this.accountEndPoint}GetShipMethod`);
  }

  GetCustomerOrders() {
    return this.http.get<any>(`${environment.apiUrl}${this.accountEndPoint}GetCustomerOrders_SQL`);
  }

  GetCustomerBilling() {
    return this.http.get<any>(`${environment.apiUrl}${this.accountEndPoint}GetCustomerBilling`);
  }

  SaveAddress(model:any) {
    return this.http.post<any>(`${environment.apiUrl}${this.accountEndPoint}SaveAddress`,model);
  }

  GetshippingAddress() {
    return this.http.get<any>(`${environment.apiUrl}${this.shoppingEndPoint}GetshippingAddress`);
  }

  DeleteCustomer(model:any) {
    return this.http.post<any>(`${environment.apiUrl}${this.shoppingEndPoint}DeleteCustomer`,model);
  }

  CancelledCustomerOrders(model:any) {
    return this.http.post<any>(`${environment.apiUrl}${this.accountEndPoint}CancelledCustomerOrders_SQL`,model);
  }

  SeachOrderList(model:any) {
    return this.http.get<any>(`${environment.apiUrl}${this.accountEndPoint}SeachOrderList`);
  }

  getCustomerAutoOrders(){
    return this.http.get<any>(`${environment.apiUrl}${this.accountEndPoint}GetCustomerAutoOrders`);
  }
}




//For Declined : https://localhost:44336/api/Account/DeclinedCustomerOrders_SQL
//ShipcustomerOrder: https://localhost:44336/api/Account/ShippedCustomerOrders_SQL
//For Preview Invoice : https://localhost:44336/api/Account/GetOrderInvoice

















