import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container">
      <div
        *ngFor="let t of toast.toasts()"
        class="toast"
        [class]="'toast-' + t.type"
        (click)="toast.remove(t.id)"
      >
        <div class="toast-icon">
          <svg *ngIf="t.type === 'success'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          <svg *ngIf="t.type === 'error'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
          </svg>
          <svg *ngIf="t.type === 'warning'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
          <svg *ngIf="t.type === 'info'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        </div>
        <div class="toast-content">
          <div *ngIf="t.title" class="toast-title">{{ t.title }}</div>
          <div class="toast-message">{{ t.message }}</div>
        </div>
        <button class="toast-close" (click)="toast.remove(t.id)">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 10px;
      max-width: 360px;
    }
    .toast {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 14px 16px;
      border-radius: 10px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.15);
      cursor: pointer;
      animation: slideIn 0.3s ease;
      border-left: 4px solid transparent;
      background: white;
      min-width: 280px;
    }
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    .toast-success { border-left-color: #10b981; }
    .toast-success .toast-icon { color: #10b981; }
    .toast-error { border-left-color: #ef4444; }
    .toast-error .toast-icon { color: #ef4444; }
    .toast-warning { border-left-color: #f59e0b; }
    .toast-warning .toast-icon { color: #f59e0b; }
    .toast-info { border-left-color: #3b82f6; }
    .toast-info .toast-icon { color: #3b82f6; }
    .toast-icon { flex-shrink: 0; margin-top: 1px; }
    .toast-content { flex: 1; min-width: 0; }
    .toast-title {
      font-size: 13px;
      font-weight: 700;
      color: #111827;
      margin-bottom: 2px;
    }
    .toast-message { font-size: 13px; color: #374151; line-height: 1.4; }
    .toast-close {
      background: none;
      border: none;
      cursor: pointer;
      color: #9ca3af;
      padding: 0;
      flex-shrink: 0;
      display: flex;
      align-items: center;
    }
    .toast-close:hover { color: #374151; }
  `]
})
export class ToastComponent {
  constructor(public toast: ToastService) {}
}
