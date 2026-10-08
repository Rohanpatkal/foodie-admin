import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../services/admin.service';
import { AdminUser } from '../../models';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="users-page">
      <div class="page-header">
        <div>
          <h1 class="page-title">Customers & Users Directory</h1>
          <p class="page-subtitle">Inspect registered accounts, account permissions, and customer contact records</p>
        </div>
        <button class="btn-primary" (click)="adminService.fetchUsers()">
          <span>🔄</span> Refresh Users
        </button>
      </div>

      <!-- Stats Bar -->
      <div class="users-stat-grid">
        <div class="glass-card stat-card">
          <span class="stat-label">TOTAL ACCOUNTS</span>
          <span class="stat-value">{{ adminService.users().length }}</span>
        </div>
        <div class="glass-card stat-card">
          <span class="stat-label">CUSTOMERS</span>
          <span class="stat-value text-sky">{{ customerCount() }}</span>
        </div>
        <div class="glass-card stat-card">
          <span class="stat-label">ADMINISTRATORS</span>
          <span class="stat-value text-amber">{{ adminCount() }}</span>
        </div>
      </div>

      <!-- Controls -->
      <div class="glass-card controls-card">
        <div class="search-box">
          <span class="search-icon">🔍</span>
          <input
            type="text"
            class="form-input search-input"
            [(ngModel)]="searchTerm"
            placeholder="Search users by name or email..."
          />
        </div>

        <div class="role-filter">
          <button
            class="filter-btn"
            [class.active]="selectedRole() === 'all'"
            (click)="selectedRole.set('all')"
          >
            All Accounts
          </button>
          <button
            class="filter-btn"
            [class.active]="selectedRole() === 'customer'"
            (click)="selectedRole.set('customer')"
          >
            Customers
          </button>
          <button
            class="filter-btn"
            [class.active]="selectedRole() === 'admin'"
            (click)="selectedRole.set('admin')"
          >
            Admins
          </button>
        </div>
      </div>

      <!-- Users Table -->
      <div class="glass-card table-card">
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Email Address</th>
                <th>Role</th>
                <th>User ID</th>
                <th>Joined Date</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let u of filteredUsers()">
                <td>
                  <div class="user-cell">
                    <div class="user-avatar" [class.admin-av]="u.role === 'admin'">
                      {{ u.name.slice(0, 1).toUpperCase() }}
                    </div>
                    <span class="user-name">{{ u.name }}</span>
                  </div>
                </td>
                <td>
                  <span class="user-email">{{ u.email }}</span>
                </td>
                <td>
                  <span
                    class="badge"
                    [ngClass]="u.role === 'admin' ? 'badge-Preparing' : 'badge-Delivered'"
                  >
                    {{ u.role === 'admin' ? '🛡️ Administrator' : '👤 Customer' }}
                  </span>
                </td>
                <td>
                  <span class="code-id">#{{ u._id.slice(-6).toUpperCase() }}</span>
                </td>
                <td>
                  <span class="date-val">
                    {{ u.createdAt ? (u.createdAt | date : 'mediumDate') : 'Recently' }}
                  </span>
                </td>
              </tr>

              <tr *ngIf="filteredUsers().length === 0">
                <td colspan="5" class="empty-cell">No users found matching your search.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .users-page {
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

      .users-stat-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
        gap: 16px;
      }
      .stat-card {
        padding: 16px 20px;
        display: flex;
        flex-direction: column;
        gap: 6px;
      }
      .stat-label {
        font-size: 11px;
        font-weight: 700;
        color: var(--text-dim);
        letter-spacing: 0.08em;
      }
      .stat-value {
        font-family: var(--font-heading);
        font-size: 26px;
        font-weight: 800;
        color: var(--text-main);
      }
      .text-sky { color: #38bdf8; }
      .text-amber { color: #fbbf24; }

      .controls-card {
        padding: 18px 20px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
        flex-wrap: wrap;
      }
      .search-box {
        position: relative;
        flex: 1;
        min-width: 260px;
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
      .role-filter {
        display: flex;
        gap: 8px;
      }
      .filter-btn {
        background: var(--bg-surface);
        border: 1px solid var(--border-subtle);
        color: var(--text-muted);
        padding: 8px 14px;
        border-radius: var(--radius-md);
        font-size: 13px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
      }
      .filter-btn:hover {
        background: var(--bg-card-hover);
        color: var(--text-main);
      }
      .filter-btn.active {
        background: rgba(249, 115, 22, 0.15);
        color: var(--primary);
        border-color: rgba(249, 115, 22, 0.35);
      }

      .table-card {
        padding: 20px;
      }
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
      .user-cell {
        display: flex;
        align-items: center;
        gap: 12px;
      }
      .user-avatar {
        width: 34px;
        height: 34px;
        border-radius: 50%;
        background: var(--bg-surface);
        border: 1px solid var(--border-subtle);
        color: var(--text-main);
        font-weight: 700;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 13px;
      }
      .user-avatar.admin-av {
        background: var(--primary-gradient);
        color: #fff;
        border: none;
      }
      .user-name {
        font-weight: 600;
        color: var(--text-main);
      }
      .user-email {
        color: var(--text-muted);
      }
      .code-id {
        font-family: monospace;
        background: rgba(255, 255, 255, 0.06);
        padding: 3px 6px;
        border-radius: 4px;
        color: #94a3b8;
      }
      .date-val {
        color: var(--text-dim);
      }
      .empty-cell {
        text-align: center;
        padding: 36px !important;
        color: var(--text-dim);
      }
    `,
  ],
})
export class UsersComponent implements OnInit {
  adminService = inject(AdminService);

  searchTerm = '';
  selectedRole = signal<'all' | 'customer' | 'admin'>('all');

  ngOnInit(): void {
    this.adminService.fetchUsers();
  }

  customerCount(): number {
    return this.adminService.users().filter((u) => u.role === 'customer').length;
  }

  adminCount(): number {
    return this.adminService.users().filter((u) => u.role === 'admin').length;
  }

  filteredUsers(): AdminUser[] {
    let list = this.adminService.users();

    if (this.selectedRole() !== 'all') {
      list = list.filter((u) => u.role === this.selectedRole());
    }

    if (this.searchTerm.trim()) {
      const q = this.searchTerm.toLowerCase();
      list = list.filter(
        (u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
      );
    }

    return list;
  }
}
