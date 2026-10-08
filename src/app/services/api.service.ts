import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:5000/api';

  private getHeaders(): HttpHeaders {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    const token = localStorage.getItem('foodie_admin_token');
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  async get<T>(endpoint: string, queryParams?: Record<string, any>): Promise<T> {
    let params = new HttpParams();
    if (queryParams) {
      Object.entries(queryParams).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== '') {
          params = params.set(key, String(val));
        }
      });
    }

    return firstValueFrom(
      this.http.get<T>(`${this.baseUrl}${endpoint}`, {
        headers: this.getHeaders(),
        params,
        withCredentials: true,
      })
    );
  }

  async post<T>(endpoint: string, body: any): Promise<T> {
    return firstValueFrom(
      this.http.post<T>(`${this.baseUrl}${endpoint}`, body, {
        headers: this.getHeaders(),
        withCredentials: true,
      })
    );
  }

  async put<T>(endpoint: string, body: any): Promise<T> {
    return firstValueFrom(
      this.http.put<T>(`${this.baseUrl}${endpoint}`, body, {
        headers: this.getHeaders(),
        withCredentials: true,
      })
    );
  }

  async patch<T>(endpoint: string, body: any): Promise<T> {
    return firstValueFrom(
      this.http.patch<T>(`${this.baseUrl}${endpoint}`, body, {
        headers: this.getHeaders(),
        withCredentials: true,
      })
    );
  }

  async delete<T>(endpoint: string): Promise<T> {
    return firstValueFrom(
      this.http.delete<T>(`${this.baseUrl}${endpoint}`, {
        headers: this.getHeaders(),
        withCredentials: true,
      })
    );
  }
}
