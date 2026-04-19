import { Component, Input, Output, EventEmitter, ContentChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="overlay" *ngIf="open" (click)="onOverlayClick($event)">
      <div class="dialog" [style.maxWidth]="maxWidth" (click)="$event.stopPropagation()">
        <div class="dialog-header">
          <div class="dialog-title-wrap">
            <div class="dialog-icon" *ngIf="icon" [innerHTML]="icon"></div>
            <div>
              <h2 class="dialog-title">{{ title }}</h2>
              <p class="dialog-sub" *ngIf="subtitle">{{ subtitle }}</p>
            </div>
          </div>
          <button class="dialog-close" (click)="closed.emit()">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <div class="dialog-body">
          <ng-content />
        </div>
      </div>
    </div>
  `,
  styles: [`
    .overlay {
      position: fixed;
      inset: 0;
      background: rgba(10,22,40,0.55);
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      backdrop-filter: blur(2px);
      animation: fadeIn 0.18s ease;
    }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    .dialog {
      background: white;
      border-radius: 16px;
      width: 100%;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 24px 64px rgba(0,0,0,0.22);
      animation: slideUp 0.22s ease;
    }
    @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
    .dialog-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      padding: 22px 24px 18px;
      border-bottom: 1px solid #f1f4f8;
      position: sticky;
      top: 0;
      background: white;
      z-index: 1;
    }
    .dialog-title-wrap { display: flex; align-items: center; gap: 12px; }
    .dialog-icon {
      width: 40px;
      height: 40px;
      background: #f1f4f8;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .dialog-title { font-size: 17px; font-weight: 800; color: #0f2140; margin: 0; }
    .dialog-sub { font-size: 12px; color: #94a3b8; margin: 3px 0 0; }
    .dialog-close {
      background: none;
      border: none;
      cursor: pointer;
      color: #9ca3af;
      padding: 4px;
      border-radius: 6px;
      display: flex;
      transition: all 0.18s;
      flex-shrink: 0;
    }
    .dialog-close:hover { background: #fee2e2; color: #ef4444; }
    .dialog-body { padding: 24px; }
  `]
})
export class DialogComponent {
  @Input() open = false;
  @Input() title = '';
  @Input() subtitle = '';
  @Input() icon = '';
  @Input() maxWidth = '640px';
  @Output() closed = new EventEmitter<void>();

  onOverlayClick(e: MouseEvent): void {
    this.closed.emit();
  }
}
