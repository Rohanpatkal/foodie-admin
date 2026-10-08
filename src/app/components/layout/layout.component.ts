import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="app-layout">
      <!-- Sidebar -->
      <aside class="sidebar" [class.mobile-open]="mobileMenuOpen()">
        <div class="sidebar-top">
          <div class="brand">
            <span class="brand-logo">🍔</span>
            <div class="brand-info">
              <span class="brand-title">FOODIE</span>
              <span class="brand-tag">OPS PORTAL</span>
            </div>
          </div>
          <button class="mobile-close" (click)="toggleMobileMenu()">✕</button>
        </div>

        <nav class="nav-menu">
          <div class="nav-section-title">MANAGEMENT</div>

          <a
            routerLink="/dashboard"
            routerLinkActive="active"
            class="nav-link"
            (click)="closeMobileMenu()"
          >
            <span class="nav-icon">📊</span>
            <span>Dashboard</span>
          </a>

          <a
            routerLink="/orders"
            routerLinkActive="active"
            class="nav-link"
            (click)="closeMobileMenu()"
          >
            <span class="nav-icon">📦</span>
            <span>Live Orders</span>
          </a>

          <a
            routerLink="/foods"
            routerLinkActive="active"
            class="nav-link"
            (click)="closeMobileMenu()"
          >
            <span class="nav-icon">🍕</span>
            <span>Menu & Foods</span>
          </a>

          <a
            routerLink="/users"
            routerLinkActive="active"
            class="nav-link"
            (click)="closeMobileMenu()"
          >
            <span class="nav-icon">👥</span>
            <span>Customers & Users</span>
          </a>

          <div class="nav-section-title">PORTAL & SETTINGS</div>

          <a
            routerLink="/content"
            routerLinkActive="active"
            class="nav-link"
            (click)="closeMobileMenu()"
          >
            <span class="nav-icon">🌐</span>
            <span>Website Content</span>
          </a>

          <a
            href="http://localhost:3000"
            target="_blank"
            rel="noopener noreferrer"
            class="nav-link nav-link-external"
          >
            <span class="nav-icon">↗</span>
            <span>Customer Store</span>
          </a>
        </nav>

        <div class="sidebar-footer">
          <div class="admin-profile" *ngIf="auth.currentUser() as user">
            <div class="admin-avatar">
              {{ user.name.slice(0, 1).toUpperCase() }}
            </div>
            <div class="admin-details">
              <span class="admin-name">{{ user.name }}</span>
              <span class="admin-role">Administrator</span>
            </div>
          </div>

          <button class="btn-logout" (click)="onLogout()" title="Sign Out">
            <span class="logout-icon">🚪</span>
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      <!-- Main Shell -->
      <div class="main-shell">
        <header class="topbar">
          <div class="topbar-left">
            <button class="menu-toggle" (click)="toggleMobileMenu()">☰</button>
            <div class="system-status">
              <span class="status-dot"></span>
              <span class="status-text">Production API: Online (Port 5000)</span>
            </div>
          </div>

          <div class="topbar-right">
            <div class="quick-stat-badge">
              <span>Admin Mode</span>
            </div>
          </div>
        </header>

        <main class="page-container">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
  styles: [
    `
      .app-layout {
        display: flex;
        min-height: 100vh;
        background: var(--bg-dark);
      }

      /* Sidebar */
      .sidebar {
        width: 260px;
        background: #0d121d;
        border-right: 1px solid var(--border-subtle);
        display: flex;
        flex-direction: column;
        flex-shrink: 0;
        position: sticky;
        top: 0;
        height: 100vh;
        z-index: 100;
        transition: transform 0.3s ease;
      }
      .sidebar-top {
        padding: 24px 20px 20px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid var(--border-subtle);
      }
      .brand {
        display: flex;
        align-items: center;
        gap: 12px;
      }
      .brand-logo {
        font-size: 28px;
      }
      .brand-info {
        display: flex;
        flex-direction: column;
        line-height: 1.1;
      }
      .brand-title {
        font-family: var(--font-heading);
        font-size: 18px;
        font-weight: 800;
        color: var(--primary);
        letter-spacing: 0.04em;
      }
      .brand-tag {
        font-size: 10px;
        font-weight: 700;
        color: var(--text-dim);
        letter-spacing: 0.1em;
      }
      .mobile-close {
        display: none;
        background: transparent;
        border: none;
        color: var(--text-muted);
        font-size: 20px;
        cursor: pointer;
      }

      .nav-menu {
        flex: 1;
        padding: 20px 12px;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 4px;
      }
      .nav-section-title {
        font-size: 11px;
        font-weight: 700;
        color: var(--text-dim);
        letter-spacing: 0.08em;
        padding: 12px 12px 6px;
      }
      .nav-link {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 11px 14px;
        border-radius: var(--radius-md);
        color: var(--text-muted);
        font-family: var(--font-heading);
        font-weight: 600;
        font-size: 14px;
        transition: all 0.2s ease;
      }
      .nav-link:hover {
        background: rgba(255, 255, 255, 0.04);
        color: var(--text-main);
      }
      .nav-link.active {
        background: rgba(249, 115, 22, 0.15);
        color: var(--primary);
        border: 1px solid rgba(249, 115, 22, 0.3);
      }
      .nav-icon {
        font-size: 18px;
      }
      .nav-link-external {
        color: #38bdf8;
      }
      .nav-link-external:hover {
        color: #7dd3fc;
      }

      .sidebar-footer {
        padding: 16px;
        border-top: 1px solid var(--border-subtle);
        background: #0a0e16;
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      .admin-profile {
        display: flex;
        align-items: center;
        gap: 10px;
      }
      .admin-avatar {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background: var(--primary-gradient);
        color: #fff;
        font-weight: 700;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
      }
      .admin-details {
        display: flex;
        flex-direction: column;
        overflow: hidden;
      }
      .admin-name {
        font-size: 13px;
        font-weight: 600;
        color: var(--text-main);
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }
      .admin-role {
        font-size: 11px;
        color: var(--text-dim);
      }
      .btn-logout {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        width: 100%;
        padding: 8px;
        background: rgba(239, 68, 68, 0.1);
        border: 1px solid rgba(239, 68, 68, 0.25);
        color: #f87171;
        border-radius: var(--radius-sm);
        font-size: 12px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
      }
      .btn-logout:hover {
        background: rgba(239, 68, 68, 0.2);
      }

      /* Main Shell */
      .main-shell {
        flex: 1;
        display: flex;
        flex-direction: column;
        min-width: 0;
      }
      .topbar {
        height: 64px;
        background: #0f1523;
        border-bottom: 1px solid var(--border-subtle);
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 28px;
      }
      .topbar-left {
        display: flex;
        align-items: center;
        gap: 16px;
      }
      .menu-toggle {
        display: none;
        background: transparent;
        border: none;
        color: var(--text-main);
        font-size: 22px;
        cursor: pointer;
      }
      .system-status {
        display: flex;
        align-items: center;
        gap: 8px;
        background: rgba(16, 185, 129, 0.1);
        border: 1px solid rgba(16, 185, 129, 0.25);
        padding: 4px 10px;
        border-radius: 9999px;
      }
      .status-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #10b981;
        box-shadow: 0 0 8px #10b981;
      }
      .status-text {
        font-size: 12px;
        color: #34d399;
        font-weight: 500;
      }
      .quick-stat-badge {
        font-size: 12px;
        color: var(--primary);
        font-weight: 700;
        background: rgba(249, 115, 22, 0.1);
        border: 1px solid rgba(249, 115, 22, 0.3);
        padding: 5px 12px;
        border-radius: 9999px;
      }
      .page-container {
        flex: 1;
        padding: 28px;
        overflow-y: auto;
      }

      @media (max-width: 768px) {
        .sidebar {
          position: fixed;
          transform: translateX(-100%);
        }
        .sidebar.mobile-open {
          transform: translateX(0);
        }
        .mobile-close, .menu-toggle {
          display: block;
        }
        .topbar {
          padding: 0 16px;
        }
        .page-container {
          padding: 16px;
        }
      }
    `,
  ],
})
export class LayoutComponent {
  auth = inject(AuthService);
  mobileMenuOpen = signal(false);

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update((val) => !val);
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }

  onLogout(): void {
    this.auth.logout();
  }
}
