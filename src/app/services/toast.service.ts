import { Injectable, signal } from '@angular/core';

export interface ToastMessage {
  id: number;
  text: string;
  type: 'success' | 'error' | 'info';
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private counter = 0;
  readonly toasts = signal<ToastMessage[]>([]);

  show(text: string, type: 'success' | 'error' | 'info' = 'info', duration = 3500): void {
    const id = ++this.counter;
    this.toasts.update((current) => [...current, { id, text, type }]);

    setTimeout(() => {
      this.dismiss(id);
    }, duration);
  }

  success(text: string, duration = 3500): void {
    this.show(text, 'success', duration);
  }

  error(text: string, duration = 4500): void {
    this.show(text, 'error', duration);
  }

  info(text: string, duration = 3500): void {
    this.show(text, 'info', duration);
  }

  dismiss(id: number): void {
    this.toasts.update((current) => current.filter((t) => t.id !== id));
  }
}
