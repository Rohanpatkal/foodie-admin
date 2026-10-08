import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminService } from '../../services/admin.service';
import { OrderService } from '../../services/order.service';
import { OrderStatus, Order } from '../../models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard-page">
      <div class="page-header">
        <div>
          <h1 class="page-title">Executive Operations Dashboard</h1>
          <p class="page-subtitle">Real-time store metrics, order fulfillment pipeline, and operational status</p>
        </div>
        <button class="btn-primary" (click)="refreshAll()">
          <span>🔄</span> Refresh Data
        </button>
      </div>

      <!-- KPI Summary Cards -->
      <div class="kpi-grid">
        <div class="glass-card kpi-card">
          <div class="kpi-top">
            <span class="kpi-label">TOTAL REVENUE</span>
            <span class="kpi-icon">💰</span>
          </div>
          <div class="kpi-value">\${{ adminService.stats()?.totalRevenue || 0 | number : '1.2-2' }}</div>
          <div class="kpi-meta positive">
            <span>↑ All-time gross sales</span>
          </div>
        </div>

        <div class="glass-card kpi-card">
          <div class="kpi-top">
            <span class="kpi-label">TOTAL ORDERS</span>
            <span class="kpi-icon">📦</span>
          </div>
          <div class="kpi-value">{{ adminService.stats()?.totalOrders || 0 }}</div>
          <div class="kpi-meta">
            <span>Lifetime customer purchases</span>
          </div>
        </div>

        <div class="glass-card kpi-card highlight">
          <div class="kpi-top">
            <span class="kpi-label">ACTIVE / PENDING</span>
            <span class="kpi-icon">⏳</span>
          </div>
          <div class="kpi-value text-amber">{{ adminService.stats()?.pendingOrders || 0 }}</div>
          <div class="kpi-meta text-amber">
            <span>Requires kitchen attention</span>
          </div>
        </div>

        <div class="glass-card kpi-card">
          <div class="kpi-top">
            <span class="kpi-label">DELIVERED ORDERS</span>
            <span class="kpi-icon">✅</span>
          </div>
          <div class="kpi-value text-emerald">{{ adminService.stats()?.deliveredOrders || 0 }}</div>
          <div class="kpi-meta text-emerald">
            <span>Successfully fulfilled</span>
          </div>
        </div>

        <div class="glass-card kpi-card">
          <div class="kpi-top">
            <span class="kpi-label">MENU ITEMS</span>
            <span class="kpi-icon">🍕</span>
          </div>
          <div class="kpi-value">{{ adminService.stats()?.totalFoods || 0 }}</div>
          <div class="kpi-meta">
            <span>Active catalog items</span>
          </div>
        </div>

        <div class="glass-card kpi-card">
          <div class="kpi-top">
            <span class="kpi-label">TOTAL USERS</span>
            <span class="kpi-icon">👥</span>
          </div>
          <div class="kpi-value">{{ adminService.stats()?.totalUsers || 0 }}</div>
          <div class="kpi-meta">
            <span>Registered accounts</span>
          </div>
        </div>
      </div>

      <!-- Order Pipeline Breakdown -->
      <div class="glass-card section-card">
        <h2 class="section-title">Order Fulfillment Pipeline</h2>
        <div class="pipeline-grid" *ngIf="adminService.stats()?.statusBreakdown as sb">
          <div class="pipeline-item">
            <div class="pipeline-header">
              <span class="pipeline-name">Pending</span>
              <span class="badge badge-Pending">{{ sb.Pending }}</span>
            </div>
            <div class="pipeline-bar">
              <div
                class="bar-fill bg-amber"
                [style.width.%]="calcPercentage(sb.Pending)"
              ></div>
            </div>
          </div>

          <div class="pipeline-item">
            <div class="pipeline-header">
              <span class="pipeline-name">Preparing</span>
              <span class="badge badge-Preparing">{{ sb.Preparing }}</span>
            </div>
            <div class="pipeline-bar">
              <div
                class="bar-fill bg-indigo"
                [style.width.%]="calcPercentage(sb.Preparing)"
              ></div>
            </div>
          </div>

          <div class="pipeline-item">
            <div class="pipeline-header">
              <span class="pipeline-name">Out for Delivery</span>
              <span class="badge badge-Out-for-Delivery">{{ sb['Out for Delivery'] }}</span>
            </div>
            <div class="pipeline-bar">
              <div
                class="bar-fill bg-sky"
                [style.width.%]="calcPercentage(sb['Out for Delivery'])"
              ></div>
            </div>
          </div>

          <div class="pipeline-item">
            <div class="pipeline-header">
              <span class="pipeline-name">Delivered</span>
              <span class="badge badge-Delivered">{{ sb.Delivered }}</span>
            </div>
            <div class="pipeline-bar">
              <div
                class="bar-fill bg-emerald"
                [style.width.%]="calcPercentage(sb.Delivered)"
              ></div>
            </div>
          </div>

          <div class="pipeline-item">
            <div class="pipeline-header">
              <span class="pipeline-name">Cancelled</span>
              <span class="badge badge-Cancelled">{{ sb.Cancelled }}</span>
            </div>
            <div class="pipeline-bar">
              <div
                class="bar-fill bg-rose"
                [style.width.%]="calcPercentage(sb.Cancelled)"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Orders Table -->
      <div class="glass-card section-card">
        <div class="section-header">
          <div>
            <h2 class="section-title">Recent Customer Orders</h2>
            <p class="section-subtitle">Live orders with inline status controls</p>
          </div>
          <a routerLink="/orders" class="btn-secondary">View All Orders →</a>
        </div>

        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Items Ordered</th>
                <th>Total</th>
                <th>Date</th>
                <th>Status</th>
                <th>Quick Action</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let order of recentOrders()">
                <td>
                  <span class="code-id">#{{ order._id.slice(-6).toUpperCase() }}</span>
                </td>
                <td>
                  <div class="customer-cell">
                    <span class="c-name">{{ order.customerName }}</span>
                    <span class="c-email">{{ order.customerEmail }}</span>
                  </div>
                </td>
                <td>
                  <div class="items-cell">
                    <span *ngFor="let item of order.items.slice(0, 2)" class="item-tag">
                      {{ item.image }} {{ item.foodName }} (x{{ item.quantity }})
                    </span>
                    <span *ngIf="order.items.length > 2" class="more-items">
                      +{{ order.items.length - 2 }} more
                    </span>
                  </div>
                </td>
                <td>
                  <span class="price-val">\${{ order.total | number : '1.2-2' }}</span>
                </td>
                <td>
                  <span class="date-val">{{ order.createdAt | date : 'short' }}</span>
                </td>
                <td>
                  <span class="badge badge-{{ order.status.replace(' ', '-') }}">
                    {{ order.status }}
                  </span>
                </td>
                <td>
                  <select
                    class="form-select status-select"
                    [value]="order.status"
                    (change)="onStatusChange(order._id, $event)"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Preparing">Preparing</option>
                    <option value="Out for Delivery">Out for Delivery</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
              <tr *ngIf="recentOrders().length === 0">
                <td colspan="7" class="empty-cell">No orders placed yet.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .dashboard-page {
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

      /* KPI Grid */
      .kpi-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 16px;
      }
      .kpi-card {
        padding: 20px;
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      .kpi-card.highlight {
        border-color: rgba(245, 158, 11, 0.4);
        background: rgba(245, 158, 11, 0.05);
      }
      .kpi-top {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .kpi-label {
        font-size: 11px;
        font-weight: 700;
        color: var(--text-dim);
        letter-spacing: 0.08em;
      }
      .kpi-icon {
        font-size: 20px;
      }
      .kpi-value {
        font-family: var(--font-heading);
        font-size: 28px;
        font-weight: 800;
        color: var(--text-main);
        line-height: 1.1;
      }
      .kpi-meta {
        font-size: 12px;
        color: var(--text-dim);
      }
      .text-amber {
        color: #fbbf24;
      }
      .text-emerald {
        color: #34d399;
      }

      /* Section Cards */
      .section-card {
        padding: 24px;
      }
      .section-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 20px;
        flex-wrap: wrap;
        gap: 12px;
      }
      .section-title {
        font-size: 18px;
        color: var(--text-main);
      }
      .section-subtitle {
        font-size: 13px;
        color: var(--text-muted);
        margin-top: 2px;
      }

      /* Pipeline */
      .pipeline-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
        gap: 16px;
        margin-top: 16px;
      }
      .pipeline-item {
        background: var(--bg-surface);
        padding: 14px;
        border-radius: var(--radius-md);
        border: 1px solid var(--border-subtle);
      }
      .pipeline-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
      }
      .pipeline-name {
        font-size: 13px;
        font-weight: 600;
        color: var(--text-main);
      }
      .pipeline-bar {
        height: 6px;
        background: rgba(255, 255, 255, 0.06);
        border-radius: 9999px;
        overflow: hidden;
      }
      .bar-fill {
        height: 100%;
        border-radius: 9999px;
        transition: width 0.4s ease;
      }
      .bg-amber { background: #f59e0b; }
      .bg-indigo { background: #6366f1; }
      .bg-sky { background: #0ea5e9; }
      .bg-emerald { background: #10b981; }
      .bg-rose { background: #ef4444; }

      /* Table */
      .table-responsive {
        overflow-x: auto;
      }
      .data-table {
        width: 100%;
        border-collapse: collapse;
        font-size: 13px;
        text-align: left;
      }
      .data-table th {
        padding: 12px 16px;
        background: var(--bg-surface);
        color: var(--text-muted);
        font-weight: 600;
        border-bottom: 1px solid var(--border-subtle);
        white-space: nowrap;
      }
      .data-table td {
        padding: 14px 16px;
        border-bottom: 1px solid var(--border-subtle);
        vertical-align: middle;
      }
      .data-table tr:hover td {
        background: rgba(255, 255, 255, 0.02);
      }
      .code-id {
        font-family: monospace;
        background: rgba(255, 255, 255, 0.06);
        padding: 3px 6px;
        border-radius: 4px;
        color: #38bdf8;
        font-weight: 600;
      }
      .customer-cell {
        display: flex;
        flex-direction: column;
      }
      .c-name {
        font-weight: 600;
        color: var(--text-main);
      }
      .c-email {
        font-size: 11px;
        color: var(--text-dim);
      }
      .items-cell {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
      }
      .item-tag {
        background: rgba(255, 255, 255, 0.05);
        padding: 2px 8px;
        border-radius: 4px;
        font-size: 11px;
      }
      .more-items {
        font-size: 11px;
        color: var(--primary);
      }
      .price-val {
        font-weight: 700;
        color: #34d399;
      }
      .date-val {
        color: var(--text-dim);
      }
      .status-select {
        padding: 6px 10px;
        font-size: 12px;
        width: auto;
      }
      .empty-cell {
        text-align: center;
        padding: 32px !important;
        color: var(--text-dim);
      }
    `,
  ],
})
export class DashboardComponent implements OnInit {
  adminService = inject(AdminService);
  orderService = inject(OrderService);

  ngOnInit(): void {
    this.refreshAll();
  }

  async refreshAll(): Promise<void> {
    await Promise.all([
      this.adminService.fetchStats(),
      this.orderService.fetchOrders(),
    ]);
  }

  recentOrders(): Order[] {
    return this.orderService.orders().slice(0, 8);
  }

  calcPercentage(count: number): number {
    const total = this.adminService.stats()?.totalOrders || 1;
    return Math.min(100, Math.round((count / total) * 100)) || 5;
  }

  async onStatusChange(orderId: string, event: Event): Promise<void> {
    const select = event.target as HTMLSelectElement;
    await this.orderService.updateOrderStatus(orderId, select.value as OrderStatus);
    await this.adminService.fetchStats();
  }
}
