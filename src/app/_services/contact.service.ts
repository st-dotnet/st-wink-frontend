import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private api ='https://mailthis.to/alias';
  private readonly homeEndpoint = 'home/';

  constructor(private http: HttpClient) {
  }

  contactUser(model: any) {
    return this.http.post<any>(`${environment.apiUrl}/save`, model);
}

createContact(model: any) {
  return this.http.post<any>(`${environment.apiUrl}${this.homeEndpoint}about`, model);
}
}




