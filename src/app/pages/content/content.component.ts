import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../services/admin.service';
import { WebsiteContent } from '../../models';

@Component({
  selector: 'app-content',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="content-page">
      <div class="page-header">
        <div>
          <h1 class="page-title">Website Content & Announcements</h1>
          <p class="page-subtitle">Configure promotional top banners, hero marketing copy, and store policies</p>
        </div>
        <button class="btn-primary" (click)="saveContent()" [disabled]="isSaving()">
          <span>💾</span> {{ isSaving() ? 'Saving...' : 'Publish Changes' }}
        </button>
      </div>

      <div class="content-grid">
        <!-- Configuration Form -->
        <div class="glass-card form-panel">
          <h2 class="panel-title">📢 Promotional Announcement Bar</h2>
          <div class="form-group toggle-group">
            <label class="toggle-label">
              <input type="checkbox" [(ngModel)]="formData.bannerEnabled" name="bannerEnabled" />
              <span class="toggle-text">Display Top Announcement Banner</span>
            </label>
          </div>

          <div class="form-group">
            <label class="form-label">Banner Message</label>
            <input
              type="text"
              class="form-input"
              [(ngModel)]="formData.bannerText"
              name="bannerText"
              placeholder="e.g. ⚡ Weekend Flash Sale: 20% off all Pizzas! Use code FOODIE20"
            />
          </div>

          <hr class="panel-divider" />

          <h2 class="panel-title">🎯 Hero Section Marketing Copy</h2>
          <div class="form-group">
            <label class="form-label">Main Headline</label>
            <input
              type="text"
              class="form-input"
              [(ngModel)]="formData.heroHeadline"
              name="heroHeadline"
              placeholder="Delicious Food, Delivered Hot & Fresh"
            />
          </div>

          <div class="form-group">
            <label class="form-label">Subheadline / Value Proposition</label>
            <textarea
              class="form-textarea"
              [(ngModel)]="formData.heroSubheadline"
              name="heroSubheadline"
              placeholder="Craving artisanal pizza, burgers, or noodles?..."
            ></textarea>
          </div>

          <hr class="panel-divider" />

          <h2 class="panel-title">🚚 Delivery Fee & Threshold</h2>
          <div class="form-row">
            <div class="form-group flex-1">
              <label class="form-label">Standard Delivery Fee ($)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                class="form-input"
                [(ngModel)]="formData.deliveryFee"
                name="deliveryFee"
              />
            </div>
            <div class="form-group flex-1">
              <label class="form-label">Free Delivery Over ($)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                class="form-input"
                [(ngModel)]="formData.freeDeliveryThreshold"
                name="freeDeliveryThreshold"
              />
            </div>
          </div>

          <hr class="panel-divider" />

          <h2 class="panel-title">📞 Contact & Operating Hours</h2>
          <div class="form-row">
            <div class="form-group flex-1">
              <label class="form-label">Support Phone</label>
              <input
                type="text"
                class="form-input"
                [(ngModel)]="formData.supportPhone"
                name="supportPhone"
              />
            </div>
            <div class="form-group flex-1">
              <label class="form-label">Support Email</label>
              <input
                type="email"
                class="form-input"
                [(ngModel)]="formData.supportEmail"
                name="supportEmail"
              />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Daily Operating Hours</label>
            <input
              type="text"
              class="form-input"
              [(ngModel)]="formData.operatingHours"
              name="operatingHours"
            />
          </div>
        </div>

        <!-- Live Customer Preview -->
        <div class="preview-panel">
          <div class="glass-card preview-card">
            <div class="preview-header">
              <span class="preview-tag">LIVE SIMULATION</span>
              <span class="preview-hint">Customer Website Preview</span>
            </div>

            <!-- Simulated Browser Frame -->
            <div class="mock-browser">
              <!-- Announcement Bar Preview -->
              <div
                class="mock-banner"
                *ngIf="formData.bannerEnabled"
              >
                <span>{{ formData.bannerText || 'Promotional message...' }}</span>
              </div>

              <!-- Mock Header -->
              <div class="mock-nav">
                <div class="mock-brand">🍔 Foodie</div>
                <div class="mock-nav-links">
                  <span>Menu</span>
                  <span>Orders</span>
                  <span>Cart (0)</span>
                </div>
              </div>

              <!-- Mock Hero Section -->
              <div class="mock-hero">
                <div class="mock-hero-pill">⚡ FAST 30-MIN DELIVERY</div>
                <h1 class="mock-hero-title">
                  {{ formData.heroHeadline || 'Headline preview...' }}
                </h1>
                <p class="mock-hero-desc">
                  {{ formData.heroSubheadline || 'Subheadline preview...' }}
                </p>
                <div class="mock-hero-actions">
                  <div class="mock-btn-primary">Explore Menu →</div>
                  <div class="mock-btn-secondary">Track Order</div>
                </div>
              </div>

              <!-- Mock Store Info Bar -->
              <div class="mock-info-bar">
                <div class="mock-info-item">
                  <span class="icon">🛵</span>
                  <span>
                    \${{ formData.deliveryFee || 0 | number : '1.2-2' }} Delivery
                    (Free over \${{ formData.freeDeliveryThreshold || 0 }})
                  </span>
                </div>
                <div class="mock-info-item">
                  <span class="icon">🕒</span>
                  <span>{{ formData.operatingHours }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .content-page {
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

      .content-grid {
        display: grid;
        grid-template-columns: 1.1fr 1fr;
        gap: 24px;
      }
      @media (max-width: 1024px) {
        .content-grid {
          grid-template-columns: 1fr;
        }
      }

      .form-panel {
        padding: 24px;
      }
      .panel-title {
        font-size: 16px;
        color: var(--text-main);
        margin-bottom: 14px;
      }
      .panel-divider {
        border: none;
        border-top: 1px solid var(--border-subtle);
        margin: 20px 0;
      }
      .toggle-group {
        margin-bottom: 12px;
      }
      .toggle-label {
        display: flex;
        align-items: center;
        gap: 10px;
        cursor: pointer;
      }
      .toggle-text {
        font-size: 14px;
        font-weight: 600;
        color: var(--text-main);
      }
      .form-row {
        display: flex;
        gap: 16px;
      }
      .flex-1 { flex: 1; }

      /* Preview Panel */
      .preview-card {
        padding: 24px;
        position: sticky;
        top: 24px;
      }
      .preview-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 16px;
      }
      .preview-tag {
        font-size: 11px;
        font-weight: 700;
        background: rgba(14, 165, 233, 0.15);
        color: #38bdf8;
        border: 1px solid rgba(14, 165, 233, 0.3);
        padding: 3px 10px;
        border-radius: 9999px;
      }
      .preview-hint {
        font-size: 12px;
        color: var(--text-dim);
      }

      .mock-browser {
        background: #030712;
        border: 1px solid rgba(255, 255, 255, 0.12);
        border-radius: var(--radius-md);
        overflow: hidden;
      }
      .mock-banner {
        background: linear-gradient(90deg, #f97316 0%, #ea580c 100%);
        color: #fff;
        padding: 8px 14px;
        font-size: 12px;
        font-weight: 600;
        text-align: center;
        letter-spacing: 0.02em;
      }
      .mock-nav {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 14px 18px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      }
      .mock-brand {
        font-family: var(--font-heading);
        font-weight: 800;
        font-size: 15px;
        color: #f97316;
      }
      .mock-nav-links {
        display: flex;
        gap: 12px;
        font-size: 11px;
        color: #94a3b8;
      }
      .mock-hero {
        padding: 32px 20px;
        text-align: center;
        background: radial-gradient(circle at 50% 20%, rgba(249, 115, 22, 0.15) 0%, transparent 60%);
      }
      .mock-hero-pill {
        display: inline-block;
        font-size: 10px;
        font-weight: 700;
        color: #fb923c;
        background: rgba(249, 115, 22, 0.12);
        border: 1px solid rgba(249, 115, 22, 0.3);
        padding: 3px 10px;
        border-radius: 9999px;
        margin-bottom: 12px;
      }
      .mock-hero-title {
        font-size: 22px;
        line-height: 1.2;
        margin-bottom: 10px;
        color: #f8fafc;
      }
      .mock-hero-desc {
        font-size: 12px;
        color: #94a3b8;
        line-height: 1.5;
        max-width: 380px;
        margin: 0 auto 16px;
      }
      .mock-hero-actions {
        display: flex;
        justify-content: center;
        gap: 10px;
      }
      .mock-btn-primary {
        background: #f97316;
        color: #fff;
        padding: 8px 16px;
        border-radius: 6px;
        font-size: 12px;
        font-weight: 700;
      }
      .mock-btn-secondary {
        background: #1e293b;
        color: #e2e8f0;
        padding: 8px 16px;
        border-radius: 6px;
        font-size: 12px;
        font-weight: 600;
      }
      .mock-info-bar {
        background: rgba(255, 255, 255, 0.03);
        border-top: 1px solid rgba(255, 255, 255, 0.06);
        padding: 12px 16px;
        display: flex;
        flex-direction: column;
        gap: 6px;
        font-size: 11px;
        color: #94a3b8;
      }
      .mock-info-item {
        display: flex;
        align-items: center;
        gap: 8px;
      }
    `,
  ],
})
export class ContentComponent implements OnInit {
  adminService = inject(AdminService);
  isSaving = signal(false);

  formData: WebsiteContent = {
    bannerText: '⚡ Weekend Flash Sale: 20% off all Gourmet Pizzas & Burgers! Use code FOODIE20',
    bannerEnabled: true,
    heroHeadline: 'Delicious Food, Delivered Hot & Fresh',
    heroSubheadline:
      'Craving artisanal pizza, juicy burgers, or savory noodles? Order your favorites from top local kitchens now.',
    supportPhone: '+1 (800) 555-FOOD',
    supportEmail: 'support@foodie.com',
    operatingHours: '10:00 AM - 11:00 PM Daily',
    deliveryFee: 4.99,
    freeDeliveryThreshold: 35.0,
  };

  async ngOnInit(): Promise<void> {
    await this.adminService.fetchContent();
    const curr = this.adminService.content();
    if (curr) {
      this.formData = { ...curr };
    }
  }

  async saveContent(): Promise<void> {
    this.isSaving.set(true);
    try {
      await this.adminService.updateContent(this.formData);
    } finally {
      this.isSaving.set(false);
    }
  }
}
