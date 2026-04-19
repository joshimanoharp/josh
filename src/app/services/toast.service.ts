import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: number;
  message: string;
  type: ToastType;
  title?: string;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  toasts = signal<Toast[]>([]);
  private counter = 0;

  show(message: string, type: ToastType = 'info', title?: string): void {
    const id = ++this.counter;
    this.toasts.update(t => [...t, { id, message, type, title }]);
    setTimeout(() => this.remove(id), 4000);
  }

  success(message: string, title = 'Success') { this.show(message, 'success', title); }
  error(message: string, title = 'Error') { this.show(message, 'error', title); }
  warning(message: string, title = 'Warning') { this.show(message, 'warning', title); }
  info(message: string, title = 'Info') { this.show(message, 'info', title); }

  remove(id: number): void {
    this.toasts.update(t => t.filter(x => x.id !== id));
  }
}
