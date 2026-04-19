import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogComponent } from '../../components/dialog/dialog.component';
import { ToastService } from '../../services/toast.service';

export type DriverStatus = 'Active' | 'Off Duty' | 'On Leave' | 'Suspended';

export interface DriverRecord {
  id: string;
  driverId: string;
  name: string;
  license: string;
  phone: string;
  vehicle: string;
  location: string;
  status: DriverStatus;
  joinDate: string;
  trips: number;
  rating: number;
}

@Component({
  selector: 'app-driver-management',
  standalone: true,
  imports: [CommonModule, FormsModule, DialogComponent],
  template: `
    <div class="page">
      <div class="page-header">
        <div>
          <h1 class="page-title">Driver Management</h1>
          <p class="page-sub">Manage driver profiles, licenses, and assignments</p>
        </div>
        <button class="btn-primary" (click)="openAdd()">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Add Driver
        </button>
      </div>

      <!-- Stats -->
      <div class="stats-row">
        <div class="stat-box" *ngFor="let s of stats()">
          <div class="sb-icon" [style.background]="s.bg">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" [innerHTML]="s.icon"></svg>
          </div>
          <div>
            <div class="sb-val">{{ s.value }}</div>
            <div class="sb-label">{{ s.label }}</div>
          </div>
        </div>
      </div>

      <!-- Table -->
      <div class="table-card">
        <div class="tc-header">
          <div>
            <h3 class="tc-title">All Drivers</h3>
            <p class="tc-sub">{{ drivers().length }} registered drivers</p>
          </div>
          <div class="tc-actions">
            <div class="search-wrap">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="si">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input class="search-in" placeholder="Search drivers..." [(ngModel)]="searchQ" />
            </div>
            <select class="filter-sel" [(ngModel)]="filterStatus">
              <option value="">All Status</option>
              <option value="Active">Active</option>
              <option value="Off Duty">Off Duty</option>
              <option value="On Leave">On Leave</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>
        </div>
        <div class="table-wrap">
          <table class="data-table">
            <thead>
              <tr>
                <th>DRIVER ID</th>
                <th>DRIVER</th>
                <th>LICENSE</th>
                <th>PHONE</th>
                <th>VEHICLE</th>
                <th>LOCATION</th>
                <th>TRIPS</th>
                <th>RATING</th>
                <th>STATUS</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let d of filtered()" class="data-row">
                <td><span class="mono-id">{{ d.driverId }}</span></td>
                <td>
                  <div class="name-cell">
                    <div class="avatar">{{ initials(d.name) }}</div>
                    <div>
                      <div class="drv-name">{{ d.name }}</div>
                      <div class="drv-join">Since {{ d.joinDate }}</div>
                    </div>
                  </div>
                </td>
                <td><span class="mono-id">{{ d.license }}</span></td>
                <td><span class="phone-text">{{ d.phone }}</span></td>
                <td><span class="vehicle-text">{{ d.vehicle }}</span></td>
                <td>
                  <div class="loc-cell">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                    </svg>
                    {{ d.location }}
                  </div>
                </td>
                <td><strong class="trips-num">{{ d.trips }}</strong></td>
                <td>
                  <div class="rating-cell">
                    <span class="stars">{{ starStr(d.rating) }}</span>
                    <span class="rating-num">{{ d.rating.toFixed(1) }}</span>
                  </div>
                </td>
                <td>
                  <span class="status-pill" [class]="'sp-' + d.status.toLowerCase().replace(' ', '-')">
                    <span class="sp-dot"></span>{{ d.status }}
                  </span>
                </td>
                <td>
                  <div class="act-btns">
                    <button class="act-btn edit-b" (click)="startEdit(d)" title="Edit">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                    </button>
                    <button class="act-btn del-b" (click)="remove(d)" title="Delete">
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
                <td colspan="10" class="empty-row">
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" stroke-width="1.5">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                  </svg>
                  <p>No drivers found</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Dialog -->
    <app-dialog
      [open]="dialogOpen()"
      [title]="editingId() ? 'Edit Driver' : 'Add New Driver'"
      [subtitle]="editingId() ? 'Update driver profile' : 'Register a new driver to the system'"
      maxWidth="700px"
      (closed)="closeDialog()"
    >
      <div class="form-grid">
        <div class="fg">
          <label>Full Name *</label>
          <input [(ngModel)]="form.name" placeholder="Driver full name" class="fi" />
        </div>
        <div class="fg">
          <label>License Number *</label>
          <input [(ngModel)]="form.license" placeholder="e.g. DL-2024-00123" class="fi" />
        </div>
        <div class="fg">
          <label>Phone Number</label>
          <input [(ngModel)]="form.phone" placeholder="e.g. +1 555-0123" class="fi" />
        </div>
        <div class="fg">
          <label>Assigned Vehicle</label>
          <input [(ngModel)]="form.vehicle" placeholder="e.g. Volvo FH16 • 44-BB-92" class="fi" />
        </div>
        <div class="fg">
          <label>Current Location</label>
          <input [(ngModel)]="form.location" placeholder="e.g. North District" class="fi" />
        </div>
        <div class="fg">
          <label>Join Date</label>
          <input type="date" [(ngModel)]="form.joinDate" class="fi" />
        </div>
        <div class="fg">
          <label>Total Trips</label>
          <input type="number" [(ngModel)]="form.trips" min="0" class="fi" />
        </div>
        <div class="fg">
          <label>Rating (0-5)</label>
          <input type="number" [(ngModel)]="form.rating" min="0" max="5" step="0.1" class="fi" />
        </div>
        <div class="fg full">
          <label>Status</label>
          <div class="radio-group">
            <label class="radio-opt" *ngFor="let s of statusOptions">
              <input type="radio" [(ngModel)]="form.status" [value]="s.val" name="dstatus" />
              <span class="ro-label" [class]="'ro-' + s.val.toLowerCase().replace(' ', '-')">{{ s.label }}</span>
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
          {{ editingId() ? 'Update Driver' : 'Add Driver' }}
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
    .btn-primary { display: flex; align-items: center; gap: 7px; padding: 10px 20px; background: linear-gradient(135deg, #0f2140, #1a3a5c); color: white; border: none; border-radius: 9px; font-size: 13px; font-weight: 700; cursor: pointer; transition: all 0.18s; }
    .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 4px 14px rgba(15,33,64,0.3); }
    .stats-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px; }
    .stat-box { background: white; border-radius: 12px; padding: 18px; display: flex; align-items: center; gap: 14px; box-shadow: 0 1px 4px rgba(0,0,0,0.06); }
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
    .search-in { padding: 8px 12px 8px 32px; border: 1.5px solid #e5e7eb; border-radius: 8px; font-size: 13px; color: #374151; background: #f9fafb; outline: none; width: 200px; }
    .search-in:focus { border-color: #0f2140; background: white; }
    .filter-sel { padding: 8px 12px; border: 1.5px solid #e5e7eb; border-radius: 8px; font-size: 13px; color: #374151; background: white; outline: none; cursor: pointer; }
    .table-wrap { overflow-x: auto; }
    .data-table { width: 100%; border-collapse: collapse; }
    .data-table th { padding: 11px 16px; text-align: left; font-size: 10.5px; font-weight: 700; color: #94a3b8; letter-spacing: 0.6px; border-bottom: 1px solid #f1f4f8; white-space: nowrap; }
    .data-row td { padding: 13px 16px; border-bottom: 1px solid #f8fafc; vertical-align: middle; }
    .data-row:last-child td { border-bottom: none; }
    .data-row:hover td { background: #f9fafb; }
    .mono-id { font-size: 11px; font-weight: 700; color: #64748b; font-family: monospace; }
    .name-cell { display: flex; align-items: center; gap: 10px; }
    .avatar { width: 36px; height: 36px; background: linear-gradient(135deg, #0f2140, #1a3a5c); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; flex-shrink: 0; }
    .drv-name { font-size: 13px; font-weight: 600; color: #1f2937; }
    .drv-join { font-size: 11px; color: #94a3b8; }
    .phone-text { font-size: 12px; color: #374151; }
    .vehicle-text { font-size: 12px; color: #374151; }
    .loc-cell { display: flex; align-items: center; gap: 5px; font-size: 12px; color: #374151; }
    .trips-num { font-size: 14px; color: #0f2140; }
    .rating-cell { display: flex; align-items: center; gap: 5px; }
    .stars { font-size: 13px; color: #f59e0b; letter-spacing: -1px; }
    .rating-num { font-size: 12px; font-weight: 700; color: #374151; }
    .status-pill { display: inline-flex; align-items: center; gap: 5px; padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 700; white-space: nowrap; }
    .sp-dot { width: 6px; height: 6px; border-radius: 50%; }
    .sp-active { background: #dcfce7; color: #15803d; } .sp-active .sp-dot { background: #16a34a; }
    .sp-off-duty { background: #f3f4f6; color: #374151; } .sp-off-duty .sp-dot { background: #9ca3af; }
    .sp-on-leave { background: #fef9c3; color: #92400e; } .sp-on-leave .sp-dot { background: #f59e0b; }
    .sp-suspended { background: #fee2e2; color: #991b1b; } .sp-suspended .sp-dot { background: #ef4444; }
    .act-btns { display: flex; gap: 6px; }
    .act-btn { width: 30px; height: 30px; border: 1.5px solid #e5e7eb; border-radius: 6px; background: white; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.18s; }
    .edit-b { color: #3b82f6; } .edit-b:hover { background: #eff6ff; border-color: #bfdbfe; }
    .del-b { color: #ef4444; } .del-b:hover { background: #fef2f2; border-color: #fecaca; }
    .empty-row { text-align: center; padding: 48px !important; color: #9ca3af; }
    .empty-row p { margin-top: 8px; font-size: 14px; }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px; }
    .fg { display: flex; flex-direction: column; gap: 6px; }
    .fg.full { grid-column: 1 / -1; }
    .fg label { font-size: 12px; font-weight: 700; color: #374151; }
    .fi { padding: 10px 12px; border: 1.5px solid #e5e7eb; border-radius: 8px; font-size: 13px; color: #1f2937; background: #fafafa; outline: none; }
    .fi:focus { border-color: #0f2140; background: white; box-shadow: 0 0 0 3px rgba(15,33,64,0.06); }
    .radio-group { display: flex; gap: 10px; flex-wrap: wrap; }
    .radio-opt { display: flex; align-items: center; gap: 6px; cursor: pointer; }
    .radio-opt input { width: 14px; height: 14px; accent-color: #0f2140; }
    .ro-label { font-size: 12px; font-weight: 600; padding: 4px 10px; border-radius: 6px; }
    .ro-active { background: #dcfce7; color: #15803d; }
    .ro-off-duty { background: #f3f4f6; color: #374151; }
    .ro-on-leave { background: #fef9c3; color: #92400e; }
    .ro-suspended { background: #fee2e2; color: #991b1b; }
    .dialog-footer { display: flex; justify-content: flex-end; gap: 10px; padding-top: 16px; border-top: 1px solid #f1f4f8; }
    .btn-cancel { padding: 10px 20px; border: 1.5px solid #e5e7eb; border-radius: 8px; background: white; font-size: 13px; font-weight: 600; cursor: pointer; color: #374151; }
    .btn-cancel:hover { border-color: #d1d5db; background: #f9fafb; }
    .btn-submit { display: flex; align-items: center; gap: 7px; padding: 10px 22px; background: linear-gradient(135deg, #0f2140, #1a3a5c); color: white; border: none; border-radius: 8px; font-size: 13px; font-weight: 700; cursor: pointer; }
    .btn-submit:hover { box-shadow: 0 4px 12px rgba(15,33,64,0.3); }
  `]
})
export class DriverManagementComponent {
  dialogOpen = signal(false);
  editingId = signal<string | null>(null);
  searchQ = '';
  filterStatus = '';

  statusOptions = [
    { val: 'Active', label: 'Active' },
    { val: 'Off Duty', label: 'Off Duty' },
    { val: 'On Leave', label: 'On Leave' },
    { val: 'Suspended', label: 'Suspended' }
  ];

  form = this.emptyForm();

  drivers = signal<DriverRecord[]>([
    { id: '1', driverId: '#DRV-8901', name: 'Jameson Miller', license: 'DL-2020-00123', phone: '+1 555-0101', vehicle: 'Volvo FH16 • 44-BB-92', location: 'North District', status: 'Active', joinDate: '2020-03-15', trips: 847, rating: 4.8 },
    { id: '2', driverId: '#DRV-7723', name: 'Leila Vance', license: 'DL-2021-00456', phone: '+1 555-0102', vehicle: 'Isuzu NPR • 12-XZ-01', location: 'City Center', status: 'Off Duty', joinDate: '2021-06-01', trips: 612, rating: 4.6 },
    { id: '3', driverId: '#DRV-6651', name: 'Marcus Reid', license: 'DL-2019-00789', phone: '+1 555-0103', vehicle: 'Scania R500 • 09-RR-45', location: 'East Route', status: 'Active', joinDate: '2019-11-20', trips: 1204, rating: 4.2 },
    { id: '4', driverId: '#DRV-5532', name: 'Sara Kim', license: 'DL-2022-00321', phone: '+1 555-0104', vehicle: 'Mercedes Actros • MX-45-TK', location: 'Depot A', status: 'On Leave', joinDate: '2022-01-10', trips: 389, rating: 4.9 },
    { id: '5', driverId: '#DRV-4410', name: 'Ryan Patel', license: 'DL-2018-00654', phone: '+1 555-0105', vehicle: 'MAN TGX • RY-78-PL', location: 'West Highway', status: 'Active', joinDate: '2018-07-22', trips: 1876, rating: 4.5 }
  ]);

  private counter = 4000;

  constructor(private toast: ToastService) {}

  stats() {
    const d = this.drivers();
    return [
      { value: d.filter(x => x.status === 'Active').length, label: 'Active Drivers', bg: '#dcfce7', icon: '<polyline points="20 6 9 17 4 12"/>' },
      { value: d.filter(x => x.status === 'Off Duty').length, label: 'Off Duty', bg: '#f3f4f6', icon: '<circle cx="12" cy="12" r="10"/>' },
      { value: d.filter(x => x.status === 'On Leave').length, label: 'On Leave', bg: '#fef9c3', icon: '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>' },
      { value: d.length, label: 'Total Drivers', bg: '#dbeafe', icon: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>' }
    ];
  }

  filtered() {
    return this.drivers().filter(d => {
      const q = this.searchQ.toLowerCase();
      const matchQ = !q || d.name.toLowerCase().includes(q) || d.driverId.toLowerCase().includes(q) || d.vehicle.toLowerCase().includes(q);
      const matchS = !this.filterStatus || d.status === this.filterStatus;
      return matchQ && matchS;
    });
  }

  openAdd(): void {
    this.editingId.set(null);
    this.form = this.emptyForm();
    this.dialogOpen.set(true);
  }

  startEdit(d: DriverRecord): void {
    this.editingId.set(d.id);
    this.form = { name: d.name, license: d.license, phone: d.phone, vehicle: d.vehicle, location: d.location, status: d.status, joinDate: d.joinDate, trips: d.trips, rating: d.rating };
    this.dialogOpen.set(true);
  }

  submit(): void {
    if (!this.form.name.trim() || !this.form.license.trim()) {
      this.toast.error('Name and License are required.', 'Validation Error');
      return;
    }
    if (this.editingId()) {
      this.drivers.update(ds => ds.map(d => d.id === this.editingId() ? { ...d, ...this.form } : d));
      this.toast.success(`${this.form.name} updated.`, 'Driver Updated');
    } else {
      const id = String(Date.now());
      const driverId = `#DRV-${++this.counter}`;
      this.drivers.update(ds => [...ds, { id, driverId, ...this.form }]);
      this.toast.success(`${this.form.name} added to the system.`, 'Driver Added');
    }
    this.closeDialog();
  }

  remove(d: DriverRecord): void {
    this.drivers.update(ds => ds.filter(x => x.id !== d.id));
    this.toast.warning(`${d.name} has been removed.`, 'Driver Removed');
  }

  closeDialog(): void {
    this.dialogOpen.set(false);
    this.editingId.set(null);
  }

  initials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }

  starStr(r: number): string {
    return '★'.repeat(Math.round(r)) + '☆'.repeat(5 - Math.round(r));
  }

  private emptyForm() {
    return { name: '', license: '', phone: '', vehicle: '', location: '', status: 'Active' as DriverStatus, joinDate: new Date().toISOString().split('T')[0], trips: 0, rating: 5.0 };
  }
}
