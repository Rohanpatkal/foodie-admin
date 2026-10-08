import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container" *ngIf="toastService.toasts().length > 0">
      <div
        *ngFor="let toast of toastService.toasts()"
        class="toast"
        [ngClass]="'toast-' + toast.type"
        (click)="toastService.dismiss(toast.id)"
      >
        <span>{{ toast.text }}</span>
        <button class="toast-close" (click)="toastService.dismiss(toast.id)">&times;</button>
      </div>
    </div>
  `,
  styles: [
    `
      .toast-close {
        background: transparent;
        border: none;
        color: inherit;
        font-size: 18px;
        line-height: 1;
        cursor: pointer;
        opacity: 0.7;
        margin-left: 8px;
      }
      .toast-close:hover {
        opacity: 1;
      }
    `,
  ],
})
export class ToastComponent {
  toastService = inject(ToastService);
}
