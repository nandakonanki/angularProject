import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

  createUser(userData: any): Observable<any> {
    console.log('Calling API to create user:', userData);
    return this.http.post(`${this.baseUrl}/api/users/create`, userData);
  }
} 