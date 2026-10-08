import { Injectable, inject, signal } from '@angular/core';
import { ApiService } from './api.service';
import { ToastService } from './toast.service';
import { Order, OrderStatus, ApiResponse } from '../models';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private api = inject(ApiService);
  private toast = inject(ToastService);

  readonly orders = signal<Order[]>([]);
  readonly isLoading = signal<boolean>(false);

  async fetchOrders(): Promise<void> {
    this.isLoading.set(true);
    try {
      const res = await this.api.get<ApiResponse<{ orders: Order[] }>>('/admin/orders');
      if (res.success && res.data?.orders) {
        this.orders.set(res.data.orders);
      }
    } catch (err: any) {
      const msg = err.error?.message || err.message || 'Failed to load orders';
      this.toast.error(msg);
    } finally {
      this.isLoading.set(false);
    }
  }

  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<boolean> {
    try {
      const res = await this.api.patch<ApiResponse<{ order: Order }>>(
        `/admin/orders/${orderId}/status`,
        { status }
      );

      if (res.success && res.data?.order) {
        // Optimistic / reactive update in list
        this.orders.update((list) =>
          list.map((o) => (o._id === orderId ? { ...o, status } : o))
        );
        this.toast.success(`Order #${orderId.slice(-6)} updated to "${status}"`);
        return true;
      }
      return false;
    } catch (err: any) {
      const msg = err.error?.message || err.message || 'Failed to update order status';
      this.toast.error(msg);
      return false;
    }
  }
}
