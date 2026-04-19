import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogComponent } from '../../components/dialog/dialog.component';
import { ToastService } from '../../services/toast.service';

type ShipmentStatus = 'Pending' | 'In Transit' | 'Delivered' | 'Failed';

interface Shipment {
  id: string;
  shipmentId: string;
  description: string;
  origin: string;
  destination: string;
  driver: string;
  weight: number;
  status: ShipmentStatus;
  eta: string;
  date: string;
  priority: 'High' | 'Medium' | 'Low';
}

@Component({
  selector: 'app-shipments',
  standalone: true,
  imports: [CommonModule, FormsModule, DialogComponent],
  template: `
    <div class="page">
      <div class="page-header">
        <div>
          <h1 class="page-title">Shipments</h1>
          <p class="page-sub">Track and manage all shipment orders</p>
        </div>
        <button class="btn-primary" (click)="openAdd()">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          New Shipment
        </button>
      </div>

      <div class="stats-row">
        <div class="stat-box" *ngFor="let s of stats()">
          <div class="sb-icon" [style.background]="s.bg"></div>
          <div><div class="sb-val">{{ s.value }}</div><div class="sb-label">{{ s.label }}</div></div>
        </div>
      </div>

      <div class="table-card">
        <div class="tc-header">
          <div>
            <h3 class="tc-title">All Shipments</h3>
            <p class="tc-sub">{{ shipments().length }} total shipments</p>
          </div>
          <div class="tc-actions">
            <div class="search-wrap">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="si">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input class="search-in" placeholder="Search shipments..." [(ngModel)]="searchQ" />
            </div>
            <select class="filter-sel" [(ngModel)]="filterStatus">
              <option value="">All Status</option>
              <option>Pending</option><option>In Transit</option><option>Delivered</option><option>Failed</option>
            </select>
          </div>
        </div>
        <div class="table-wrap">
          <table class="data-table">
            <thead>
              <tr>
                <th>SHIPMENT ID</th>
                <th>DESCRIPTION</th>
                <th>ORIGIN → DESTINATION</th>
                <th>DRIVER</th>
                <th>WEIGHT</th>
                <th>PRIORITY</th>
                <th>DATE</th>
                <th>ETA</th>
                <th>STATUS</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let s of filtered()" class="data-row">
                <td><span class="mono-id">{{ s.shipmentId }}</span></td>
                <td><span class="desc-text">{{ s.description }}</span></td>
                <td>
                  <div class="path-cell">
                    <span>{{ s.origin }}</span>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2">
                      <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                    </svg>
                    <span>{{ s.destination }}</span>
                  </div>
                </td>
                <td><span class="small-text">{{ s.driver }}</span></td>
                <td><span class="small-text">{{ s.weight }} kg</span></td>
                <td>
                  <span class="pri-badge" [class]="'pri-' + s.priority.toLowerCase()">{{ s.priority }}</span>
                </td>
                <td><span class="small-text">{{ s.date }}</span></td>
                <td><span class="small-text mono">{{ s.eta }}</span></td>
                <td>
                  <span class="status-pill" [class]="shipStatusClass(s.status)">
                    <span class="sp-dot"></span>{{ s.status }}
                  </span>
                </td>
                <td>
                  <div class="act-btns">
                    <button class="act-btn edit-b" (click)="startEdit(s)">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                    </button>
                    <button class="act-btn del-b" (click)="remove(s)">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                        <path d="M10 11v6"/><path d="M14 11v6"/>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
              <tr *ngIf="filtered().length === 0">
                <td colspan="10" class="empty-row"><p>No shipments found</p></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <app-dialog [open]="dialogOpen()" [title]="editingId() ? 'Edit Shipment' : 'New Shipment'"
      [subtitle]="editingId() ? 'Update shipment details' : 'Create a new shipment order'"
      maxWidth="700px" (closed)="closeDialog()">
      <div class="form-grid">
        <div class="fg full"><label>Description *</label><input [(ngModel)]="form.description" placeholder="Shipment description" class="fi" /></div>
        <div class="fg"><label>Origin *</label><input [(ngModel)]="form.origin" placeholder="From" class="fi" /></div>
        <div class="fg"><label>Destination *</label><input [(ngModel)]="form.destination" placeholder="To" class="fi" /></div>
        <div class="fg"><label>Assigned Driver</label><input [(ngModel)]="form.driver" placeholder="Driver name" class="fi" /></div>
        <div class="fg"><label>Weight (kg)</label><input type="number" [(ngModel)]="form.weight" min="0" class="fi" /></div>
        <div class="fg"><label>Date</label><input type="date" [(ngModel)]="form.date" class="fi" /></div>
        <div class="fg"><label>ETA</label><input [(ngModel)]="form.eta" placeholder="e.g. 15:30" class="fi" /></div>
        <div class="fg">
          <label>Priority</label>
          <select [(ngModel)]="form.priority" class="fi">
            <option>High</option><option>Medium</option><option>Low</option>
          </select>
        </div>
        <div class="fg full">
          <label>Status</label>
          <select [(ngModel)]="form.status" class="fi">
            <option>Pending</option><option>In Transit</option><option>Delivered</option><option>Failed</option>
          </select>
        </div>
      </div>
      <div class="dialog-footer">
        <button class="btn-cancel" (click)="closeDialog()">Cancel</button>
        <button class="btn-submit" (click)="submit()">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          {{ editingId() ? 'Update Shipment' : 'Create Shipment' }}
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
    .sb-icon { width: 46px; height: 46px; border-radius: 12px; flex-shrink: 0; }
    .sb-val { font-size: 26px; font-weight: 800; color: #0f2140; }
    .sb-label { font-size: 12px; color: #94a3b8; margin-top: 2px; }
    .table-card { background: white; border-radius: 14px; box-shadow: 0 1px 4px rgba(0,0,0,0.06); overflow: hidden; }
    .tc-header { display: flex; justify-content: space-between; align-items: center; padding: 20px 24px; border-bottom: 1px solid #f1f4f8; flex-wrap: wrap; gap: 12px; }
    .tc-title { font-size: 16px; font-weight: 700; color: #0f2140; margin: 0 0 2px; }
    .tc-sub { font-size: 12px; color: #94a3b8; margin: 0; }
    .tc-actions { display: flex; gap: 10px; align-items: center; }
    .search-wrap { position: relative; }
    .si { position: absolute; left: 10px; top: 50%; transform: translateY(-50%); color: #9ca3af; pointer-events: none; }
    .search-in { padding: 8px 12px 8px 32px; border: 1.5px solid #e5e7eb; border-radius: 8px; font-size: 13px; outline: none; width: 200px; background: #f9fafb; }
    .filter-sel { padding: 8px 12px; border: 1.5px solid #e5e7eb; border-radius: 8px; font-size: 13px; background: white; outline: none; cursor: pointer; }
    .table-wrap { overflow-x: auto; }
    .data-table { width: 100%; border-collapse: collapse; }
    .data-table th { padding: 11px 16px; text-align: left; font-size: 10.5px; font-weight: 700; color: #94a3b8; letter-spacing: 0.6px; border-bottom: 1px solid #f1f4f8; white-space: nowrap; }
    .data-row td { padding: 13px 16px; border-bottom: 1px solid #f8fafc; vertical-align: middle; }
    .data-row:last-child td { border-bottom: none; }
    .data-row:hover td { background: #f9fafb; }
    .mono-id { font-size: 11px; font-weight: 700; color: #64748b; font-family: monospace; }
    .desc-text { font-size: 13px; font-weight: 600; color: #1f2937; }
    .path-cell { display: flex; align-items: center; gap: 5px; font-size: 12px; color: #374151; }
    .small-text { font-size: 12px; color: #374151; }
    .mono { font-family: monospace; }
    .pri-badge { font-size: 11px; font-weight: 700; padding: 3px 9px; border-radius: 6px; }
    .pri-high { background: #fee2e2; color: #991b1b; }
    .pri-medium { background: #fef9c3; color: #92400e; }
    .pri-low { background: #dcfce7; color: #15803d; }
    .status-pill { display: inline-flex; align-items: center; gap: 5px; padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 700; white-space: nowrap; }
    .sp-dot { width: 6px; height: 6px; border-radius: 50%; }
    .sp-pending { background: #f3f4f6; color: #374151; } .sp-pending .sp-dot { background: #9ca3af; }
    .sp-transit { background: #dbeafe; color: #1e40af; } .sp-transit .sp-dot { background: #3b82f6; }
    .sp-delivered { background: #dcfce7; color: #15803d; } .sp-delivered .sp-dot { background: #16a34a; }
    .sp-failed { background: #fee2e2; color: #991b1b; } .sp-failed .sp-dot { background: #ef4444; }
    .act-btns { display: flex; gap: 6px; }
    .act-btn { width: 30px; height: 30px; border: 1.5px solid #e5e7eb; border-radius: 6px; background: white; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.18s; }
    .edit-b { color: #3b82f6; } .edit-b:hover { background: #eff6ff; border-color: #bfdbfe; }
    .del-b { color: #ef4444; } .del-b:hover { background: #fef2f2; border-color: #fecaca; }
    .empty-row { text-align: center; padding: 48px !important; color: #9ca3af; font-size: 14px; }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px; }
    .fg { display: flex; flex-direction: column; gap: 6px; }
    .fg.full { grid-column: 1 / -1; }
    .fg label { font-size: 12px; font-weight: 700; color: #374151; }
    .fi { padding: 10px 12px; border: 1.5px solid #e5e7eb; border-radius: 8px; font-size: 13px; color: #1f2937; background: #fafafa; outline: none; }
    .fi:focus { border-color: #0f2140; background: white; box-shadow: 0 0 0 3px rgba(15,33,64,0.06); }
    .dialog-footer { display: flex; justify-content: flex-end; gap: 10px; padding-top: 16px; border-top: 1px solid #f1f4f8; }
    .btn-cancel { padding: 10px 20px; border: 1.5px solid #e5e7eb; border-radius: 8px; background: white; font-size: 13px; font-weight: 600; cursor: pointer; color: #374151; }
    .btn-submit { display: flex; align-items: center; gap: 7px; padding: 10px 22px; background: linear-gradient(135deg, #0f2140, #1a3a5c); color: white; border: none; border-radius: 8px; font-size: 13px; font-weight: 700; cursor: pointer; }
  `]
})
export class ShipmentsComponent {
  dialogOpen = signal(false);
  editingId = signal<string | null>(null);
  searchQ = '';
  filterStatus = '';
  form = this.emptyForm();
  private counter = 5;

  shipments = signal<Shipment[]>([
    { id: '1', shipmentId: '#SHP-0001', description: 'Electronics Batch A', origin: 'Warehouse 1', destination: 'Tech Store North', driver: 'Jameson Miller', weight: 450, status: 'In Transit', priority: 'High', date: '2026-04-19', eta: '14:00' },
    { id: '2', shipmentId: '#SHP-0002', description: 'Furniture Set B', origin: 'Depot A', destination: 'Home Decor Mall', driver: 'Leila Vance', weight: 820, status: 'Delivered', priority: 'Medium', date: '2026-04-18', eta: '11:30' },
    { id: '3', shipmentId: '#SHP-0003', description: 'Food Supplies — Cold Chain', origin: 'Cold Depot', destination: 'Restaurant Zone', driver: 'Marcus Reid', weight: 320, status: 'Pending', priority: 'High', date: '2026-04-19', eta: '09:00' },
    { id: '4', shipmentId: '#SHP-0004', description: 'Auto Parts Package', origin: 'Port Terminal', destination: 'Auto Factory', driver: 'Sara Kim', weight: 1200, status: 'Failed', priority: 'Low', date: '2026-04-17', eta: '16:00' }
  ]);

  constructor(private toast: ToastService) {}

  stats() {
    const s = this.shipments();
    return [
      { value: s.filter(x => x.status === 'Pending').length, label: 'Pending', bg: '#f3f4f6' },
      { value: s.filter(x => x.status === 'In Transit').length, label: 'In Transit', bg: '#dbeafe' },
      { value: s.filter(x => x.status === 'Delivered').length, label: 'Delivered', bg: '#dcfce7' },
      { value: s.filter(x => x.status === 'Failed').length, label: 'Failed', bg: '#fee2e2' }
    ];
  }

  filtered() {
    return this.shipments().filter(s => {
      const q = this.searchQ.toLowerCase();
      const matchQ = !q || s.description.toLowerCase().includes(q) || s.shipmentId.toLowerCase().includes(q) || s.driver.toLowerCase().includes(q);
      const matchS = !this.filterStatus || s.status === this.filterStatus;
      return matchQ && matchS;
    });
  }

  shipStatusClass(st: ShipmentStatus): string {
    if (st === 'Pending') return 'status-pill sp-pending';
    if (st === 'In Transit') return 'status-pill sp-transit';
    if (st === 'Delivered') return 'status-pill sp-delivered';
    return 'status-pill sp-failed';
  }

  openAdd(): void { this.editingId.set(null); this.form = this.emptyForm(); this.dialogOpen.set(true); }
  startEdit(s: Shipment): void {
    this.editingId.set(s.id);
    this.form = { description: s.description, origin: s.origin, destination: s.destination, driver: s.driver, weight: s.weight, status: s.status, priority: s.priority, date: s.date, eta: s.eta };
    this.dialogOpen.set(true);
  }
  submit(): void {
    if (!this.form.description.trim() || !this.form.origin.trim() || !this.form.destination.trim()) {
      this.toast.error('Description, origin and destination are required.', 'Validation Error'); return;
    }
    if (this.editingId()) {
      this.shipments.update(ss => ss.map(s => s.id === this.editingId() ? { ...s, ...this.form } : s));
      this.toast.success('Shipment updated.', 'Updated');
    } else {
      const shipmentId = `#SHP-000${++this.counter}`;
      this.shipments.update(ss => [...ss, { id: String(Date.now()), shipmentId, ...this.form }]);
      this.toast.success('Shipment created successfully.', 'Shipment Created');
    }
    this.closeDialog();
  }
  remove(s: Shipment): void {
    this.shipments.update(ss => ss.filter(x => x.id !== s.id));
    this.toast.warning(`Shipment ${s.shipmentId} removed.`, 'Removed');
  }
  closeDialog(): void { this.dialogOpen.set(false); this.editingId.set(null); }
  private emptyForm() {
    return { description: '', origin: '', destination: '', driver: '', weight: 0, status: 'Pending' as ShipmentStatus, priority: 'Medium' as 'High' | 'Medium' | 'Low', date: new Date().toISOString().split('T')[0], eta: '' };
  }
}
