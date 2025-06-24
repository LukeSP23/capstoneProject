import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private apiUrl = 'http://localhost:3000';

    private isLoggedInSubject = new BehaviorSubject<boolean>(this.isLoggedIn());

    public isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor(private http: HttpClient) { }

  // Login: send credentials, store JWT on success
  login(email: string, password: string): Observable<any> {
   return (
      this.http
        .post<{ message: string; token: string }>(`${this.apiUrl}/login`, {
          email,
          password,
        })
        // pipe is used to handle the response and update the login state
        .pipe(
          // tap operator allows us to perform side effects, like updating the login state
          tap((response: { message: string; token: string }) => {
            if (response && response.token) {
              // Store the JWT token in localStorage
              localStorage.setItem('jwt_token', response.token);
              // Update the login state
              this.isLoggedInSubject.next(true);
            }
          })
        )
    );
  }

   // Register: send user data, store JWT on success
  register(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, { email, password });
  }

  // Logout: remove JWT from localStorage
  logout(): void {
    localStorage.removeItem('jwt_token');
  }

  // Get JWT token from localStorage
  getToken(): string | null {
    return localStorage.getItem('jwt_token');
  }

  // Check if JWT token exists
  hasToken(): boolean {
    return !!this.getToken();
  }

  // Check if user is logged in (token exists and is not expired)
  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;
    const payload = this.decodePayload(token);
    if (!payload) return false;
    return payload.exp * 1000 > Date.now();
  }

  // Helper to decode JWT payload
  private decodePayload(token: string): any | null {
    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch {
      return null;
    }
  }
}
