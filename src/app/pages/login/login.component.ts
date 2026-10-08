import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-wrapper">
      <div class="login-bg-glow"></div>

      <div class="glass-card login-card">
        <div class="login-header">
          <div class="brand-badge">
            <span class="brand-icon">🍔</span>
            <div class="brand-text">
              <span class="brand-name">FOODIE</span>
              <span class="brand-sub">ADMIN PORTAL</span>
            </div>
          </div>
          <h1 class="login-title">Sign In to Dashboard</h1>
          <p class="login-desc">Enter your administrator credentials to manage restaurants, menus & orders</p>
        </div>

        <form (ngSubmit)="onSubmit()" class="login-form">
          <div class="form-group">
            <label class="form-label">Admin Email</label>
            <input
              type="email"
              class="form-input"
              [(ngModel)]="email"
              name="email"
              placeholder="admin@foodie.com"
              required
            />
          </div>

          <div class="form-group">
            <label class="form-label">Password</label>
            <input
              type="password"
              class="form-input"
              [(ngModel)]="password"
              name="password"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            class="btn-primary login-btn"
            [disabled]="isSubmitting() || !email || !password"
          >
            <span *ngIf="!isSubmitting()">Sign In to Admin Portal</span>
            <span *ngIf="isSubmitting()">Authenticating...</span>
          </button>
        </form>

        <div class="demo-card">
          <div class="demo-title">
            <span>⚡ Demo Credentials</span>
            <button type="button" class="btn-fill" (click)="fillDemoCredentials()">
              Quick Fill
            </button>
          </div>
          <p class="demo-detail">
            Email: <code>admin&#64;foodie.com</code><br />
            Password: <code>admin123</code>
          </p>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .login-wrapper {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 24px;
        position: relative;
        overflow: hidden;
        background: radial-gradient(circle at 50% 20%, #172554 0%, #0a0e17 60%);
      }
      .login-bg-glow {
        position: absolute;
        width: 500px;
        height: 500px;
        background: radial-gradient(circle, rgba(249, 115, 22, 0.15) 0%, transparent 70%);
        top: 20%;
        left: 50%;
        transform: translate(-50%, -50%);
        pointer-events: none;
      }
      .login-card {
        max-width: 440px;
        width: 100%;
        padding: 40px 32px;
        background: rgba(17, 24, 39, 0.85);
        backdrop-filter: blur(16px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        position: relative;
        z-index: 10;
      }
      .login-header {
        text-align: center;
        margin-bottom: 28px;
      }
      .brand-badge {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 16px;
        padding: 6px 14px;
        background: rgba(249, 115, 22, 0.1);
        border: 1px solid rgba(249, 115, 22, 0.25);
        border-radius: 9999px;
      }
      .brand-icon {
        font-size: 24px;
      }
      .brand-text {
        text-align: left;
        line-height: 1.1;
      }
      .brand-name {
        font-family: var(--font-heading);
        font-size: 14px;
        font-weight: 800;
        color: var(--primary);
        letter-spacing: 0.05em;
        display: block;
      }
      .brand-sub {
        font-size: 10px;
        color: var(--text-dim);
        letter-spacing: 0.08em;
      }
      .login-title {
        font-size: 26px;
        margin-bottom: 8px;
        color: var(--text-main);
      }
      .login-desc {
        font-size: 13px;
        color: var(--text-muted);
      }
      .login-form {
        margin-bottom: 24px;
      }
      .login-btn {
        width: 100%;
        padding: 13px;
        font-size: 15px;
        margin-top: 8px;
      }
      .demo-card {
        padding: 14px;
        background: rgba(30, 41, 59, 0.6);
        border: 1px dashed rgba(255, 255, 255, 0.15);
        border-radius: var(--radius-md);
        font-size: 12px;
      }
      .demo-title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 6px;
        color: #f1f5f9;
        font-weight: 600;
      }
      .btn-fill {
        background: rgba(249, 115, 22, 0.2);
        color: #fb923c;
        border: 1px solid rgba(249, 115, 22, 0.4);
        border-radius: 6px;
        padding: 3px 10px;
        font-size: 11px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
      }
      .btn-fill:hover {
        background: rgba(249, 115, 22, 0.35);
      }
      .demo-detail {
        color: var(--text-muted);
        line-height: 1.6;
      }
      code {
        color: #fed7aa;
        background: rgba(0, 0, 0, 0.3);
        padding: 2px 6px;
        border-radius: 4px;
      }
    `,
  ],
})
export class LoginComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  email = 'admin@foodie.com';
  password = 'admin123';
  isSubmitting = signal(false);

  fillDemoCredentials(): void {
    this.email = 'admin@foodie.com';
    this.password = 'admin123';
  }

  async onSubmit(): Promise<void> {
    if (!this.email || !this.password) return;
    this.isSubmitting.set(true);

    try {
      await this.auth.login(this.email, this.password);
    } finally {
      this.isSubmitting.set(false);
    }
  }
}
