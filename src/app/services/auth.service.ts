import { Injectable, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from './api.service';
import { ToastService } from './toast.service';
import { AdminUser, AuthResponse, ApiResponse } from '../models';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private api = inject(ApiService);
  private router = inject(Router);
  private toast = inject(ToastService);

  readonly currentUser = signal<AdminUser | null>(null);
  readonly token = signal<string | null>(null);
  readonly isLoading = signal<boolean>(true);

  readonly isAuthenticated = computed(() => !!this.currentUser());
  readonly isAdmin = computed(() => this.currentUser()?.role === 'admin');

  constructor() {
    this.restoreSession();
  }

  async restoreSession(): Promise<void> {
    try {
      const savedToken = localStorage.getItem('foodie_admin_token');
      const savedUser = localStorage.getItem('foodie_admin_user');

      if (savedToken && savedUser) {
        this.token.set(savedToken);
        this.currentUser.set(JSON.parse(savedUser));

        // Background check token validity
        try {
          const res = await this.api.get<ApiResponse<{ user: AdminUser }>>('/auth/me');
          if (res.success && res.data?.user) {
            this.currentUser.set(res.data.user);
            localStorage.setItem('foodie_admin_user', JSON.stringify(res.data.user));
          }
        } catch {
          // Token expired or invalid
          this.logout(false);
        }
      }
    } catch {
      this.logout(false);
    } finally {
      this.isLoading.set(false);
    }
  }

  async login(email: string, password: string): Promise<boolean> {
    try {
      const res = await this.api.post<AuthResponse>('/auth/login', { email, password });

      if (res.success && res.data) {
        const { user, token } = res.data;

        if (user.role !== 'admin') {
          this.toast.error('Access denied. Administrator privileges required.');
          return false;
        }

        this.token.set(token);
        this.currentUser.set(user);
        localStorage.setItem('foodie_admin_token', token);
        localStorage.setItem('foodie_admin_user', JSON.stringify(user));

        this.toast.success(`Welcome back, ${user.name}!`);
        await this.router.navigate(['/dashboard']);
        return true;
      }
      return false;
    } catch (err: any) {
      const message = err.error?.message || err.message || 'Login failed. Please check credentials.';
      this.toast.error(message);
      return false;
    }
  }

  async logout(notify = true): Promise<void> {
    try {
      await this.api.post('/auth/logout', {});
    } catch {
      // Ignore network errors on logout
    }

    localStorage.removeItem('foodie_admin_token');
    localStorage.removeItem('foodie_admin_user');
    this.token.set(null);
    this.currentUser.set(null);

    if (notify) {
      this.toast.info('Logged out successfully');
    }
    await this.router.navigate(['/login']);
  }
}
