import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
 private apiUrl = 'http://localhost:8080/api/auth'; // ✅ Ici

  constructor(private http: HttpClient) {}

  login(email: string, password: string, rememberMe: boolean): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password, rememberMe }).pipe(
      tap((response: any) => {
        if (response?.token) {
          localStorage.setItem('token', response.token);
          if (rememberMe) {
            localStorage.setItem('rememberMe', 'true');
          }
        }
      }),
      catchError(error => {
        throw error;
      })
    );
  }


  signup(name: string, email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/signup`, { name, email, password }).pipe(
      catchError(error => {
        throw error;
      })
    );
  }
}