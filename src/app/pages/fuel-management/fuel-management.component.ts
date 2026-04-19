import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogComponent } from '../../components/dialog/dialog.component';
import { ToastService } from '../../services/toast.service';

interface FuelRecord {
  id: string;
  recordId: string;
  vehicle: string;
  plate: string;
  driver: string;
  liters: number;
  costPerLiter: number;
  location: string;
  odometer: number;
  date: string;
}

@Component({
  selector: 'app-fuel-management',
  standalone: true,
  imports: [CommonModule, FormsModule, DialogComponent],
  template: `
    <div class="page">
      <div class="page-header">
        <div>
          <h1 class="page-title">Fuel Management</h1>
          <p class="page-sub">Track fuel consumption and costs across the fleet</p>
        </div>
        <button class="btn-primary" (click)="openAdd()">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Log Fuel
        </button>
      </div>

      <div class="stats-row">
        <div class="stat-box" *ngFor="let s of summaryCards()">
          <div class="sb-icon" [style.background]="s.bg"></div>
          <div><div class="sb-val">{{ s.value }}</div><div class="sb-label">{{ s.label }}</div></div>
        </div>
      </div>

      <div class="table-card">
        <div class="tc-header">
          <div>
            <h3 class="tc-title">Fuel Log</h3>
            <p class="tc-sub">{{ records().length }} entries logged</p>
          </div>
          <div class="tc-actions">
            <div class="search-wrap">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="si">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input class="search-in" placeholder="Search fuel logs..." [(ngModel)]="searchQ" />
            </div>
          </div>
        </div>
        <div class="table-wrap">
          <table class="data-table">
            <thead>
              <tr>
                <th>RECORD ID</th>
                <th>VEHICLE</th>
                <th>DRIVER</th>
                <th>LITERS</th>
                <th>COST/LITER</th>
                <th>TOTAL COST</th>
                <th>LOCATION</th>
                <th>ODOMETER</th>
                <th>DATE</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let r of filtered()" class="data-row">
                <td><span class="mono-id">{{ r.recordId }}</span></td>
                <td>
                  <div class="veh-cell">
                    <div class="veh-dot"></div>
                    <div>
                      <div class="veh-name">{{ r.vehicle }}</div>
                      <div class="plate-text">{{ r.plate }}</div>
                    </div>
                  </div>
                </td>
                <td><span class="small-text">{{ r.driver }}</span></td>
                <td><span class="fuel-num">{{ r.liters }}L</span></td>
                <td><span class="small-text">{{ '$' + r.costPerLiter.toFixed(2) }}</span></td>
                <td><span class="cost-total">{{ '$' + (r.liters * r.costPerLiter).toFixed(2) }}</span></td>
                <td>
                  <div class="loc-cell">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                    </svg>
                    {{ r.location }}
                  </div>
                </td>
                <td><span class="small-text">{{ r.odometer.toLocaleString() }} km</span></td>
                <td><span class="small-text">{{ r.date }}</span></td>
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
                <td colspan="10" class="empty-row"><p>No fuel records found</p></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <app-dialog [open]="dialogOpen()" [title]="editingId() ? 'Edit Fuel Record' : 'Log Fuel Refill'"
      [subtitle]="editingId() ? 'Update this fuel record' : 'Log a new fuel refill entry'"
      maxWidth="680px" (closed)="closeDialog()">
      <div class="form-grid">
        <div class="fg"><label>Vehicle Model *</label><input [(ngModel)]="form.vehicle" placeholder="e.g. Volvo FH16" class="fi" /></div>
        <div class="fg"><label>License Plate *</label><input [(ngModel)]="form.plate" placeholder="e.g. 44-BB-92" class="fi" /></div>
        <div class="fg"><label>Driver Name</label><input [(ngModel)]="form.driver" placeholder="Driver name" class="fi" /></div>
        <div class="fg"><label>Fuel Station / Location</label><input [(ngModel)]="form.location" placeholder="Station name" class="fi" /></div>
        <div class="fg"><label>Liters Filled *</label><input type="number" [(ngModel)]="form.liters" min="0" step="0.1" class="fi" /></div>
        <div class="fg"><label>Cost per Liter ($) *</label><input type="number" [(ngModel)]="form.costPerLiter" min="0" step="0.01" class="fi" /></div>
        <div class="fg"><label>Odometer (km)</label><input type="number" [(ngModel)]="form.odometer" min="0" class="fi" /></div>
        <div class="fg"><label>Date</label><input type="date" [(ngModel)]="form.date" class="fi" /></div>
      </div>
      <div class="total-preview" *ngIf="form.liters > 0 && form.costPerLiter > 0">
        <span>Total Cost:</span>
        <strong>{{ '$' + (form.liters * form.costPerLiter).toFixed(2) }}</strong>
      </div>
      <div class="dialog-footer">
        <button class="btn-cancel" (click)="closeDialog()">Cancel</button>
        <button class="btn-submit" (click)="submit()">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          {{ editingId() ? 'Update Record' : 'Log Fuel' }}
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
    .sb-val { font-size: 22px; font-weight: 800; color: #0f2140; }
    .sb-label { font-size: 12px; color: #94a3b8; margin-top: 2px; }
    .table-card { background: white; border-radius: 14px; box-shadow: 0 1px 4px rgba(0,0,0,0.06); overflow: hidden; }
    .tc-header { display: flex; justify-content: space-between; align-items: center; padding: 20px 24px; border-bottom: 1px solid #f1f4f8; flex-wrap: wrap; gap: 12px; }
    .tc-title { font-size: 16px; font-weight: 700; color: #0f2140; margin: 0 0 2px; }
    .tc-sub { font-size: 12px; color: #94a3b8; margin: 0; }
    .tc-actions { display: flex; gap: 10px; align-items: center; }
    .search-wrap { position: relative; }
    .si { position: absolute; left: 10px; top: 50%; transform: translateY(-50%); color: #9ca3af; pointer-events: none; }
    .search-in { padding: 8px 12px 8px 32px; border: 1.5px solid #e5e7eb; border-radius: 8px; font-size: 13px; outline: none; width: 220px; background: #f9fafb; }
    .table-wrap { overflow-x: auto; }
    .data-table { width: 100%; border-collapse: collapse; }
    .data-table th { padding: 11px 16px; text-align: left; font-size: 10.5px; font-weight: 700; color: #94a3b8; letter-spacing: 0.6px; border-bottom: 1px solid #f1f4f8; white-space: nowrap; }
    .data-row td { padding: 13px 16px; border-bottom: 1px solid #f8fafc; vertical-align: middle; }
    .data-row:last-child td { border-bottom: none; }
    .data-row:hover td { background: #f9fafb; }
    .mono-id { font-size: 11px; font-weight: 700; color: #64748b; font-family: monospace; }
    .veh-cell { display: flex; align-items: center; gap: 10px; }
    .veh-dot { width: 10px; height: 10px; background: #10b981; border-radius: 50%; flex-shrink: 0; }
    .veh-name { font-size: 13px; font-weight: 600; color: #1f2937; }
    .plate-text { font-size: 11px; color: #94a3b8; font-family: monospace; }
    .small-text { font-size: 12px; color: #374151; }
    .fuel-num { font-size: 13px; font-weight: 700; color: #0f2140; }
    .cost-total { font-size: 13px; font-weight: 700; color: #059669; }
    .loc-cell { display: flex; align-items: center; gap: 5px; font-size: 12px; color: #374151; }
    .act-btns { display: flex; gap: 6px; }
    .act-btn { width: 30px; height: 30px; border: 1.5px solid #e5e7eb; border-radius: 6px; background: white; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.18s; }
    .edit-b { color: #3b82f6; } .edit-b:hover { background: #eff6ff; border-color: #bfdbfe; }
    .del-b { color: #ef4444; } .del-b:hover { background: #fef2f2; border-color: #fecaca; }
    .empty-row { text-align: center; padding: 48px !important; color: #9ca3af; font-size: 14px; }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px; }
    .fg { display: flex; flex-direction: column; gap: 6px; }
    .fg label { font-size: 12px; font-weight: 700; color: #374151; }
    .fi { padding: 10px 12px; border: 1.5px solid #e5e7eb; border-radius: 8px; font-size: 13px; color: #1f2937; background: #fafafa; outline: none; }
    .fi:focus { border-color: #0f2140; background: white; box-shadow: 0 0 0 3px rgba(15,33,64,0.06); }
    .total-preview {
      display: flex; align-items: center; justify-content: space-between;
      padding: 12px 16px; background: #f0fdf4; border: 1.5px solid #bbf7d0;
      border-radius: 8px; margin-bottom: 16px; font-size: 13px; color: #374151;
    }
    .total-preview strong { font-size: 18px; color: #059669; }
    .dialog-footer { display: flex; justify-content: flex-end; gap: 10px; padding-top: 16px; border-top: 1px solid #f1f4f8; }
    .btn-cancel { padding: 10px 20px; border: 1.5px solid #e5e7eb; border-radius: 8px; background: white; font-size: 13px; font-weight: 600; cursor: pointer; color: #374151; }
    .btn-submit { display: flex; align-items: center; gap: 7px; padding: 10px 22px; background: linear-gradient(135deg, #0f2140, #1a3a5c); color: white; border: none; border-radius: 8px; font-size: 13px; font-weight: 700; cursor: pointer; }
  `]
})
export class FuelManagementComponent {
  dialogOpen = signal(false);
  editingId = signal<string | null>(null);
  searchQ = '';
  form = this.emptyForm();
  private counter = 4;

  records = signal<FuelRecord[]>([
    { id: '1', recordId: '#FL-001', vehicle: 'Volvo FH16', plate: '44-BB-92', driver: 'Jameson Miller', liters: 120, costPerLiter: 1.45, location: 'Shell Station North', odometer: 145200, date: '2026-04-18' },
    { id: '2', recordId: '#FL-002', vehicle: 'Isuzu NPR', plate: '12-XZ-01', driver: 'Leila Vance', liters: 80, costPerLiter: 1.42, location: 'BP City Center', odometer: 89340, date: '2026-04-17' },
    { id: '3', recordId: '#FL-003', vehicle: 'Scania R500', plate: '09-RR-45', driver: 'Marcus Reid', liters: 150, costPerLiter: 1.48, location: 'Total East Gate', odometer: 212500, date: '2026-04-16' },
    { id: '4', recordId: '#FL-004', vehicle: 'MAN TGX', plate: 'RY-78-PL', driver: 'Ryan Patel', liters: 100, costPerLiter: 1.43, location: 'Esso West Highway', odometer: 178900, date: '2026-04-15' }
  ]);

  constructor(private toast: ToastService) {}

  summaryCards() {
    const r = this.records();
    const totalL = r.reduce((s, x) => s + x.liters, 0);
    const totalCost = r.reduce((s, x) => s + (x.liters * x.costPerLiter), 0);
    const avgCost = r.length ? totalCost / r.length : 0;
    return [
      { value: `${totalL.toLocaleString()}L`, label: 'Total Liters', bg: '#dbeafe' },
      { value: `$${totalCost.toFixed(0)}`, label: 'Total Cost', bg: '#dcfce7' },
      { value: `$${avgCost.toFixed(2)}`, label: 'Avg per Refill', bg: '#fef9c3' },
      { value: r.length, label: 'Total Entries', bg: '#f3f4f6' }
    ];
  }

  filtered() {
    const q = this.searchQ.toLowerCase();
    if (!q) return this.records();
    return this.records().filter(r =>
      r.vehicle.toLowerCase().includes(q) || r.driver.toLowerCase().includes(q) || r.location.toLowerCase().includes(q) || r.recordId.toLowerCase().includes(q)
    );
  }

  openAdd(): void { this.editingId.set(null); this.form = this.emptyForm(); this.dialogOpen.set(true); }
  startEdit(r: FuelRecord): void {
    this.editingId.set(r.id);
    this.form = { vehicle: r.vehicle, plate: r.plate, driver: r.driver, liters: r.liters, costPerLiter: r.costPerLiter, location: r.location, odometer: r.odometer, date: r.date };
    this.dialogOpen.set(true);
  }
  submit(): void {
    if (!this.form.vehicle.trim() || !this.form.plate.trim() || this.form.liters <= 0) {
      this.toast.error('Vehicle, plate and liters are required.', 'Validation Error'); return;
    }
    if (this.editingId()) {
      this.records.update(rs => rs.map(r => r.id === this.editingId() ? { ...r, ...this.form } : r));
      this.toast.success('Fuel record updated.', 'Updated');
    } else {
      this.records.update(rs => [...rs, { id: String(Date.now()), recordId: `#FL-00${++this.counter}`, ...this.form }]);
      this.toast.success('Fuel refill logged successfully.', 'Fuel Logged');
    }
    this.closeDialog();
  }
  remove(r: FuelRecord): void {
    this.records.update(rs => rs.filter(x => x.id !== r.id));
    this.toast.warning(`Record ${r.recordId} deleted.`, 'Deleted');
  }
  closeDialog(): void { this.dialogOpen.set(false); this.editingId.set(null); }
  private emptyForm() {
    return { vehicle: '', plate: '', driver: '', liters: 0, costPerLiter: 1.45, location: '', odometer: 0, date: new Date().toISOString().split('T')[0] };
  }
}
