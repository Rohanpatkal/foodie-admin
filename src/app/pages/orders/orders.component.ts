import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../services/order.service';
import { Order, OrderStatus } from '../../models';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="orders-page">
      <div class="page-header">
        <div>
          <h1 class="page-title">Live Orders Management</h1>
          <p class="page-subtitle">Inspect orders, track fulfillment states, and dispatch deliveries</p>
        </div>
        <button class="btn-primary" (click)="orderService.fetchOrders()">
          <span>🔄</span> Refresh Orders
        </button>
      </div>

      <!-- Filters & Search -->
      <div class="glass-card controls-card">
        <div class="search-box">
          <span class="search-icon">🔍</span>
          <input
            type="text"
            class="form-input search-input"
            [(ngModel)]="searchTerm"
            placeholder="Search by customer name, email, order ID, or delivery address..."
          />
        </div>

        <div class="status-tabs">
          <button
            *ngFor="let s of statuses"
            class="tab-btn"
            [class.active]="selectedStatus() === s"
            (click)="selectedStatus.set(s)"
          >
            <span>{{ s }}</span>
            <span class="tab-count">{{ getCountForStatus(s) }}</span>
          </button>
        </div>
      </div>

      <!-- Orders List -->
      <div class="orders-list">
        <div
          *ngFor="let order of filteredOrders()"
          class="glass-card order-card"
        >
          <!-- Card Header -->
          <div class="order-card-header">
            <div class="header-left">
              <span class="order-id">#{{ order._id.toUpperCase() }}</span>
              <span class="order-date">{{ order.createdAt | date : 'medium' }}</span>
            </div>

            <div class="header-right">
              <span class="badge badge-{{ order.status.replace(' ', '-') }}">
                {{ order.status }}
              </span>

              <select
                class="form-select status-select"
                [value]="order.status"
                (change)="onStatusChange(order._id, $event)"
              >
                <option *ngFor="let s of updatableStatuses" [value]="s">
                  {{ s }}
                </option>
              </select>
            </div>
          </div>

          <!-- Card Body -->
          <div class="order-card-body">
            <!-- Customer Column -->
            <div class="customer-info-box">
              <div class="info-title">CUSTOMER DETAILS</div>
              <div class="info-row">
                <span class="icon">👤</span>
                <span class="val bold">{{ order.customerName }}</span>
              </div>
              <div class="info-row">
                <span class="icon">✉️</span>
                <span class="val">{{ order.customerEmail }}</span>
              </div>
              <div class="info-row">
                <span class="icon">📍</span>
                <span class="val address">{{ order.address }}</span>
              </div>
              <div class="info-row">
                <span class="icon">💳</span>
                <span class="val">{{ order.paymentMethod || 'Cash on Delivery' }}</span>
              </div>
            </div>

            <!-- Items Column -->
            <div class="order-items-box">
              <div class="info-title">ITEMS ORDERED ({{ order.items.length }})</div>
              <div class="items-list">
                <div *ngFor="let item of order.items" class="item-row">
                  <div class="item-main">
                    <span class="item-img">{{ item.image }}</span>
                    <span class="item-name">{{ item.foodName }}</span>
                    <span class="item-qty">x{{ item.quantity }}</span>
                  </div>
                  <span class="item-total">
                    \${{ item.price * item.quantity | number : '1.2-2' }}
                  </span>
                </div>
              </div>

              <div class="order-total-bar">
                <span>Grand Total:</span>
                <span class="total-amount">\${{ order.total | number : '1.2-2' }}</span>
              </div>
            </div>
          </div>
        </div>

        <div *ngIf="filteredOrders().length === 0" class="glass-card empty-orders">
          <span class="empty-icon">📭</span>
          <h3>No matching orders found</h3>
          <p>Try adjusting your search criteria or switching status filter tabs.</p>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .orders-page {
        display: flex;
        flex-direction: column;
        gap: 24px;
      }
      .page-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-wrap: wrap;
        gap: 16px;
      }
      .page-title {
        font-size: 26px;
        color: var(--text-main);
      }
      .page-subtitle {
        font-size: 14px;
        color: var(--text-muted);
        margin-top: 4px;
      }

      /* Controls */
      .controls-card {
        padding: 20px;
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
      .search-box {
        position: relative;
      }
      .search-icon {
        position: absolute;
        left: 14px;
        top: 50%;
        transform: translateY(-50%);
        font-size: 14px;
        color: var(--text-dim);
      }
      .search-input {
        padding-left: 40px;
      }
      .status-tabs {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }
      .tab-btn {
        background: var(--bg-surface);
        border: 1px solid var(--border-subtle);
        color: var(--text-muted);
        padding: 8px 16px;
        border-radius: var(--radius-md);
        font-family: var(--font-heading);
        font-size: 13px;
        font-weight: 600;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 8px;
        transition: all 0.2s ease;
      }
      .tab-btn:hover {
        background: var(--bg-card-hover);
        color: var(--text-main);
      }
      .tab-btn.active {
        background: rgba(249, 115, 22, 0.15);
        color: var(--primary);
        border-color: rgba(249, 115, 22, 0.4);
      }
      .tab-count {
        background: rgba(255, 255, 255, 0.08);
        padding: 1px 7px;
        border-radius: 9999px;
        font-size: 11px;
      }

      /* Orders List */
      .orders-list {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
      .order-card {
        padding: 24px;
      }
      .order-card-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-bottom: 16px;
        border-bottom: 1px solid var(--border-subtle);
        flex-wrap: wrap;
        gap: 12px;
      }
      .header-left {
        display: flex;
        align-items: center;
        gap: 12px;
      }
      .order-id {
        font-family: monospace;
        font-size: 15px;
        font-weight: 700;
        color: #38bdf8;
        background: rgba(14, 165, 233, 0.1);
        padding: 4px 10px;
        border-radius: var(--radius-sm);
        border: 1px solid rgba(14, 165, 233, 0.25);
      }
      .order-date {
        font-size: 13px;
        color: var(--text-dim);
      }
      .header-right {
        display: flex;
        align-items: center;
        gap: 12px;
      }
      .status-select {
        padding: 6px 12px;
        font-size: 13px;
        width: auto;
      }

      /* Card Body */
      .order-card-body {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 24px;
        margin-top: 16px;
      }
      @media (max-width: 800px) {
        .order-card-body {
          grid-template-columns: 1fr;
        }
      }

      .info-title {
        font-size: 11px;
        font-weight: 700;
        color: var(--text-dim);
        letter-spacing: 0.08em;
        margin-bottom: 12px;
      }
      .customer-info-box {
        background: var(--bg-surface);
        padding: 16px;
        border-radius: var(--radius-md);
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
      .info-row {
        display: flex;
        align-items: flex-start;
        gap: 10px;
        font-size: 13px;
      }
      .info-row .icon {
        font-size: 16px;
        flex-shrink: 0;
      }
      .info-row .val {
        color: var(--text-muted);
      }
      .info-row .val.bold {
        font-weight: 600;
        color: var(--text-main);
      }
      .info-row .val.address {
        line-height: 1.4;
      }

      .order-items-box {
        background: var(--bg-surface);
        padding: 16px;
        border-radius: var(--radius-md);
        display: flex;
        flex-direction: column;
      }
      .items-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
        flex: 1;
      }
      .item-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 13px;
        padding-bottom: 6px;
        border-bottom: 1px dashed rgba(255, 255, 255, 0.05);
      }
      .item-main {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .item-img {
        font-size: 16px;
      }
      .item-name {
        font-weight: 500;
        color: var(--text-main);
      }
      .item-qty {
        color: var(--primary);
        font-weight: 600;
      }
      .item-total {
        color: var(--text-muted);
        font-weight: 600;
      }
      .order-total-bar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 14px;
        padding-top: 10px;
        border-top: 1px solid var(--border-subtle);
        font-weight: 700;
        font-size: 14px;
        color: var(--text-main);
      }
      .total-amount {
        font-size: 18px;
        color: #34d399;
      }

      .empty-orders {
        padding: 48px 24px;
        text-align: center;
      }
      .empty-icon {
        font-size: 40px;
        display: block;
        margin-bottom: 12px;
      }
      .empty-orders h3 {
        font-size: 18px;
        margin-bottom: 6px;
      }
      .empty-orders p {
        font-size: 13px;
        color: var(--text-dim);
      }
    `,
  ],
})
export class OrdersComponent implements OnInit {
  orderService = inject(OrderService);

  searchTerm = '';
  selectedStatus = signal<string>('All');

  readonly statuses = [
    'All',
    'Pending',
    'Confirmed',
    'Preparing',
    'Out for Delivery',
    'Delivered',
    'Cancelled',
  ];

  readonly updatableStatuses: OrderStatus[] = [
    'Pending',
    'Confirmed',
    'Preparing',
    'Out for Delivery',
    'Delivered',
    'Cancelled',
  ];

  ngOnInit(): void {
    this.orderService.fetchOrders();
  }

  getCountForStatus(status: string): number {
    const list = this.orderService.orders();
    if (status === 'All') return list.length;
    return list.filter((o) => o.status === status).length;
  }

  filteredOrders(): Order[] {
    let list = this.orderService.orders();

    if (this.selectedStatus() !== 'All') {
      list = list.filter((o) => o.status === this.selectedStatus());
    }

    if (this.searchTerm.trim()) {
      const q = this.searchTerm.toLowerCase();
      list = list.filter(
        (o) =>
          o._id.toLowerCase().includes(q) ||
          o.customerName.toLowerCase().includes(q) ||
          o.customerEmail.toLowerCase().includes(q) ||
          o.address.toLowerCase().includes(q)
      );
    }

    return list;
  }

  async onStatusChange(orderId: string, event: Event): Promise<void> {
    const select = event.target as HTMLSelectElement;
    await this.orderService.updateOrderStatus(orderId, select.value as OrderStatus);
  }
}
