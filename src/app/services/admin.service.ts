import { Injectable, inject, signal } from '@angular/core';
import { ApiService } from './api.service';
import { ToastService } from './toast.service';
import { AdminStats, AdminUser, WebsiteContent, ApiResponse } from '../models';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private api = inject(ApiService);
  private toast = inject(ToastService);

  readonly stats = signal<AdminStats | null>(null);
  readonly users = signal<AdminUser[]>([]);
  readonly content = signal<WebsiteContent | null>(null);
  readonly isLoading = signal<boolean>(false);

  async fetchStats(): Promise<void> {
    try {
      const res = await this.api.get<ApiResponse<{ stats: AdminStats }>>('/admin/stats');
      if (res.success && res.data?.stats) {
        this.stats.set(res.data.stats);
      }
    } catch (err: any) {
      console.error('Failed to fetch stats:', err);
    }
  }

  async fetchUsers(): Promise<void> {
    this.isLoading.set(true);
    try {
      const res = await this.api.get<ApiResponse<{ users: AdminUser[] }>>('/admin/users');
      if (res.success && res.data?.users) {
        this.users.set(res.data.users);
      }
    } catch (err: any) {
      const msg = err.error?.message || err.message || 'Failed to load user list';
      this.toast.error(msg);
    } finally {
      this.isLoading.set(false);
    }
  }

  async fetchContent(): Promise<void> {
    this.isLoading.set(true);
    try {
      const res = await this.api.get<ApiResponse<{ content: WebsiteContent }>>('/admin/content');
      if (res.success && res.data?.content) {
        this.content.set(res.data.content);
      }
    } catch (err: any) {
      console.error('Failed to load content:', err);
    } finally {
      this.isLoading.set(false);
    }
  }

  async updateContent(payload: Partial<WebsiteContent>): Promise<boolean> {
    try {
      const res = await this.api.put<ApiResponse<{ content: WebsiteContent }>>(
        '/admin/content',
        payload
      );
      if (res.success && res.data?.content) {
        this.content.set(res.data.content);
        this.toast.success('Website content and announcements saved!');
        return true;
      }
      return false;
    } catch (err: any) {
      const msg = err.error?.message || err.message || 'Failed to update website content';
      this.toast.error(msg);
      return false;
    }
  }
}
