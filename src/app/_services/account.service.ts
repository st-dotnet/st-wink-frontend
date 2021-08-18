import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { SessionService } from './session.service';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AccountService {
  private readonly authenticationEndpoint = 'authentication/';

  constructor(
    private http: HttpClient,
    private sessionService: SessionService
  ) { }

  register(model: any) {
    debugger
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
    debugger
    return this.http.post<any>(`${environment.apiUrl}${this.authenticationEndpoint}signInCustomer`, model)
      .pipe(map(res => {
        if (res.token) {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          this.sessionService.setSessionObject('user', res);
          this.sessionService.userSession(res);
        }
        return res;
      }));
  }
  
  forgetPasswordEmail(model: any) {
    debugger
    return this.http.post<any>(`${environment.apiUrl}${this.authenticationEndpoint}sendForgotPasswordEmail`, model);
  }

  resetPassword(model: any) {
    debugger
    return this.http.post<any>(`${environment.apiUrl}${this.authenticationEndpoint}UpdateCustomer`, model);
  }

 emailVerify(model: any) {
   debugger
    return this.http.post<any>(`${environment.apiUrl}${this.authenticationEndpoint}ValidateCustomer`, model);
  }
}
