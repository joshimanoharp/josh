import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogComponent } from '../../components/dialog/dialog.component';
import { ToastService } from '../../services/toast.service';

type MaintStatus = 'Scheduled' | 'In Progress' | 'Completed' | 'Overdue';

interface MaintRecord {
  id: string;
  recordId: string;
  vehicle: string;
  plate: string;
  type: string;
  technician: string;
  cost: number;
  date: string;
  status: MaintStatus;
  notes: string;
}

@Component({
  selector: 'app-maintenance',
  standalone: true,
  imports: [CommonModule, FormsModule, DialogComponent],
  template: `
    <div class="page">
      <div class="page-header">
        <div>
          <h1 class="page-title">Maintenance</h1>
          <p class="page-sub">Vehicle service records and scheduled maintenance</p>
        </div>
        <button class="btn-primary" (click)="openAdd()">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Add Record
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
            <h3 class="tc-title">Maintenance Records</h3>
            <p class="tc-sub">{{ records().length }} total records</p>
          </div>
          <div class="tc-actions">
            <div class="search-wrap">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="si">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input class="search-in" placeholder="Search records..." [(ngModel)]="searchQ" />
            </div>
            <select class="filter-sel" [(ngModel)]="filterStatus">
              <option value="">All Status</option>
              <option>Scheduled</option><option>In Progress</option><option>Completed</option><option>Overdue</option>
            </select>
          </div>
        </div>
        <div class="table-wrap">
          <table class="data-table">
            <thead>
              <tr>
                <th>RECORD ID</th>
                <th>VEHICLE</th>
                <th>SERVICE TYPE</th>
                <th>TECHNICIAN</th>
                <th>COST</th>
                <th>DATE</th>
                <th>NOTES</th>
                <th>STATUS</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let r of filtered()" class="data-row">
                <td><span class="mono-id">{{ r.recordId }}</span></td>
                <td>
                  <div class="veh-cell">
                    <div class="veh-icon">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h5l2 4v3h-7V8z"/>
                      </svg>
                    </div>
                    <div>
                      <div class="veh-name">{{ r.vehicle }}</div>
                      <div class="veh-plate">{{ r.plate }}</div>
                    </div>
                  </div>
                </td>
                <td><span class="type-badge">{{ r.type }}</span></td>
                <td><span class="small-text">{{ r.technician }}</span></td>
                <td><span class="cost-text">{{ '$' + r.cost.toLocaleString() }}</span></td>
                <td><span class="small-text">{{ r.date }}</span></td>
                <td><span class="notes-text" [title]="r.notes">{{ r.notes.length > 30 ? r.notes.slice(0,30) + '...' : r.notes }}</span></td>
                <td>
                  <span class="status-pill" [class]="maintStatusClass(r.status)">
                    <span class="sp-dot"></span>{{ r.status }}
                  </span>
                </td>
                <td>
                  <div class="act-btns">
                    <button class="act-btn edit-b" (click)="startEdit(r)">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                    </button>
                    <button class="act-btn del-b" (click)="remove(r)">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                        <path d="M10 11v6"/><path d="M14 11v6"/>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
              <tr *ngIf="filtered().length === 0">
                <td colspan="9" class="empty-row"><p>No maintenance records found</p></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <app-dialog [open]="dialogOpen()" [title]="editingId() ? 'Edit Record' : 'Add Maintenance Record'"
      [subtitle]="editingId() ? 'Update maintenance details' : 'Log a vehicle service or maintenance event'"
      maxWidth="700px" (closed)="closeDialog()">
      <div class="form-grid">
        <div class="fg"><label>Vehicle Model *</label><input [(ngModel)]="form.vehicle" placeholder="e.g. Volvo FH16" class="fi" /></div>
        <div class="fg"><label>License Plate *</label><input [(ngModel)]="form.plate" placeholder="e.g. 44-BB-92" class="fi" /></div>
        <div class="fg"><label>Service Type *</label>
          <select [(ngModel)]="form.type" class="fi">
            <option>Oil Change</option><option>Tire Replacement</option><option>Engine Check</option>
            <option>Brake Service</option><option>Battery Replacement</option><option>Full Service</option><option>Other</option>
          </select>
        </div>
        <div class="fg"><label>Technician</label><input [(ngModel)]="form.technician" placeholder="Technician name" class="fi" /></div>
        <div class="fg"><label>Cost ($)</label><input type="number" [(ngModel)]="form.cost" min="0" class="fi" /></div>
        <div class="fg"><label>Date</label><input type="date" [(ngModel)]="form.date" class="fi" /></div>
        <div class="fg full"><label>Notes</label><textarea [(ngModel)]="form.notes" placeholder="Service notes..." class="fi ta" rows="3"></textarea></div>
        <div class="fg full">
          <label>Status</label>
          <select [(ngModel)]="form.status" class="fi">
            <option>Scheduled</option><option>In Progress</option><option>Completed</option><option>Overdue</option>
          </select>
        </div>
      </div>
      <div class="dialog-footer">
        <button class="btn-cancel" (click)="closeDialog()">Cancel</button>
        <button class="btn-submit" (click)="submit()">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          {{ editingId() ? 'Update Record' : 'Save Record' }}
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
    .veh-cell { display: flex; align-items: center; gap: 8px; }
    .veh-icon { width: 28px; height: 28px; background: #f1f4f8; border-radius: 6px; display: flex; align-items: center; justify-content: center; color: #64748b; flex-shrink: 0; }
    .veh-name { font-size: 13px; font-weight: 600; color: #1f2937; }
    .veh-plate { font-size: 11px; color: #94a3b8; font-family: monospace; }
    .type-badge { font-size: 11px; font-weight: 700; padding: 3px 8px; border-radius: 6px; background: #f1f4f8; color: #374151; }
    .small-text { font-size: 12px; color: #374151; }
    .cost-text { font-size: 13px; font-weight: 700; color: #059669; }
    .notes-text { font-size: 12px; color: #6b7280; }
    .status-pill { display: inline-flex; align-items: center; gap: 5px; padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 700; white-space: nowrap; }
    .sp-dot { width: 6px; height: 6px; border-radius: 50%; }
    .sp-scheduled { background: #dbeafe; color: #1e40af; } .sp-scheduled .sp-dot { background: #3b82f6; }
    .sp-inprogress { background: #fef9c3; color: #92400e; } .sp-inprogress .sp-dot { background: #f59e0b; }
    .sp-completed { background: #dcfce7; color: #15803d; } .sp-completed .sp-dot { background: #16a34a; }
    .sp-overdue { background: #fee2e2; color: #991b1b; } .sp-overdue .sp-dot { background: #ef4444; }
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
    .ta { resize: vertical; min-height: 72px; }
    .dialog-footer { display: flex; justify-content: flex-end; gap: 10px; padding-top: 16px; border-top: 1px solid #f1f4f8; }
    .btn-cancel { padding: 10px 20px; border: 1.5px solid #e5e7eb; border-radius: 8px; background: white; font-size: 13px; font-weight: 600; cursor: pointer; color: #374151; }
    .btn-submit { display: flex; align-items: center; gap: 7px; padding: 10px 22px; background: linear-gradient(135deg, #0f2140, #1a3a5c); color: white; border: none; border-radius: 8px; font-size: 13px; font-weight: 700; cursor: pointer; }
  `]
})
export class MaintenanceComponent {
  dialogOpen = signal(false);
  editingId = signal<string | null>(null);
  searchQ = '';
  filterStatus = '';
  form = this.emptyForm();
  private counter = 4;

  records = signal<MaintRecord[]>([
    { id: '1', recordId: '#MNT-001', vehicle: 'Volvo FH16', plate: '44-BB-92', type: 'Oil Change', technician: 'Tom Bradley', cost: 320, date: '2026-04-15', status: 'Completed', notes: 'Full synthetic 10W-40 replaced. Filter changed.' },
    { id: '2', recordId: '#MNT-002', vehicle: 'Scania R500', plate: '09-RR-45', type: 'Brake Service', technician: 'Anna Clarke', cost: 850, date: '2026-04-20', status: 'Scheduled', notes: 'Front and rear brake pads replacement needed.' },
    { id: '3', recordId: '#MNT-003', vehicle: 'Isuzu NPR', plate: '12-XZ-01', type: 'Engine Check', technician: 'Mike Johnson', cost: 450, date: '2026-04-10', status: 'Overdue', notes: 'Warning light diagnostic required urgently.' },
    { id: '4', recordId: '#MNT-004', vehicle: 'MAN TGX', plate: 'RY-78-PL', type: 'Full Service', technician: 'Tom Bradley', cost: 1200, date: '2026-04-19', status: 'In Progress', notes: 'Annual full service including all fluid checks.' }
  ]);

  constructor(private toast: ToastService) {}

  stats() {
    const r = this.records();
    return [
      { value: r.filter(x => x.status === 'Scheduled').length, label: 'Scheduled', bg: '#dbeafe' },
      { value: r.filter(x => x.status === 'In Progress').length, label: 'In Progress', bg: '#fef9c3' },
      { value: r.filter(x => x.status === 'Completed').length, label: 'Completed', bg: '#dcfce7' },
      { value: r.filter(x => x.status === 'Overdue').length, label: 'Overdue', bg: '#fee2e2' }
    ];
  }

  filtered() {
    return this.records().filter(r => {
      const q = this.searchQ.toLowerCase();
      const matchQ = !q || r.vehicle.toLowerCase().includes(q) || r.recordId.toLowerCase().includes(q) || r.technician.toLowerCase().includes(q);
      const matchS = !this.filterStatus || r.status === this.filterStatus;
      return matchQ && matchS;
    });
  }

  maintStatusClass(s: MaintStatus): string {
    if (s === 'Scheduled') return 'status-pill sp-scheduled';
    if (s === 'In Progress') return 'status-pill sp-inprogress';
    if (s === 'Completed') return 'status-pill sp-completed';
    return 'status-pill sp-overdue';
  }

  openAdd(): void { this.editingId.set(null); this.form = this.emptyForm(); this.dialogOpen.set(true); }
  startEdit(r: MaintRecord): void {
    this.editingId.set(r.id);
    this.form = { vehicle: r.vehicle, plate: r.plate, type: r.type, technician: r.technician, cost: r.cost, date: r.date, status: r.status, notes: r.notes };
    this.dialogOpen.set(true);
  }
  submit(): void {
    if (!this.form.vehicle.trim() || !this.form.plate.trim()) {
      this.toast.error('Vehicle and plate are required.', 'Validation Error'); return;
    }
    if (this.editingId()) {
      this.records.update(rs => rs.map(r => r.id === this.editingId() ? { ...r, ...this.form } : r));
      this.toast.success('Maintenance record updated.', 'Updated');
    } else {
      this.records.update(rs => [...rs, { id: String(Date.now()), recordId: `#MNT-00${++this.counter}`, ...this.form }]);
      this.toast.success('Maintenance record saved.', 'Record Added');
    }
    this.closeDialog();
  }
  remove(r: MaintRecord): void {
    this.records.update(rs => rs.filter(x => x.id !== r.id));
    this.toast.warning(`Record ${r.recordId} deleted.`, 'Deleted');
  }
  closeDialog(): void { this.dialogOpen.set(false); this.editingId.set(null); }
  private emptyForm() {
    return { vehicle: '', plate: '', type: 'Oil Change', technician: '', cost: 0, date: new Date().toISOString().split('T')[0], status: 'Scheduled' as MaintStatus, notes: '' };
  }
}
