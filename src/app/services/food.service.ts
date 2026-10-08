import { Injectable, inject, signal } from '@angular/core';
import { ApiService } from './api.service';
import { ToastService } from './toast.service';
import { Food, CreateFoodDTO, ApiResponse } from '../models';

@Injectable({
  providedIn: 'root',
})
export class FoodService {
  private api = inject(ApiService);
  private toast = inject(ToastService);

  readonly foods = signal<Food[]>([]);
  readonly isLoading = signal<boolean>(false);

  async fetchFoods(category?: string, search?: string): Promise<void> {
    this.isLoading.set(true);
    try {
      const params: Record<string, string> = {};
      if (category && category !== 'All') params['category'] = category;
      if (search && search.trim()) params['search'] = search.trim();

      const res = await this.api.get<ApiResponse<{ foods: Food[] }>>('/foods', params);
      if (res.success && res.data?.foods) {
        this.foods.set(res.data.foods);
      }
    } catch (err: any) {
      const msg = err.error?.message || err.message || 'Failed to load food catalog';
      this.toast.error(msg);
    } finally {
      this.isLoading.set(false);
    }
  }

  async createFood(dto: CreateFoodDTO): Promise<boolean> {
    try {
      const res = await this.api.post<ApiResponse<{ food: Food }>>('/foods', dto);
      if (res.success && res.data?.food) {
        this.foods.update((list) => [res.data.food, ...list]);
        this.toast.success(`"${dto.name}" added to menu!`);
        return true;
      }
      return false;
    } catch (err: any) {
      const msg = err.error?.message || err.message || 'Failed to create food item';
      this.toast.error(msg);
      return false;
    }
  }

  async updateFood(id: string, dto: Partial<CreateFoodDTO>): Promise<boolean> {
    try {
      const res = await this.api.put<ApiResponse<{ food: Food }>>(`/foods/${id}`, dto);
      if (res.success && res.data?.food) {
        this.foods.update((list) =>
          list.map((f) => (f._id === id ? res.data.food : f))
        );
        this.toast.success(`"${dto.name || 'Food item'}" updated successfully`);
        return true;
      }
      return false;
    } catch (err: any) {
      const msg = err.error?.message || err.message || 'Failed to update food item';
      this.toast.error(msg);
      return false;
    }
  }

  async deleteFood(id: string): Promise<boolean> {
    try {
      const res = await this.api.delete<ApiResponse<any>>(`/foods/${id}`);
      if (res.success) {
        this.foods.update((list) => list.filter((f) => f._id !== id));
        this.toast.success('Food item removed from menu');
        return true;
      }
      return false;
    } catch (err: any) {
      const msg = err.error?.message || err.message || 'Failed to delete food item';
      this.toast.error(msg);
      return false;
    }
  }
}
