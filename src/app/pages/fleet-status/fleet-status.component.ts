import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogComponent } from '../../components/dialog/dialog.component';
import { ToastService } from '../../services/toast.service';

export type VehicleStatus = 'Active' | 'Idle' | 'Maintenance' | 'Offline';

export interface Vehicle {
  id: string;
  vehicleId: string;
  model: string;
  driver: string;
  location: string;
  fuel: number;
  status: VehicleStatus;
  mileage: number;
  plate: string;
}

@Component({
  selector: 'app-fleet-status',
  standalone: true,
  imports: [CommonModule, FormsModule, DialogComponent],
  template: `
    <div class="page">
      <!-- Page Header -->
      <div class="page-header">
        <div>
          <h1 class="page-title">Fleet Status</h1>
          <p class="page-sub">Real-time vehicle health and location overview</p>
        </div>
        <button class="btn-primary" (click)="openAdd()">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Add Vehicle
        </button>
      </div>

      <!-- Summary Stats -->
      <div class="stats-row">
        <div class="stat-box" *ngFor="let s of summaryStats()">
          <div class="sb-left">
            <div class="sb-icon" [style.background]="s.bg">
              <svg [innerHTML]="s.icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"></svg>
            </div>
          </div>
          <div class="sb-right">
            <div class="sb-val">{{ s.value }}</div>
            <div class="sb-label">{{ s.label }}</div>
          </div>
        </div>
      </div>

      <!-- Vehicles Grid Table -->
      <div class="table-card">
        <div class="tc-header">
          <div>
            <h3 class="tc-title">All Vehicles</h3>
            <p class="tc-sub">{{ vehicles().length }} total vehicles registered</p>
          </div>
          <div class="tc-actions">
            <div class="search-wrap">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="si">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input class="search-in" placeholder="Search vehicles..." [(ngModel)]="searchQ" />
            </div>
            <select class="filter-sel" [(ngModel)]="filterStatus">
              <option value="">All Status</option>
              <option value="Active">Active</option>
              <option value="Idle">Idle</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Offline">Offline</option>
            </select>
          </div>
        </div>
        <div class="table-wrap">
          <table class="data-table">
            <thead>
              <tr>
                <th>VEHICLE ID</th>
                <th>MODEL</th>
                <th>DRIVER</th>
                <th>LOCATION</th>
                <th>FUEL</th>
                <th>MILEAGE</th>
                <th>STATUS</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let v of filtered()" class="data-row">
                <td><span class="mono-id">{{ v.vehicleId }}</span></td>
                <td>
                  <div class="model-cell">
                    <div class="model-icon">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h5l2 4v3h-7V8z"/>
                        <circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
                      </svg>
                    </div>
                    <div>
                      <div class="model-name">{{ v.model }}</div>
                      <div class="plate-text">{{ v.plate }}</div>
                    </div>
                  </div>
                </td>
                <td><span class="driver-name">{{ v.driver }}</span></td>
                <td>
                  <div class="loc-cell">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                    </svg>
                    {{ v.location }}
                  </div>
                </td>
                <td>
                  <div class="fuel-cell">
                    <div class="fuel-bar">
                      <div class="fuel-fill" [style.width.%]="v.fuel"
                        [style.background]="v.fuel > 50 ? '#10b981' : v.fuel > 25 ? '#f59e0b' : '#ef4444'"></div>
                    </div>
                    <span class="fuel-pct" [style.color]="v.fuel > 50 ? '#059669' : v.fuel > 25 ? '#d97706' : '#dc2626'">{{ v.fuel }}%</span>
                  </div>
                </td>
                <td><span class="mileage-text">{{ v.mileage.toLocaleString() }} km</span></td>
                <td>
                  <span class="status-pill" [class]="'sp-' + v.status.toLowerCase()">
                    <span class="sp-dot"></span>{{ v.status }}
                  </span>
                </td>
                <td>
                  <div class="act-btns">
                    <button class="act-btn edit-b" (click)="startEdit(v)" title="Edit">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                    </button>
                    <button class="act-btn del-b" (click)="remove(v)" title="Delete">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                        <path d="M10 11v6"/><path d="M14 11v6"/>
                        <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
              <tr *ngIf="filtered().length === 0">
                <td colspan="8" class="empty-row">
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" stroke-width="1.5">
                    <rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h5l2 4v3h-7V8z"/>
                  </svg>
                  <p>No vehicles found</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Add / Edit Dialog -->
    <app-dialog
      [open]="dialogOpen()"
      [title]="editingId() ? 'Edit Vehicle' : 'Add New Vehicle'"
      [subtitle]="editingId() ? 'Update vehicle information' : 'Register a new vehicle to the fleet'"
      maxWidth="680px"
      (closed)="closeDialog()"
    >
      <div class="form-grid">
        <div class="fg" [class.full]="false">
          <label>Vehicle Model *</label>
          <input [(ngModel)]="form.model" placeholder="e.g. Volvo FH16" class="fi" />
        </div>
        <div class="fg">
          <label>License Plate *</label>
          <input [(ngModel)]="form.plate" placeholder="e.g. 44-BB-92" class="fi" />
        </div>
        <div class="fg">
          <label>Assigned Driver *</label>
          <input [(ngModel)]="form.driver" placeholder="Driver full name" class="fi" />
        </div>
        <div class="fg">
          <label>Location</label>
          <input [(ngModel)]="form.location" placeholder="e.g. North District" class="fi" />
        </div>
        <div class="fg">
          <label>Fuel Level (%)</label>
          <input type="number" [(ngModel)]="form.fuel" min="0" max="100" class="fi" />
        </div>
        <div class="fg">
          <label>Mileage (km)</label>
          <input type="number" [(ngModel)]="form.mileage" min="0" class="fi" />
        </div>
        <div class="fg full">
          <label>Status</label>
          <div class="radio-group">
            <label class="radio-opt" *ngFor="let s of statusOptions">
              <input type="radio" [(ngModel)]="form.status" [value]="s.val" name="vstatus" />
              <span class="ro-label" [class]="'ro-' + s.val.toLowerCase()">{{ s.label }}</span>
            </label>
          </div>
        </div>
      </div>
      <div class="dialog-footer">
        <button class="btn-cancel" (click)="closeDialog()">Cancel</button>
        <button class="btn-submit" (click)="submit()">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          {{ editingId() ? 'Update Vehicle' : 'Add Vehicle' }}
        </button>
      </div>
    </app-dialog>
  `,
  styles: [`
    :host { display: block; }
    .page { padding: 28px; }
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
    .page-title { font-size: 22px; font-weight: 800; color: #0f2140; margin: 0 0 4px; }
    .page-sub { font-size: 13px; color: #94a3b8; margin: 0; }
    .btn-primary {
      display: flex; align-items: center; gap: 7px; padding: 10px 20px;
      background: linear-gradient(135deg, #0f2140, #1a3a5c); color: white;
      border: none; border-radius: 9px; font-size: 13px; font-weight: 700; cursor: pointer; transition: all 0.18s;
    }
    .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 4px 14px rgba(15,33,64,0.3); }
    .stats-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px; }
    .stat-box {
      background: white; border-radius: 12px; padding: 18px;
      display: flex; align-items: center; gap: 14px; box-shadow: 0 1px 4px rgba(0,0,0,0.06);
    }
    .sb-icon { width: 46px; height: 46px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .sb-val { font-size: 26px; font-weight: 800; color: #0f2140; }
    .sb-label { font-size: 12px; color: #94a3b8; margin-top: 2px; }
    .table-card { background: white; border-radius: 14px; box-shadow: 0 1px 4px rgba(0,0,0,0.06); overflow: hidden; }
    .tc-header { display: flex; justify-content: space-between; align-items: center; padding: 20px 24px; border-bottom: 1px solid #f1f4f8; flex-wrap: wrap; gap: 12px; }
    .tc-title { font-size: 16px; font-weight: 700; color: #0f2140; margin: 0 0 2px; }
    .tc-sub { font-size: 12px; color: #94a3b8; margin: 0; }
    .tc-actions { display: flex; gap: 10px; align-items: center; }
    .search-wrap { position: relative; }
    .si { position: absolute; left: 10px; top: 50%; transform: translateY(-50%); color: #9ca3af; pointer-events: none; }
    .search-in {
      padding: 8px 12px 8px 32px; border: 1.5px solid #e5e7eb; border-radius: 8px;
      font-size: 13px; color: #374151; background: #f9fafb; outline: none; width: 200px;
    }
    .search-in:focus { border-color: #0f2140; background: white; }
    .filter-sel {
      padding: 8px 12px; border: 1.5px solid #e5e7eb; border-radius: 8px;
      font-size: 13px; color: #374151; background: white; outline: none; cursor: pointer;
    }
    .table-wrap { overflow-x: auto; }
    .data-table { width: 100%; border-collapse: collapse; }
    .data-table th { padding: 11px 18px; text-align: left; font-size: 10.5px; font-weight: 700; color: #94a3b8; letter-spacing: 0.6px; border-bottom: 1px solid #f1f4f8; white-space: nowrap; }
    .data-row td { padding: 14px 18px; border-bottom: 1px solid #f8fafc; vertical-align: middle; }
    .data-row:last-child td { border-bottom: none; }
    .data-row:hover td { background: #f9fafb; }
    .mono-id { font-size: 12px; font-weight: 700; color: #64748b; font-family: monospace; }
    .model-cell { display: flex; align-items: center; gap: 10px; }
    .model-icon { width: 32px; height: 32px; background: #f1f4f8; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #64748b; flex-shrink: 0; }
    .model-name { font-size: 13px; font-weight: 600; color: #1f2937; }
    .plate-text { font-size: 11px; color: #94a3b8; font-family: monospace; margin-top: 1px; }
    .driver-name { font-size: 13px; color: #374151; font-weight: 500; }
    .loc-cell { display: flex; align-items: center; gap: 5px; font-size: 13px; color: #374151; }
    .fuel-cell { display: flex; align-items: center; gap: 8px; }
    .fuel-bar { width: 70px; height: 6px; background: #e5e7eb; border-radius: 3px; overflow: hidden; flex-shrink: 0; }
    .fuel-fill { height: 100%; border-radius: 3px; }
    .fuel-pct { font-size: 12px; font-weight: 700; }
    .mileage-text { font-size: 13px; color: #374151; }
    .status-pill { display: inline-flex; align-items: center; gap: 5px; padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 700; }
    .sp-dot { width: 6px; height: 6px; border-radius: 50%; }
    .sp-active { background: #dcfce7; color: #15803d; } .sp-active .sp-dot { background: #16a34a; }
    .sp-idle { background: #fef9c3; color: #92400e; } .sp-idle .sp-dot { background: #f59e0b; }
    .sp-maintenance { background: #fee2e2; color: #991b1b; } .sp-maintenance .sp-dot { background: #ef4444; }
    .sp-offline { background: #f3f4f6; color: #374151; } .sp-offline .sp-dot { background: #9ca3af; }
    .act-btns { display: flex; gap: 6px; }
    .act-btn { width: 30px; height: 30px; border: 1.5px solid #e5e7eb; border-radius: 6px; background: white; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.18s; }
    .edit-b { color: #3b82f6; } .edit-b:hover { background: #eff6ff; border-color: #bfdbfe; }
    .del-b { color: #ef4444; } .del-b:hover { background: #fef2f2; border-color: #fecaca; }
    .empty-row { text-align: center; padding: 48px !important; color: #9ca3af; }
    .empty-row p { margin-top: 8px; font-size: 14px; }

    /* Dialog form */
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px; }
    .fg { display: flex; flex-direction: column; gap: 6px; }
    .fg.full { grid-column: 1 / -1; }
    .fg label { font-size: 12px; font-weight: 700; color: #374151; }
    .fi {
      padding: 10px 12px; border: 1.5px solid #e5e7eb; border-radius: 8px;
      font-size: 13px; color: #1f2937; background: #fafafa; outline: none;
    }
    .fi:focus { border-color: #0f2140; background: white; box-shadow: 0 0 0 3px rgba(15,33,64,0.06); }
    .radio-group { display: flex; gap: 10px; flex-wrap: wrap; }
    .radio-opt { display: flex; align-items: center; gap: 6px; cursor: pointer; }
    .radio-opt input { width: 14px; height: 14px; accent-color: #0f2140; }
    .ro-label { font-size: 12px; font-weight: 600; padding: 4px 10px; border-radius: 6px; }
    .ro-active { background: #dcfce7; color: #15803d; }
    .ro-idle { background: #fef9c3; color: #92400e; }
    .ro-maintenance { background: #fee2e2; color: #991b1b; }
    .ro-offline { background: #f3f4f6; color: #374151; }
    .dialog-footer { display: flex; justify-content: flex-end; gap: 10px; padding-top: 16px; border-top: 1px solid #f1f4f8; }
    .btn-cancel {
      padding: 10px 20px; border: 1.5px solid #e5e7eb; border-radius: 8px;
      background: white; font-size: 13px; font-weight: 600; cursor: pointer; color: #374151;
    }
    .btn-cancel:hover { border-color: #d1d5db; background: #f9fafb; }
    .btn-submit {
      display: flex; align-items: center; gap: 7px; padding: 10px 22px;
      background: linear-gradient(135deg, #0f2140, #1a3a5c); color: white;
      border: none; border-radius: 8px; font-size: 13px; font-weight: 700; cursor: pointer; transition: all 0.18s;
    }
    .btn-submit:hover { box-shadow: 0 4px 12px rgba(15,33,64,0.3); }
  `]
})
export class FleetStatusComponent {
  dialogOpen = signal(false);
  editingId = signal<string | null>(null);
  searchQ = '';
  filterStatus = '';

  statusOptions = [
    { val: 'Active', label: 'Active' },
    { val: 'Idle', label: 'Idle' },
    { val: 'Maintenance', label: 'Maintenance' },
    { val: 'Offline', label: 'Offline' }
  ];

  form = this.emptyForm();

  vehicles = signal<Vehicle[]>([
    { id: '1', vehicleId: '#VH-001', model: 'Volvo FH16', driver: 'Jameson Miller', location: 'North District', fuel: 78, status: 'Active', mileage: 145200, plate: '44-BB-92' },
    { id: '2', vehicleId: '#VH-002', model: 'Isuzu NPR', driver: 'Leila Vance', location: 'City Center', fuel: 45, status: 'Idle', mileage: 89340, plate: '12-XZ-01' },
    { id: '3', vehicleId: '#VH-003', model: 'Scania R500', driver: 'Marcus Reid', location: 'East Route', fuel: 22, status: 'Active', mileage: 212500, plate: '09-RR-45' },
    { id: '4', vehicleId: '#VH-004', model: 'Mercedes Actros', driver: 'Sara Kim', location: 'Depot A', fuel: 90, status: 'Maintenance', mileage: 67800, plate: 'MX-45-TK' },
    { id: '5', vehicleId: '#VH-005', model: 'MAN TGX', driver: 'Ryan Patel', location: 'West Highway', fuel: 65, status: 'Active', mileage: 178900, plate: 'RY-78-PL' },
    { id: '6', vehicleId: '#VH-006', model: 'DAF XF', driver: 'Olivia Brown', location: 'South Zone', fuel: 55, status: 'Idle', mileage: 95600, plate: 'OB-23-DF' }
  ]);

  private counter = 7;

  constructor(private toast: ToastService) {}

  summaryStats() {
    const veh = this.vehicles();
    return [
      { value: veh.filter(v => v.status === 'Active').length, label: 'Active Vehicles', bg: '#dcfce7', icon: '<polyline points="20 6 9 17 4 12"/>' },
      { value: veh.filter(v => v.status === 'Idle').length, label: 'Idle Vehicles', bg: '#fef9c3', icon: '<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>' },
      { value: veh.filter(v => v.status === 'Maintenance').length, label: 'In Maintenance', bg: '#fee2e2', icon: '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/>' },
      { value: veh.length, label: 'Total Fleet', bg: '#dbeafe', icon: '<rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h5l2 4v3h-7V8z"/>' }
    ];
  }

  filtered() {
    return this.vehicles().filter(v => {
      const q = this.searchQ.toLowerCase();
      const matchQ = !q || v.model.toLowerCase().includes(q) || v.driver.toLowerCase().includes(q) || v.vehicleId.toLowerCase().includes(q) || v.location.toLowerCase().includes(q);
      const matchS = !this.filterStatus || v.status === this.filterStatus;
      return matchQ && matchS;
    });
  }

  openAdd(): void {
    this.editingId.set(null);
    this.form = this.emptyForm();
    this.dialogOpen.set(true);
  }

  startEdit(v: Vehicle): void {
    this.editingId.set(v.id);
    this.form = { model: v.model, plate: v.plate, driver: v.driver, location: v.location, fuel: v.fuel, mileage: v.mileage, status: v.status };
    this.dialogOpen.set(true);
  }

  submit(): void {
    if (!this.form.model.trim() || !this.form.plate.trim() || !this.form.driver.trim()) {
      this.toast.error('Please fill in all required fields.', 'Validation Error');
      return;
    }
    if (this.editingId()) {
      this.vehicles.update(vs => vs.map(v => v.id === this.editingId() ? { ...v, ...this.form } : v));
      this.toast.success(`${this.form.model} updated successfully.`, 'Vehicle Updated');
    } else {
      const id = String(Date.now());
      const vehicleId = `#VH-00${++this.counter}`;
      this.vehicles.update(vs => [...vs, { id, vehicleId, ...this.form }]);
      this.toast.success(`${this.form.model} added to the fleet.`, 'Vehicle Added');
    }
    this.closeDialog();
  }

  remove(v: Vehicle): void {
    this.vehicles.update(vs => vs.filter(x => x.id !== v.id));
    this.toast.warning(`${v.model} (${v.plate}) removed from fleet.`, 'Vehicle Removed');
  }

  closeDialog(): void {
    this.dialogOpen.set(false);
    this.editingId.set(null);
  }

  private emptyForm() {
    return { model: '', plate: '', driver: '', location: '', fuel: 100, mileage: 0, status: 'Active' as VehicleStatus };
  }
}
