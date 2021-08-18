import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import {enrollmentpacksModel} from 'src/app/_models/enrollmentpacks';

@Injectable({
  providedIn: 'root'
})
export class EnrollmentService {

  private readonly enrollmentEndpoint = 'enrollment/';

  constructor(private http:HttpClient) { }

  GetAllPacks()
  {
    return this.http.get<enrollmentpacksModel[]>(`${environment.apiUrl}${this.enrollmentEndpoint}GetPacks`);
  }

}
