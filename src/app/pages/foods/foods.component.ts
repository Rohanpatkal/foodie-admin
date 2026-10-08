import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FoodService } from '../../services/food.service';
import { Food, CreateFoodDTO } from '../../models';

@Component({
  selector: 'app-foods',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="foods-page">
      <div class="page-header">
        <div>
          <h1 class="page-title">Menu & Food Catalog Management</h1>
          <p class="page-subtitle">Add menu items, update prices, manage categories and catalog items</p>
        </div>
        <button class="btn-primary" (click)="openAddModal()">
          <span>➕</span> Add New Food Item
        </button>
      </div>

      <!-- Controls -->
      <div class="glass-card controls-card">
        <div class="search-box">
          <span class="search-icon">🔍</span>
          <input
            type="text"
            class="form-input search-input"
            [(ngModel)]="searchTerm"
            placeholder="Search food by name, category, or ingredients..."
          />
        </div>

        <div class="category-pills">
          <button
            *ngFor="let cat of categories"
            class="pill-btn"
            [class.active]="selectedCategory() === cat"
            (click)="selectedCategory.set(cat)"
          >
            {{ cat }}
          </button>
        </div>
      </div>

      <!-- Food Grid -->
      <div class="food-grid">
        <div *ngFor="let food of filteredFoods()" class="glass-card food-card">
          <div class="food-top">
            <span class="food-emoji">{{ food.image }}</span>
            <span class="category-badge">{{ food.category }}</span>
          </div>

          <div class="food-info">
            <h3 class="food-title">{{ food.name }}</h3>
            <p class="food-desc">{{ food.description || 'Delicious freshly prepared dish.' }}</p>
          </div>

          <div class="food-footer">
            <div class="food-price">\${{ food.price | number : '1.2-2' }}</div>
            <div class="food-actions">
              <button class="btn-secondary btn-icon" (click)="openEditModal(food)" title="Edit Item">
                ✏️
              </button>
              <button class="btn-danger btn-icon" (click)="confirmDelete(food)" title="Delete Item">
                🗑️
              </button>
            </div>
          </div>
        </div>

        <div *ngIf="filteredFoods().length === 0" class="glass-card empty-foods">
          <span class="empty-icon">🍽️</span>
          <h3>No menu items match your search</h3>
          <p>Try switching categories or add a new food item to the catalog.</p>
        </div>
      </div>

      <!-- Add/Edit Food Modal -->
      <div class="modal-overlay" *ngIf="showModal()" (click)="closeModal()">
        <div class="modal-box" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2>{{ isEditing() ? 'Edit Menu Item' : 'Add New Menu Item' }}</h2>
            <button class="modal-close" (click)="closeModal()">✕</button>
          </div>

          <form (ngSubmit)="saveFood()" class="modal-form">
            <div class="form-group">
              <label class="form-label">Food Name *</label>
              <input
                type="text"
                class="form-input"
                [(ngModel)]="formData.name"
                name="name"
                placeholder="e.g. Truffle Mushroom Pizza"
                required
              />
            </div>

            <div class="form-row">
              <div class="form-group flex-1">
                <label class="form-label">Category *</label>
                <select class="form-select" [(ngModel)]="formData.category" name="category" required>
                  <option *ngFor="let cat of formCategories" [value]="cat">
                    {{ cat }}
                  </option>
                </select>
              </div>

              <div class="form-group flex-1">
                <label class="form-label">Price ($) *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  class="form-input"
                  [(ngModel)]="formData.price"
                  name="price"
                  placeholder="14.99"
                  required
                />
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Icon / Emoji Preview *</label>
              <div class="emoji-selector">
                <span class="selected-emoji-preview">{{ formData.image }}</span>
                <div class="emoji-options">
                  <button
                    type="button"
                    *ngFor="let em of commonEmojis"
                    class="emoji-btn"
                    [class.selected]="formData.image === em"
                    (click)="formData.image = em"
                  >
                    {{ em }}
                  </button>
                </div>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Description</label>
              <textarea
                class="form-textarea"
                [(ngModel)]="formData.description"
                name="description"
                placeholder="Brief description of flavors and ingredients..."
              ></textarea>
            </div>

            <div class="modal-footer">
              <button type="button" class="btn-secondary" (click)="closeModal()">
                Cancel
              </button>
              <button
                type="submit"
                class="btn-primary"
                [disabled]="isSubmitting() || !formData.name || !formData.price"
              >
                {{ isSubmitting() ? 'Saving...' : isEditing() ? 'Save Changes' : 'Add to Menu' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Delete Confirmation Modal -->
      <div class="modal-overlay" *ngIf="itemToDelete()" (click)="itemToDelete.set(null)">
        <div class="modal-box delete-box" (click)="$event.stopPropagation()">
          <span class="delete-icon">⚠️</span>
          <h2>Delete Menu Item?</h2>
          <p>
            Are you sure you want to remove <strong>{{ itemToDelete()?.name }}</strong> from the food
            catalog? Customers will no longer be able to order this item.
          </p>
          <div class="modal-footer justify-center">
            <button class="btn-secondary" (click)="itemToDelete.set(null)">
              Keep Item
            </button>
            <button class="btn-danger" (click)="executeDelete()">
              Confirm Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .foods-page {
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
      .category-pills {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }
      .pill-btn {
        background: var(--bg-surface);
        border: 1px solid var(--border-subtle);
        color: var(--text-muted);
        padding: 6px 14px;
        border-radius: 9999px;
        font-size: 13px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
      }
      .pill-btn:hover {
        background: var(--bg-card-hover);
        color: var(--text-main);
      }
      .pill-btn.active {
        background: var(--primary-gradient);
        color: #fff;
        border-color: transparent;
        box-shadow: 0 2px 10px var(--primary-glow);
      }

      /* Grid */
      .food-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
        gap: 20px;
      }
      .food-card {
        padding: 20px;
        display: flex;
        flex-direction: column;
        gap: 14px;
      }
      .food-top {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
      }
      .food-emoji {
        font-size: 44px;
        line-height: 1;
        filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.4));
      }
      .category-badge {
        font-size: 11px;
        font-weight: 700;
        background: rgba(249, 115, 22, 0.15);
        color: var(--primary);
        border: 1px solid rgba(249, 115, 22, 0.3);
        padding: 3px 10px;
        border-radius: 9999px;
      }
      .food-info {
        flex: 1;
      }
      .food-title {
        font-size: 16px;
        color: var(--text-main);
        margin-bottom: 6px;
      }
      .food-desc {
        font-size: 12px;
        color: var(--text-muted);
        line-height: 1.5;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
      .food-footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-top: 12px;
        border-top: 1px solid var(--border-subtle);
      }
      .food-price {
        font-family: var(--font-heading);
        font-size: 20px;
        font-weight: 800;
        color: #34d399;
      }
      .food-actions {
        display: flex;
        gap: 6px;
      }
      .btn-icon {
        padding: 6px 10px;
        font-size: 14px;
      }

      /* Modal */
      .modal-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 20px;
      }
      .modal-close {
        background: transparent;
        border: none;
        color: var(--text-dim);
        font-size: 18px;
        cursor: pointer;
      }
      .form-row {
        display: flex;
        gap: 16px;
      }
      .flex-1 { flex: 1; }
      .emoji-selector {
        display: flex;
        align-items: center;
        gap: 16px;
        background: var(--bg-surface);
        padding: 12px;
        border-radius: var(--radius-md);
        border: 1px solid var(--border-subtle);
      }
      .selected-emoji-preview {
        font-size: 36px;
        line-height: 1;
      }
      .emoji-options {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
      }
      .emoji-btn {
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid var(--border-subtle);
        border-radius: 6px;
        font-size: 20px;
        padding: 4px 8px;
        cursor: pointer;
        transition: transform 0.15s ease, background 0.15s ease;
      }
      .emoji-btn:hover {
        transform: scale(1.15);
        background: rgba(255, 255, 255, 0.12);
      }
      .emoji-btn.selected {
        border-color: var(--primary);
        background: rgba(249, 115, 22, 0.2);
      }
      .modal-footer {
        display: flex;
        justify-content: flex-end;
        gap: 12px;
        margin-top: 24px;
      }
      .delete-box {
        text-align: center;
      }
      .delete-icon {
        font-size: 44px;
        display: block;
        margin-bottom: 12px;
      }
      .delete-box p {
        font-size: 14px;
        color: var(--text-muted);
        margin: 12px 0 20px;
      }
      .justify-center {
        justify-content: center;
      }
      .empty-foods {
        grid-column: 1 / -1;
        padding: 48px 24px;
        text-align: center;
      }
      .empty-icon {
        font-size: 40px;
        display: block;
        margin-bottom: 12px;
      }
      .empty-foods h3 {
        font-size: 18px;
        margin-bottom: 6px;
      }
      .empty-foods p {
        font-size: 13px;
        color: var(--text-dim);
      }
    `,
  ],
})
export class FoodsComponent implements OnInit {
  foodService = inject(FoodService);

  searchTerm = '';
  selectedCategory = signal<string>('All');
  showModal = signal<boolean>(false);
  isEditing = signal<boolean>(false);
  isSubmitting = signal<boolean>(false);
  itemToDelete = signal<Food | null>(null);
  editingId: string | null = null;

  readonly categories = [
    'All',
    'Pizza',
    'Burger',
    'Pasta',
    'Sushi',
    'Sandwich',
    'Dessert',
    'Beverage',
    'Salad',
  ];

  readonly formCategories = [
    'Pizza',
    'Burger',
    'Pasta',
    'Sushi',
    'Sandwich',
    'Dessert',
    'Beverage',
    'Salad',
  ];

  readonly commonEmojis = [
    '🍕', '🍔', '🍟', '🍝', '🥪', '🍣', '🍛', '🥟', '🥤', '🌮', '🥗', '🍩', '🍦', '🍰', '☕'
  ];

  formData: CreateFoodDTO = {
    name: '',
    category: 'Pizza',
    price: 12.99,
    image: '🍕',
    description: '',
  };

  ngOnInit(): void {
    this.foodService.fetchFoods();
  }

  filteredFoods(): Food[] {
    let list = this.foodService.foods();

    if (this.selectedCategory() !== 'All') {
      list = list.filter(
        (f) => f.category.toLowerCase() === this.selectedCategory().toLowerCase()
      );
    }

    if (this.searchTerm.trim()) {
      const q = this.searchTerm.toLowerCase();
      list = list.filter(
        (f) =>
          f.name.toLowerCase().includes(q) ||
          f.category.toLowerCase().includes(q) ||
          (f.description && f.description.toLowerCase().includes(q))
      );
    }

    return list;
  }

  openAddModal(): void {
    this.isEditing.set(false);
    this.editingId = null;
    this.formData = {
      name: '',
      category: 'Pizza',
      price: 12.99,
      image: '🍕',
      description: '',
    };
    this.showModal.set(true);
  }

  openEditModal(food: Food): void {
    this.isEditing.set(true);
    this.editingId = food._id;
    this.formData = {
      name: food.name,
      category: food.category,
      price: food.price,
      image: food.image,
      description: food.description || '',
    };
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
  }

  async saveFood(): Promise<void> {
    if (!this.formData.name || this.formData.price === undefined) return;
    this.isSubmitting.set(true);

    try {
      if (this.isEditing() && this.editingId) {
        const ok = await this.foodService.updateFood(this.editingId, this.formData);
        if (ok) this.closeModal();
      } else {
        const ok = await this.foodService.createFood(this.formData);
        if (ok) this.closeModal();
      }
    } finally {
      this.isSubmitting.set(false);
    }
  }

  confirmDelete(food: Food): void {
    this.itemToDelete.set(food);
  }

  async executeDelete(): Promise<void> {
    const item = this.itemToDelete();
    if (!item) return;

    await this.foodService.deleteFood(item._id);
    this.itemToDelete.set(null);
  }
}
