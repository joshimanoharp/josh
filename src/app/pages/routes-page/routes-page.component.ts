import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-routes-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page">
      <div class="page-header">
        <h1 class="page-title">Routes</h1>
        <p class="page-sub">Active and planned delivery routes</p>
      </div>
      <div class="routes-list">
        <div class="route-card" *ngFor="let r of routes">
          <div class="route-left">
            <div class="route-num">{{ r.id }}</div>
            <div>
              <div class="route-name">{{ r.name }}</div>
              <div class="route-meta">{{ r.stops }} stops · {{ r.distance }}</div>
            </div>
          </div>
          <div class="route-center">
            <div class="route-progress-wrap">
              <div class="rp-bar"><div class="rp-fill" [style.width.%]="r.progress" [style.background]="r.progress === 100 ? '#10b981' : '#0f2140'"></div></div>
              <span class="rp-pct">{{ r.progress }}%</span>
            </div>
          </div>
          <div class="route-right">
            <span class="route-badge" [class]="'rb-' + r.status.toLowerCase().replace(' ', '-')">{{ r.status }}</span>
            <span class="route-eta">ETA {{ r.eta }}</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page { padding: 28px; }
    .page-header { margin-bottom: 24px; }
    .page-title { font-size: 22px; font-weight: 800; color: #0f2140; margin: 0 0 4px; }
    .page-sub { font-size: 13px; color: #94a3b8; margin: 0; }
    .routes-list { display: flex; flex-direction: column; gap: 12px; }
    .route-card {
      background: white;
      border-radius: 12px;
      padding: 16px 20px;
      display: flex;
      align-items: center;
      gap: 24px;
      box-shadow: 0 1px 4px rgba(0,0,0,0.06);
      transition: box-shadow 0.2s;
    }
    .route-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.08); }
    .route-left { display: flex; align-items: center; gap: 14px; width: 300px; flex-shrink: 0; }
    .route-num {
      width: 42px;
      height: 42px;
      background: #f1f4f8;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 11px;
      font-weight: 700;
      color: #64748b;
      font-family: monospace;
    }
    .route-name { font-size: 14px; font-weight: 700; color: #1f2937; }
    .route-meta { font-size: 12px; color: #94a3b8; margin-top: 2px; }
    .route-center { flex: 1; }
    .route-progress-wrap { display: flex; align-items: center; gap: 10px; }
    .rp-bar { flex: 1; height: 7px; background: #e5e7eb; border-radius: 4px; overflow: hidden; }
    .rp-fill { height: 100%; border-radius: 4px; transition: width 0.3s; }
    .rp-pct { font-size: 12px; font-weight: 700; color: #374151; width: 36px; }
    .route-right { display: flex; flex-direction: column; align-items: flex-end; gap: 5px; flex-shrink: 0; }
    .route-badge { font-size: 10px; font-weight: 700; padding: 3px 9px; border-radius: 10px; letter-spacing: 0.3px; }
    .rb-on-schedule { background: #dcfce7; color: #15803d; }
    .rb-delayed { background: #fee2e2; color: #991b1b; }
    .rb-completed { background: #dbeafe; color: #1e40af; }
    .route-eta { font-size: 11px; color: #94a3b8; }
  `]
})
export class RoutesPageComponent {
  routes = [
    { id: 'RT-01', name: 'North District Loop', stops: 12, distance: '87 km', progress: 72, status: 'On Schedule', eta: '14:30' },
    { id: 'RT-02', name: 'City Center Express', stops: 8, distance: '45 km', progress: 100, status: 'Completed', eta: '12:15' },
    { id: 'RT-03', name: 'East Industrial Zone', stops: 15, distance: '120 km', progress: 34, status: 'Delayed', eta: '17:45' },
    { id: 'RT-04', name: 'South Suburbs Route', stops: 10, distance: '65 km', progress: 88, status: 'On Schedule', eta: '15:20' },
    { id: 'RT-05', name: 'West Highway Corridor', stops: 6, distance: '55 km', progress: 50, status: 'On Schedule', eta: '16:00' },
    { id: 'RT-06', name: 'Airport Freight Route', stops: 4, distance: '38 km', progress: 100, status: 'Completed', eta: '11:00' }
  ];
}
