import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DriverService } from '../../services/driver.service';
import { ToastService } from '../../services/toast.service';
import { Driver, DriverStatus } from '../../models/driver.model';

interface DriverForm {
  operatorName: string;
  vehicle: string;
  licensePlate: string;
  status: DriverStatus;
  routeProgress: number;
  efficiency: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="dashboard">
      <!-- Top Bar -->
      <div class="topbar">
        <div class="search-wrap">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="search-icon">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input class="search-input" type="text" placeholder="Search shipments, drivers or routes..." [(ngModel)]="searchQuery" />
        </div>
        <div class="topbar-right">
          <span class="topbar-title">Delivery Dashboard</span>
          <button class="icon-btn" (click)="toast.info('No new notifications', 'Notifications')">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
            <span class="notif-dot"></span>
          </button>
          <button class="icon-btn" (click)="toast.info('Settings coming soon', 'Settings')">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="3"/>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
            </svg>
          </button>
          <button class="icon-btn" (click)="toast.info('Help documentation', 'Help')">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
          </button>
          <div class="user-badge">A</div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="content">
        <!-- Top Row: Map + Stats -->
        <div class="top-row">
          <!-- Map Card -->
          <div class="map-card">
            <div class="live-badge">
              <span class="live-dot"></span>
              LIVE: 142 Active Units
            </div>
            <div class="map-svg-wrap">
              <svg viewBox="0 0 600 440" class="map-svg" xmlns="http://www.w3.org/2000/svg">
                <rect width="600" height="440" fill="#d4e8c2"/>
                <!-- City blocks -->
                <g fill="#f4a55a" stroke="#e8923a" stroke-width="0.5">
                  <rect x="20" y="30" width="60" height="40" rx="3"/>
                  <rect x="90" y="20" width="45" height="35" rx="3"/>
                  <rect x="145" y="35" width="55" height="30" rx="3"/>
                  <rect x="210" y="15" width="50" height="45" rx="3"/>
                  <rect x="270" y="25" width="40" height="30" rx="3"/>
                  <rect x="320" y="10" width="55" height="50" rx="3"/>
                  <rect x="385" y="20" width="45" height="40" rx="3"/>
                  <rect x="440" y="30" width="50" height="35" rx="3"/>
                  <rect x="500" y="15" width="60" height="45" rx="3"/>
                  <!-- Row 2 -->
                  <rect x="15" y="90" width="50" height="50" rx="3"/>
                  <rect x="75" y="80" width="60" height="45" rx="3"/>
                  <rect x="145" y="88" width="55" height="40" rx="3"/>
                  <rect x="210" y="78" width="65" height="55" rx="3"/>
                  <rect x="285" y="85" width="50" height="45" rx="3"/>
                  <rect x="345" y="75" width="60" height="55" rx="3"/>
                  <rect x="415" y="82" width="55" height="48" rx="3"/>
                  <rect x="480" y="78" width="65" height="52" rx="3"/>
                  <!-- Row 3 -->
                  <rect x="20" y="155" width="55" height="45" rx="3"/>
                  <rect x="85" y="148" width="50" height="55" rx="3"/>
                  <rect x="145" y="152" width="60" height="45" rx="3"/>
                  <rect x="215" y="145" width="55" height="60" rx="3"/>
                  <rect x="280" y="148" width="65" height="52" rx="3"/>
                  <rect x="355" y="142" width="55" height="60" rx="3"/>
                  <rect x="420" y="150" width="50" height="50" rx="3"/>
                  <rect x="480" y="145" width="65" height="55" rx="3"/>
                  <!-- Row 4 -->
                  <rect x="15" y="218" width="60" height="50" rx="3"/>
                  <rect x="85" y="212" width="55" height="58" rx="3"/>
                  <rect x="150" y="215" width="50" height="55" rx="3"/>
                  <rect x="210" y="208" width="70" height="62" rx="3"/>
                  <rect x="290" y="210" width="55" height="60" rx="3"/>
                  <rect x="355" y="205" width="60" height="65" rx="3"/>
                  <rect x="425" y="212" width="50" height="58" rx="3"/>
                  <rect x="485" y="208" width="65" height="62" rx="3"/>
                  <!-- Row 5 -->
                  <rect x="20" y="285" width="55" height="50" rx="3"/>
                  <rect x="85" y="278" width="60" height="58" rx="3"/>
                  <rect x="155" y="282" width="50" height="55" rx="3"/>
                  <rect x="215" y="275" width="65" height="62" rx="3"/>
                  <rect x="290" y="278" width="55" height="60" rx="3"/>
                  <rect x="355" y="272" width="62" height="65" rx="3"/>
                  <rect x="428" y="278" width="50" height="58" rx="3"/>
                  <rect x="488" y="272" width="62" height="65" rx="3"/>
                  <!-- Row 6 -->
                  <rect x="25" y="350" width="50" height="45" rx="3"/>
                  <rect x="85" y="345" width="55" height="52" rx="3"/>
                  <rect x="150" y="348" width="55" height="48" rx="3"/>
                  <rect x="215" y="342" width="65" height="55" rx="3"/>
                  <rect x="290" y="345" width="55" height="52" rx="3"/>
                  <rect x="355" y="340" width="60" height="55" rx="3"/>
                  <rect x="425" y="345" width="55" height="50" rx="3"/>
                  <rect x="490" y="338" width="60" height="58" rx="3"/>
                </g>
                <!-- Roads -->
                <g stroke="#ccc" stroke-width="8" fill="none">
                  <line x1="0" y1="145" x2="600" y2="145"/>
                  <line x1="0" y1="205" x2="600" y2="205"/>
                  <line x1="0" y1="270" x2="600" y2="270"/>
                  <line x1="0" y1="340" x2="600" y2="340"/>
                  <line x1="140" y1="0" x2="140" y2="440"/>
                  <line x1="205" y1="0" x2="205" y2="440"/>
                  <line x1="280" y1="0" x2="280" y2="440"/>
                  <line x1="350" y1="0" x2="350" y2="440"/>
                  <line x1="420" y1="0" x2="420" y2="440"/>
                  <line x1="480" y1="0" x2="480" y2="440"/>
                </g>
                <!-- Vehicle markers -->
                <g>
                  <circle cx="285" cy="200" r="16" fill="#0f2140" stroke="white" stroke-width="2"/>
                  <text x="285" y="205" text-anchor="middle" fill="white" font-size="12">🚛</text>
                  <circle cx="355" cy="280" r="14" fill="#e53935" stroke="white" stroke-width="2"/>
                  <text x="355" y="285" text-anchor="middle" fill="white" font-size="11">!</text>
                  <circle cx="210" cy="340" r="14" fill="#10b981" stroke="white" stroke-width="2"/>
                  <text x="210" y="345" text-anchor="middle" fill="white" font-size="11">✓</text>
                </g>
              </svg>
            </div>
            <!-- Network Pulse -->
            <div class="network-pulse">
              <div class="pulse-title">NETWORK PULSE</div>
              <div class="pulse-row">
                <span class="pulse-label">ON SCHEDULE</span>
                <span class="pulse-value green">88%</span>
              </div>
              <div class="pulse-bar-wrap">
                <div class="pulse-bar"><div class="pulse-fill green-fill" style="width:88%"></div></div>
              </div>
              <div class="pulse-row">
                <span class="pulse-label">IDLE CAPACITY</span>
                <span class="pulse-value yellow">12%</span>
              </div>
              <div class="pulse-bar-wrap">
                <div class="pulse-bar"><div class="pulse-fill yellow-fill" style="width:12%"></div></div>
              </div>
            </div>
          </div>

          <!-- Stats Column -->
          <div class="stats-col">
            <!-- Avg Delivery Time -->
            <div class="stat-card">
              <div class="stat-header">
                <span class="stat-label">AVG. DELIVERY TIME</span>
                <div class="stat-icon-wrap dark">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 16 14"/>
                  </svg>
                </div>
              </div>
              <div class="stat-value">24.5<span class="stat-unit">min</span></div>
              <div class="stat-chart">
                <svg viewBox="0 0 200 70" class="bar-chart">
                  <rect x="10" y="35" width="22" height="30" rx="3" fill="rgba(255,255,255,0.15)"/>
                  <rect x="42" y="22" width="22" height="43" rx="3" fill="rgba(255,255,255,0.2)"/>
                  <rect x="74" y="18" width="22" height="47" rx="3" fill="rgba(255,255,255,0.25)"/>
                  <rect x="106" y="10" width="22" height="55" rx="3" fill="rgba(255,255,255,0.3)"/>
                  <rect x="138" y="5" width="22" height="60" rx="3" fill="rgba(255,255,255,0.4)"/>
                  <rect x="170" y="0" width="22" height="65" rx="3" fill="white"/>
                </svg>
              </div>
            </div>

            <!-- Fuel Efficiency -->
            <div class="stat-card light">
              <div class="stat-header">
                <span class="stat-label dark-label">FUEL EFFICIENCY</span>
                <div class="stat-icon-wrap green">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 2.5-.78 4.78-2 6.56"/>
                    <path d="M11 20a7 7 0 0 0 0-14"/>
                  </svg>
                </div>
              </div>
              <div class="stat-value dark-val">9.2<span class="stat-unit dark-unit">km/l</span></div>
              <div class="trend positive">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
                  <polyline points="17 6 23 6 23 12"/>
                </svg>
                +4.2% from last week
              </div>
              <div class="sparkline-wrap">
                <svg viewBox="0 0 200 60" class="sparkline">
                  <polyline
                    points="0,45 30,38 60,42 90,30 120,35 150,20 180,28 200,15"
                    fill="none" stroke="#10b981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Driver Grid -->
        <div class="grid-card">
          <div class="grid-header">
            <div>
              <h2 class="grid-title">Fleet Driver Manifest</h2>
              <p class="grid-sub">Real-time shift tracking and performance metrics</p>
            </div>
            <div class="grid-actions">
              <button class="btn-add" (click)="toggleAddForm()">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                Add Driver
              </button>
              <button class="btn-export" (click)="exportCSV()">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                Export CSV
              </button>
            </div>
          </div>

          <div class="table-wrap">
            <table class="driver-table">
              <thead>
                <tr>
                  <th>DRIVER ID</th>
                  <th>OPERATOR NAME</th>
                  <th>VEHICLE</th>
                  <th>STATUS</th>
                  <th>ROUTE PROGRESS</th>
                  <th>EFFICIENCY</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                <!-- Add Form Row (inline grid-in-grid) -->
                <tr *ngIf="showAddForm()" class="add-form-row">
                  <td colspan="7">
                    <div class="inline-form">
                      <div class="inline-form-header">
                        <span>New Driver</span>
                        <button class="close-inline" (click)="toggleAddForm()">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                          </svg>
                        </button>
                      </div>
                      <div class="inline-form-grid">
                        <div class="form-field">
                          <label>Operator Name *</label>
                          <input [(ngModel)]="newDriver.operatorName" placeholder="Full name" class="tbl-input" />
                        </div>
                        <div class="form-field">
                          <label>Vehicle *</label>
                          <input [(ngModel)]="newDriver.vehicle" placeholder="e.g. Volvo FH16" class="tbl-input" />
                        </div>
                        <div class="form-field">
                          <label>License Plate *</label>
                          <input [(ngModel)]="newDriver.licensePlate" placeholder="e.g. 44-BB-92" class="tbl-input" />
                        </div>
                        <div class="form-field">
                          <label>Status</label>
                          <select [(ngModel)]="newDriver.status" class="tbl-input">
                            <option value="ACTIVE">Active</option>
                            <option value="AT REST">At Rest</option>
                            <option value="DELAYED">Delayed</option>
                          </select>
                        </div>
                        <div class="form-field">
                          <label>Route Progress (%)</label>
                          <input type="number" [(ngModel)]="newDriver.routeProgress" min="0" max="100" class="tbl-input" />
                        </div>
                        <div class="form-field">
                          <label>Efficiency (%)</label>
                          <input type="number" [(ngModel)]="newDriver.efficiency" min="0" max="100" step="0.1" class="tbl-input" />
                        </div>
                      </div>
                      <div class="inline-form-footer">
                        <button class="btn-cancel-sm" (click)="toggleAddForm()">Cancel</button>
                        <button class="btn-save-sm" (click)="addDriver()">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                            <polyline points="20 6 9 17 4 12"/>
                          </svg>
                          Save Driver
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>

                <!-- Driver Rows -->
                <ng-container *ngFor="let driver of filteredDrivers()">
                  <!-- Edit Row (inline) -->
                  <tr *ngIf="editingId() === driver.id" class="edit-row">
                    <td colspan="7">
                      <div class="inline-form edit-form">
                        <div class="inline-form-header">
                          <span>Edit — {{ driver.driverId }}</span>
                          <button class="close-inline" (click)="cancelEdit()">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                            </svg>
                          </button>
                        </div>
                        <div class="inline-form-grid">
                          <div class="form-field">
                            <label>Operator Name</label>
                            <input [(ngModel)]="editForm.operatorName" class="tbl-input" />
                          </div>
                          <div class="form-field">
                            <label>Vehicle</label>
                            <input [(ngModel)]="editForm.vehicle" class="tbl-input" />
                          </div>
                          <div class="form-field">
                            <label>License Plate</label>
                            <input [(ngModel)]="editForm.licensePlate" class="tbl-input" />
                          </div>
                          <div class="form-field">
                            <label>Status</label>
                            <select [(ngModel)]="editForm.status" class="tbl-input">
                              <option value="ACTIVE">Active</option>
                              <option value="AT REST">At Rest</option>
                              <option value="DELAYED">Delayed</option>
                            </select>
                          </div>
                          <div class="form-field">
                            <label>Route Progress (%)</label>
                            <input type="number" [(ngModel)]="editForm.routeProgress" min="0" max="100" class="tbl-input" />
                          </div>
                          <div class="form-field">
                            <label>Efficiency (%)</label>
                            <input type="number" [(ngModel)]="editForm.efficiency" min="0" max="100" step="0.1" class="tbl-input" />
                          </div>
                        </div>
                        <div class="inline-form-footer">
                          <button class="btn-cancel-sm" (click)="cancelEdit()">Cancel</button>
                          <button class="btn-save-sm" (click)="saveEdit(driver)">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                              <polyline points="20 6 9 17 4 12"/>
                            </svg>
                            Update Driver
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>

                  <!-- Normal Row -->
                  <tr *ngIf="editingId() !== driver.id" class="driver-row">
                    <td><span class="driver-id">{{ driver.driverId }}</span></td>
                    <td>
                      <div class="op-name-cell">
                        <div class="op-avatar">{{ getInitials(driver.operatorName) }}</div>
                        <span class="op-name">{{ driver.operatorName }}</span>
                      </div>
                    </td>
                    <td><span class="vehicle-text">{{ driver.vehicle }} • {{ driver.licensePlate }}</span></td>
                    <td>
                      <span class="status-badge" [class]="'status-' + driver.status.toLowerCase().replace(' ', '-')">
                        <span class="status-dot"></span>
                        {{ driver.status }}
                      </span>
                    </td>
                    <td>
                      <div class="progress-cell">
                        <div class="progress-bar">
                          <div class="progress-fill" [style.width.%]="driver.routeProgress" [class]="getProgressClass(driver.status)"></div>
                        </div>
                        <span class="progress-label">{{ driver.routeProgress === 100 ? 'Done' : driver.routeProgress + '%' }}</span>
                      </div>
                    </td>
                    <td><span class="efficiency" [class]="getEfficiencyClass(driver.efficiency)">{{ driver.efficiency.toFixed(1) }}%</span></td>
                    <td>
                      <div class="action-btns">
                        <button class="act-btn edit-btn" (click)="startEdit(driver)" title="Edit">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                          </svg>
                        </button>
                        <button class="act-btn del-btn" (click)="deleteDriver(driver)" title="Delete">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="3 6 5 6 21 6"/>
                            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                            <path d="M10 11v6"/><path d="M14 11v6"/>
                            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                </ng-container>

                <!-- Empty State -->
                <tr *ngIf="filteredDrivers().length === 0 && !showAddForm()">
                  <td colspan="7" class="empty-state">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" stroke-width="1.5">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                      <circle cx="9" cy="7" r="4"/>
                    </svg>
                    <p>No drivers found</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard { min-height: 100vh; background: #f1f4f8; display: flex; flex-direction: column; }
    .topbar {
      background: white;
      padding: 14px 28px;
      display: flex;
      align-items: center;
      gap: 20px;
      border-bottom: 1px solid #e9ecf0;
      position: sticky;
      top: 0;
      z-index: 10;
    }
    .search-wrap {
      position: relative;
      flex: 1;
      max-width: 420px;
    }
    .search-icon {
      position: absolute;
      left: 12px;
      top: 50%;
      transform: translateY(-50%);
      color: #9ca3af;
    }
    .search-input {
      width: 100%;
      padding: 9px 14px 9px 38px;
      border: 1.5px solid #e5e7eb;
      border-radius: 8px;
      font-size: 13px;
      color: #374151;
      background: #f9fafb;
      outline: none;
      box-sizing: border-box;
    }
    .search-input:focus { border-color: #0f2140; background: white; }
    .topbar-right {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-left: auto;
    }
    .topbar-title {
      font-size: 15px;
      font-weight: 600;
      color: #1f2937;
      margin-right: 12px;
    }
    .icon-btn {
      width: 36px;
      height: 36px;
      background: none;
      border: 1.5px solid #e5e7eb;
      border-radius: 8px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #6b7280;
      position: relative;
      transition: all 0.18s;
    }
    .icon-btn:hover { background: #f3f4f6; border-color: #d1d5db; color: #374151; }
    .notif-dot {
      position: absolute;
      top: 6px;
      right: 6px;
      width: 7px;
      height: 7px;
      background: #ef4444;
      border-radius: 50%;
      border: 1.5px solid white;
    }
    .user-badge {
      width: 34px;
      height: 34px;
      background: linear-gradient(135deg, #0f2140, #1a3a5c);
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 13px;
      font-weight: 700;
    }
    .content { padding: 24px 28px; display: flex; flex-direction: column; gap: 20px; }
    .top-row { display: grid; grid-template-columns: 1fr 300px; gap: 20px; }
    .map-card {
      background: white;
      border-radius: 14px;
      overflow: hidden;
      box-shadow: 0 1px 4px rgba(0,0,0,0.06);
      position: relative;
    }
    .live-badge {
      position: absolute;
      top: 14px;
      left: 14px;
      z-index: 2;
      background: white;
      padding: 7px 14px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      color: #1f2937;
      box-shadow: 0 2px 8px rgba(0,0,0,0.12);
      display: flex;
      align-items: center;
      gap: 7px;
    }
    .live-dot {
      width: 8px;
      height: 8px;
      background: #10b981;
      border-radius: 50%;
      animation: pulse 1.5s ease-in-out infinite;
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.6; transform: scale(1.2); }
    }
    .map-svg-wrap { width: 100%; height: 350px; overflow: hidden; }
    .map-svg { width: 100%; height: 100%; object-fit: cover; }
    .network-pulse {
      padding: 16px 20px;
      background: rgba(15,33,64,0.92);
      position: absolute;
      bottom: 14px;
      left: 14px;
      border-radius: 10px;
      min-width: 220px;
    }
    .pulse-title { color: rgba(255,255,255,0.6); font-size: 10px; font-weight: 700; letter-spacing: 1px; margin-bottom: 12px; }
    .pulse-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px; }
    .pulse-label { font-size: 11px; color: rgba(255,255,255,0.55); letter-spacing: 0.5px; }
    .pulse-value { font-size: 12px; font-weight: 700; }
    .pulse-value.green { color: #34d399; }
    .pulse-value.yellow { color: #fbbf24; }
    .pulse-bar-wrap { margin-bottom: 10px; }
    .pulse-bar { height: 5px; background: rgba(255,255,255,0.1); border-radius: 3px; overflow: hidden; }
    .pulse-fill { height: 100%; border-radius: 3px; }
    .green-fill { background: #10b981; }
    .yellow-fill { background: #f59e0b; }

    .stats-col { display: flex; flex-direction: column; gap: 16px; }
    .stat-card {
      background: linear-gradient(135deg, #0a1628, #0f2140);
      border-radius: 14px;
      padding: 20px;
      flex: 1;
      box-shadow: 0 2px 8px rgba(15,33,64,0.2);
    }
    .stat-card.light { background: white; box-shadow: 0 1px 4px rgba(0,0,0,0.06); }
    .stat-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px; }
    .stat-label { font-size: 10px; font-weight: 700; letter-spacing: 0.8px; color: rgba(255,255,255,0.5); }
    .dark-label { color: #94a3b8; }
    .stat-icon-wrap {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .stat-icon-wrap.dark { background: rgba(255,255,255,0.1); }
    .stat-icon-wrap.green { background: #10b981; }
    .stat-value {
      font-size: 42px;
      font-weight: 800;
      color: white;
      line-height: 1;
      margin-bottom: 12px;
      letter-spacing: -1px;
    }
    .stat-value.dark-val { color: #0f2140; }
    .stat-unit { font-size: 16px; font-weight: 500; margin-left: 4px; }
    .dark-unit { color: #64748b; }
    .stat-chart { margin-top: 4px; }
    .bar-chart { width: 100%; height: 65px; }
    .trend {
      display: flex;
      align-items: center;
      gap: 5px;
      font-size: 12px;
      font-weight: 600;
      margin-bottom: 12px;
    }
    .trend.positive { color: #10b981; }
    .sparkline-wrap { }
    .sparkline { width: 100%; height: 55px; }

    .grid-card {
      background: white;
      border-radius: 14px;
      box-shadow: 0 1px 4px rgba(0,0,0,0.06);
      overflow: hidden;
    }
    .grid-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding: 20px 24px 16px;
      border-bottom: 1px solid #f1f4f8;
    }
    .grid-title { font-size: 17px; font-weight: 700; color: #0f2140; margin: 0 0 3px; }
    .grid-sub { font-size: 12px; color: #94a3b8; margin: 0; }
    .grid-actions { display: flex; gap: 10px; }
    .btn-add {
      display: flex;
      align-items: center;
      gap: 7px;
      padding: 9px 18px;
      background: linear-gradient(135deg, #0f2140, #1a3a5c);
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.18s;
    }
    .btn-add:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(15,33,64,0.3); }
    .btn-export {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 9px 16px;
      background: white;
      color: #374151;
      border: 1.5px solid #e5e7eb;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.18s;
    }
    .btn-export:hover { border-color: #0f2140; color: #0f2140; }
    .table-wrap { overflow-x: auto; }
    .driver-table { width: 100%; border-collapse: collapse; }
    .driver-table thead tr {
      border-bottom: 1px solid #f1f4f8;
    }
    .driver-table th {
      padding: 12px 20px;
      text-align: left;
      font-size: 11px;
      font-weight: 700;
      color: #94a3b8;
      letter-spacing: 0.6px;
      white-space: nowrap;
    }
    .driver-row td {
      padding: 14px 20px;
      border-bottom: 1px solid #f8fafc;
      vertical-align: middle;
    }
    .driver-row:last-child td { border-bottom: none; }
    .driver-row:hover td { background: #f9fafb; }
    .driver-id { font-size: 12px; font-weight: 700; color: #64748b; font-family: monospace; }
    .op-name-cell { display: flex; align-items: center; gap: 10px; }
    .op-avatar {
      width: 34px;
      height: 34px;
      background: linear-gradient(135deg, #0f2140, #1a3a5c);
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 11px;
      font-weight: 700;
      flex-shrink: 0;
    }
    .op-name { font-size: 14px; font-weight: 600; color: #1f2937; }
    .vehicle-text { font-size: 13px; color: #374151; }
    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 10px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.3px;
    }
    .status-dot { width: 6px; height: 6px; border-radius: 50%; }
    .status-active { background: #dcfce7; color: #15803d; }
    .status-active .status-dot { background: #16a34a; }
    .status-at-rest { background: #fef9c3; color: #92400e; }
    .status-at-rest .status-dot { background: #f59e0b; }
    .status-delayed { background: #fee2e2; color: #991b1b; }
    .status-delayed .status-dot { background: #ef4444; }
    .progress-cell { display: flex; align-items: center; gap: 10px; }
    .progress-bar {
      width: 90px;
      height: 6px;
      background: #e5e7eb;
      border-radius: 3px;
      overflow: hidden;
      flex-shrink: 0;
    }
    .progress-fill { height: 100%; border-radius: 3px; transition: width 0.3s; }
    .progress-active { background: #0f2140; }
    .progress-rest { background: #10b981; }
    .progress-delayed { background: #ef4444; }
    .progress-label { font-size: 12px; color: #374151; font-weight: 500; }
    .efficiency { font-size: 15px; font-weight: 800; }
    .eff-high { color: #059669; }
    .eff-mid { color: #d97706; }
    .eff-low { color: #dc2626; }
    .action-btns { display: flex; gap: 6px; }
    .act-btn {
      width: 30px;
      height: 30px;
      border: 1.5px solid #e5e7eb;
      border-radius: 6px;
      background: white;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.18s;
    }
    .edit-btn { color: #3b82f6; }
    .edit-btn:hover { background: #eff6ff; border-color: #bfdbfe; }
    .del-btn { color: #ef4444; }
    .del-btn:hover { background: #fef2f2; border-color: #fecaca; }

    /* Inline form (grid-in-grid) */
    .add-form-row td, .edit-row td { padding: 0 !important; }
    .inline-form {
      margin: 6px 12px;
      background: #f8faff;
      border: 1.5px solid #c7d2fe;
      border-radius: 10px;
      overflow: hidden;
    }
    .inline-form.edit-form { border-color: #a7f3d0; background: #f0fdf9; }
    .inline-form-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 11px 16px;
      background: #eef2ff;
      border-bottom: 1px solid #c7d2fe;
      font-size: 13px;
      font-weight: 700;
      color: #3730a3;
    }
    .inline-form.edit-form .inline-form-header {
      background: #d1fae5;
      border-color: #a7f3d0;
      color: #065f46;
    }
    .close-inline {
      background: none;
      border: none;
      cursor: pointer;
      color: #6b7280;
      display: flex;
      align-items: center;
      padding: 2px;
    }
    .close-inline:hover { color: #ef4444; }
    .inline-form-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 14px;
      padding: 16px;
    }
    .form-field { display: flex; flex-direction: column; gap: 5px; }
    .form-field label { font-size: 11px; font-weight: 700; color: #64748b; letter-spacing: 0.3px; }
    .tbl-input {
      padding: 8px 10px;
      border: 1.5px solid #e5e7eb;
      border-radius: 6px;
      font-size: 13px;
      color: #1f2937;
      background: white;
      outline: none;
      width: 100%;
      box-sizing: border-box;
    }
    .tbl-input:focus { border-color: #0f2140; box-shadow: 0 0 0 2px rgba(15,33,64,0.08); }
    .inline-form-footer {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      padding: 12px 16px;
      border-top: 1px solid #e5e7eb;
      background: rgba(255,255,255,0.5);
    }
    .btn-cancel-sm {
      padding: 7px 16px;
      border: 1.5px solid #e5e7eb;
      border-radius: 6px;
      background: white;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      color: #374151;
    }
    .btn-cancel-sm:hover { border-color: #d1d5db; background: #f9fafb; }
    .btn-save-sm {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 7px 16px;
      background: #0f2140;
      color: white;
      border: none;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.18s;
    }
    .btn-save-sm:hover { background: #1a3a5c; }
    .empty-state {
      text-align: center;
      padding: 48px 20px !important;
      color: #9ca3af;
    }
    .empty-state p { margin-top: 10px; font-size: 14px; }
  `]
})
export class DashboardComponent {
  searchQuery = '';
  showAddForm = signal(false);
  editingId = signal<string | null>(null);

  newDriver: DriverForm = this.emptyForm();
  editForm: DriverForm & { id?: string } = this.emptyForm();

  constructor(
    public driverSvc: DriverService,
    public toast: ToastService
  ) {}

  filteredDrivers() {
    const q = this.searchQuery.toLowerCase();
    if (!q) return this.driverSvc.drivers();
    return this.driverSvc.drivers().filter(d =>
      d.operatorName.toLowerCase().includes(q) ||
      d.driverId.toLowerCase().includes(q) ||
      d.vehicle.toLowerCase().includes(q)
    );
  }

  toggleAddForm(): void {
    this.showAddForm.update(v => !v);
    if (this.showAddForm()) {
      this.newDriver = this.emptyForm();
      this.editingId.set(null);
    }
  }

  addDriver(): void {
    if (!this.newDriver.operatorName.trim() || !this.newDriver.vehicle.trim() || !this.newDriver.licensePlate.trim()) {
      this.toast.error('Please fill in all required fields.', 'Validation Error');
      return;
    }
    this.driverSvc.add({
      operatorName: this.newDriver.operatorName,
      vehicle: this.newDriver.vehicle,
      licensePlate: this.newDriver.licensePlate,
      status: this.newDriver.status,
      routeProgress: Number(this.newDriver.routeProgress),
      efficiency: Number(this.newDriver.efficiency),
      avatar: this.getInitials(this.newDriver.operatorName)
    });
    this.toast.success(`Driver ${this.newDriver.operatorName} added successfully!`, 'Driver Added');
    this.showAddForm.set(false);
    this.newDriver = this.emptyForm();
  }

  startEdit(driver: Driver): void {
    this.editingId.set(driver.id);
    this.showAddForm.set(false);
    this.editForm = {
      operatorName: driver.operatorName,
      vehicle: driver.vehicle,
      licensePlate: driver.licensePlate,
      status: driver.status,
      routeProgress: driver.routeProgress,
      efficiency: driver.efficiency,
      id: driver.id
    };
  }

  saveEdit(driver: Driver): void {
    this.driverSvc.update({
      ...driver,
      operatorName: this.editForm.operatorName,
      vehicle: this.editForm.vehicle,
      licensePlate: this.editForm.licensePlate,
      status: this.editForm.status,
      routeProgress: Number(this.editForm.routeProgress),
      efficiency: Number(this.editForm.efficiency)
    });
    this.toast.success(`Driver ${this.editForm.operatorName} updated successfully!`, 'Driver Updated');
    this.editingId.set(null);
  }

  cancelEdit(): void {
    this.editingId.set(null);
  }

  deleteDriver(driver: Driver): void {
    this.driverSvc.delete(driver.id);
    this.toast.warning(`Driver ${driver.operatorName} has been removed.`, 'Driver Deleted');
  }

  exportCSV(): void {
    const headers = ['Driver ID', 'Operator Name', 'Vehicle', 'License Plate', 'Status', 'Route Progress', 'Efficiency'];
    const rows = this.driverSvc.drivers().map(d =>
      [d.driverId, d.operatorName, d.vehicle, d.licensePlate, d.status, d.routeProgress + '%', d.efficiency + '%']
    );
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'fleet-drivers.csv';
    a.click();
    this.toast.success('CSV file downloaded.', 'Export Successful');
  }

  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }

  getProgressClass(status: DriverStatus): string {
    if (status === 'ACTIVE') return 'progress-active';
    if (status === 'AT REST') return 'progress-rest';
    return 'progress-delayed';
  }

  getEfficiencyClass(eff: number): string {
    if (eff >= 90) return 'efficiency eff-high';
    if (eff >= 75) return 'efficiency eff-mid';
    return 'efficiency eff-low';
  }

  private emptyForm(): DriverForm {
    return { operatorName: '', vehicle: '', licensePlate: '', status: 'ACTIVE', routeProgress: 0, efficiency: 90 };
  }
}
