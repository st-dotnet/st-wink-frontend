import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import {enrollmentpacksModel} from 'src/app/_models/enrollmentpacks';

@Injectable({
  providedIn: 'root'
})
export class EnrollmentService {

  private readonly enrollmentEndpoint = 'enrollment/';
  private readonly shoppingEndpoint = 'shopping/';


  constructor(private http:HttpClient) { }

  GetAllPacks()
  {
    return this.http.get<enrollmentpacksModel[]>(`${environment.apiUrl}${this.enrollmentEndpoint}GetPacks`);
  }
  verifyAddress(address:any)
  {
    return this.http.post<any>(`${environment.apiUrl}${this.shoppingEndpoint}checkout/shipping`,address);
  }

  submitcheckout(transectionalmodel:any)
  {
    return this.http.post<any>(`${environment.apiUrl}${this.enrollmentEndpoint}SubmitCheckout`,transectionalmodel);
  }
}
