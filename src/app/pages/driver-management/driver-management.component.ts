import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DriverService } from '../../services/driver.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-driver-management',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page">
      <div class="page-header">
        <h1 class="page-title">Driver Management</h1>
        <p class="page-sub">Manage driver profiles, licenses, and assignments</p>
      </div>
      <div class="driver-grid">
        <div class="driver-card" *ngFor="let d of driverSvc.drivers()">
          <div class="dc-header">
            <div class="dc-avatar">{{ getInitials(d.operatorName) }}</div>
            <div>
              <div class="dc-name">{{ d.operatorName }}</div>
              <div class="dc-id">{{ d.driverId }}</div>
            </div>
            <span class="dc-badge" [class]="'dcb-' + d.status.toLowerCase().replace(' ', '-')">{{ d.status }}</span>
          </div>
          <div class="dc-body">
            <div class="dc-row"><span>Vehicle</span><strong>{{ d.vehicle }} • {{ d.licensePlate }}</strong></div>
            <div class="dc-row">
              <span>Route Progress</span>
              <div class="dp-bar-wrap">
                <div class="dp-bar"><div class="dp-fill" [style.width.%]="d.routeProgress"></div></div>
                <span>{{ d.routeProgress }}%</span>
              </div>
            </div>
            <div class="dc-row"><span>Efficiency</span><strong [class]="d.efficiency >= 90 ? 'text-green' : 'text-yellow'">{{ d.efficiency }}%</strong></div>
          </div>
          <div class="dc-footer">
            <button class="dc-btn" (click)="toast.info('Profile view coming soon', d.operatorName)">View Profile</button>
            <button class="dc-btn-del" (click)="remove(d.id, d.operatorName)">Remove</button>
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
    .driver-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 16px; }
    .driver-card {
      background: white;
      border-radius: 12px;
      box-shadow: 0 1px 4px rgba(0,0,0,0.06);
      overflow: hidden;
      transition: box-shadow 0.2s;
    }
    .driver-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.1); }
    .dc-header {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px;
      border-bottom: 1px solid #f1f4f8;
    }
    .dc-avatar {
      width: 42px;
      height: 42px;
      background: linear-gradient(135deg, #0f2140, #1a3a5c);
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 13px;
      font-weight: 700;
      flex-shrink: 0;
    }
    .dc-name { font-size: 14px; font-weight: 700; color: #0f2140; }
    .dc-id { font-size: 11px; color: #94a3b8; font-family: monospace; margin-top: 2px; }
    .dc-badge { margin-left: auto; font-size: 10px; font-weight: 700; padding: 3px 9px; border-radius: 10px; white-space: nowrap; }
    .dcb-active { background: #dcfce7; color: #15803d; }
    .dcb-at-rest { background: #fef9c3; color: #92400e; }
    .dcb-delayed { background: #fee2e2; color: #991b1b; }
    .dc-body { padding: 14px 16px; display: flex; flex-direction: column; gap: 10px; }
    .dc-row { display: flex; justify-content: space-between; align-items: center; font-size: 12px; color: #6b7280; }
    .dc-row strong { color: #1f2937; }
    .dp-bar-wrap { display: flex; align-items: center; gap: 8px; }
    .dp-bar { width: 80px; height: 5px; background: #e5e7eb; border-radius: 3px; overflow: hidden; }
    .dp-fill { height: 100%; background: #0f2140; border-radius: 3px; }
    .text-green { color: #059669; }
    .text-yellow { color: #d97706; }
    .dc-footer { display: flex; gap: 8px; padding: 12px 16px; border-top: 1px solid #f1f4f8; }
    .dc-btn {
      flex: 1;
      padding: 7px;
      border: 1.5px solid #e5e7eb;
      border-radius: 6px;
      background: white;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      color: #374151;
      transition: all 0.18s;
    }
    .dc-btn:hover { border-color: #0f2140; color: #0f2140; }
    .dc-btn-del {
      padding: 7px 14px;
      border: none;
      border-radius: 6px;
      background: #fee2e2;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      color: #dc2626;
      transition: all 0.18s;
    }
    .dc-btn-del:hover { background: #fecaca; }
  `]
})
export class DriverManagementComponent {
  constructor(public driverSvc: DriverService, public toast: ToastService) {}

  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }

  remove(id: string, name: string): void {
    this.driverSvc.delete(id);
    this.toast.warning(`${name} has been removed.`, 'Driver Removed');
  }
}
