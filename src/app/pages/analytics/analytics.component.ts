import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page">
      <div class="page-header">
        <h1 class="page-title">Analytics</h1>
        <p class="page-sub">Performance metrics and fleet analytics</p>
      </div>
      <div class="analytics-grid">
        <div class="an-card" *ngFor="let m of metrics">
          <div class="an-label">{{ m.label }}</div>
          <div class="an-value" [style.color]="m.color">{{ m.value }}</div>
          <div class="an-trend" [class]="m.up ? 'up' : 'down'">
            <span>{{ m.up ? '▲' : '▼' }}</span>{{ m.change }} vs last month
          </div>
          <div class="an-sparkline">
            <svg viewBox="0 0 160 50">
              <polyline [attr.points]="m.points" fill="none" [attr.stroke]="m.color" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" opacity="0.7"/>
            </svg>
          </div>
        </div>
      </div>
      <div class="bar-section">
        <h3 class="section-title">Weekly Deliveries</h3>
        <div class="bar-chart-wrap">
          <div class="bar-item" *ngFor="let b of weeklyBars">
            <div class="bar-col">
              <div class="bar-fill" [style.height.%]="b.pct" [style.background]="b.active ? '#0f2140' : '#c7d2fe'"></div>
            </div>
            <div class="bar-day">{{ b.day }}</div>
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
    .analytics-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px; }
    .an-card {
      background: white;
      border-radius: 12px;
      padding: 18px;
      box-shadow: 0 1px 4px rgba(0,0,0,0.06);
    }
    .an-label { font-size: 11px; color: #94a3b8; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase; margin-bottom: 8px; }
    .an-value { font-size: 28px; font-weight: 800; margin-bottom: 6px; }
    .an-trend { font-size: 12px; font-weight: 600; }
    .an-trend.up { color: #10b981; }
    .an-trend.down { color: #ef4444; }
    .an-sparkline svg { width: 100%; height: 50px; margin-top: 10px; }
    .bar-section {
      background: white;
      border-radius: 14px;
      padding: 20px;
      box-shadow: 0 1px 4px rgba(0,0,0,0.06);
    }
    .section-title { font-size: 15px; font-weight: 700; color: #0f2140; margin: 0 0 16px; }
    .bar-chart-wrap {
      display: flex;
      align-items: flex-end;
      gap: 14px;
      height: 140px;
      padding-bottom: 28px;
      position: relative;
    }
    .bar-item { display: flex; flex-direction: column; align-items: center; flex: 1; height: 100%; }
    .bar-col { flex: 1; width: 100%; display: flex; align-items: flex-end; }
    .bar-fill { width: 100%; border-radius: 4px 4px 0 0; min-height: 4px; transition: height 0.3s; }
    .bar-day { font-size: 11px; color: #94a3b8; font-weight: 600; margin-top: 6px; }
  `]
})
export class AnalyticsComponent {
  metrics = [
    { label: 'Total Deliveries', value: '2,847', color: '#0f2140', up: true, change: '+12%', points: '0,40 26,32 52,35 78,20 104,28 130,15 160,10' },
    { label: 'On-Time Rate', value: '94.2%', color: '#10b981', up: true, change: '+2.1%', points: '0,38 26,28 52,32 78,18 104,22 130,12 160,8' },
    { label: 'Fuel Cost/km', value: '$0.42', color: '#f59e0b', up: false, change: '-5.3%', points: '0,15 26,22 52,18 78,30 104,25 130,38 160,35' },
    { label: 'Avg Response Time', value: '8.3 min', color: '#3b82f6', up: true, change: '+0.8%', points: '0,42 26,35 52,38 78,25 104,30 130,18 160,15' }
  ];

  weeklyBars = [
    { day: 'Mon', pct: 65, active: false },
    { day: 'Tue', pct: 80, active: false },
    { day: 'Wed', pct: 72, active: false },
    { day: 'Thu', pct: 90, active: false },
    { day: 'Fri', pct: 100, active: true },
    { day: 'Sat', pct: 58, active: false },
    { day: 'Sun', pct: 40, active: false }
  ];
}
