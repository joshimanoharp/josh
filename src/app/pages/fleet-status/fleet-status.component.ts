import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-fleet-status',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page">
      <div class="page-header">
        <h1 class="page-title">Fleet Status</h1>
        <p class="page-sub">Real-time vehicle and fleet health overview</p>
      </div>
      <div class="stats-row">
        <div class="stat-box" *ngFor="let s of stats">
          <div class="stat-box-icon" [style.background]="s.bg">
            <span [innerHTML]="s.icon"></span>
          </div>
          <div>
            <div class="stat-box-val">{{ s.value }}</div>
            <div class="stat-box-label">{{ s.label }}</div>
          </div>
        </div>
      </div>
      <div class="info-card">
        <div class="info-grid">
          <div class="vehicle-item" *ngFor="let v of vehicles">
            <div class="vi-header">
              <div class="vi-id">{{ v.id }}</div>
              <span class="vi-badge" [class]="'vi-' + v.status.toLowerCase()">{{ v.status }}</span>
            </div>
            <div class="vi-body">
              <div class="vi-row"><span>Vehicle:</span><strong>{{ v.model }}</strong></div>
              <div class="vi-row"><span>Driver:</span><strong>{{ v.driver }}</strong></div>
              <div class="vi-row"><span>Location:</span><strong>{{ v.location }}</strong></div>
              <div class="vi-row"><span>Fuel:</span>
                <div class="fuel-bar-wrap">
                  <div class="fuel-bar"><div class="fuel-fill" [style.width]="v.fuel + '%'" [style.background]="v.fuel > 50 ? '#10b981' : v.fuel > 25 ? '#f59e0b' : '#ef4444'"></div></div>
                  <span>{{ v.fuel }}%</span>
                </div>
              </div>
            </div>
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
    .stats-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px; }
    .stat-box {
      background: white;
      border-radius: 12px;
      padding: 18px;
      display: flex;
      align-items: center;
      gap: 14px;
      box-shadow: 0 1px 4px rgba(0,0,0,0.06);
    }
    .stat-box-icon {
      width: 44px;
      height: 44px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      flex-shrink: 0;
    }
    .stat-box-val { font-size: 24px; font-weight: 800; color: #0f2140; }
    .stat-box-label { font-size: 12px; color: #94a3b8; margin-top: 1px; }
    .info-card { background: white; border-radius: 14px; padding: 20px; box-shadow: 0 1px 4px rgba(0,0,0,0.06); }
    .info-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
    .vehicle-item { border: 1.5px solid #f1f4f8; border-radius: 10px; overflow: hidden; }
    .vi-header { display: flex; justify-content: space-between; align-items: center; padding: 10px 14px; background: #f8fafc; border-bottom: 1px solid #f1f4f8; }
    .vi-id { font-size: 12px; font-weight: 700; color: #64748b; font-family: monospace; }
    .vi-badge { font-size: 10px; font-weight: 700; padding: 3px 8px; border-radius: 10px; letter-spacing: 0.3px; }
    .vi-active { background: #dcfce7; color: #15803d; }
    .vi-maintenance { background: #fee2e2; color: #991b1b; }
    .vi-idle { background: #fef9c3; color: #92400e; }
    .vi-body { padding: 12px 14px; display: flex; flex-direction: column; gap: 8px; }
    .vi-row { display: flex; justify-content: space-between; align-items: center; font-size: 12px; color: #6b7280; }
    .vi-row strong { color: #1f2937; }
    .fuel-bar-wrap { display: flex; align-items: center; gap: 8px; }
    .fuel-bar { width: 70px; height: 5px; background: #e5e7eb; border-radius: 3px; overflow: hidden; }
    .fuel-fill { height: 100%; border-radius: 3px; transition: width 0.3s; }
  `]
})
export class FleetStatusComponent {
  stats = [
    { value: '142', label: 'Active Units', icon: '🚛', bg: '#dbeafe' },
    { value: '8', label: 'In Maintenance', icon: '🔧', bg: '#fee2e2' },
    { value: '23', label: 'Idle', icon: '⏸️', bg: '#fef9c3' },
    { value: '94.2%', label: 'Fleet Utilization', icon: '📊', bg: '#dcfce7' }
  ];

  vehicles = [
    { id: '#VH-001', model: 'Volvo FH16', driver: 'Jameson Miller', location: 'North District', fuel: 78, status: 'Active' },
    { id: '#VH-002', model: 'Isuzu NPR', driver: 'Leila Vance', location: 'City Center', fuel: 45, status: 'Idle' },
    { id: '#VH-003', model: 'Scania R500', driver: 'Marcus Reid', location: 'East Route', fuel: 22, status: 'Active' },
    { id: '#VH-004', model: 'Mercedes Actros', driver: 'Sara Kim', location: 'Depot A', fuel: 90, status: 'Maintenance' },
    { id: '#VH-005', model: 'MAN TGX', driver: 'Ryan Patel', location: 'West Highway', fuel: 65, status: 'Active' },
    { id: '#VH-006', model: 'DAF XF', driver: 'Olivia Brown', location: 'South Zone', fuel: 55, status: 'Idle' }
  ];
}
