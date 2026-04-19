import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

interface NavItem { label: string; route: string; icon: string; }

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <aside class="sidebar">
      <div class="sidebar-brand">
        <div class="brand-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <rect x="1" y="3" width="15" height="13" rx="2" fill="white"/>
            <path d="M16 8h5l2 4v3h-7V8z" fill="white"/>
            <circle cx="5.5" cy="18.5" r="2.5" fill="white"/>
            <circle cx="18.5" cy="18.5" r="2.5" fill="white"/>
          </svg>
        </div>
        <div>
          <div class="brand-name">Logistics Pro</div>
          <div class="brand-sub">National Fleet Admin</div>
        </div>
      </div>

      <nav class="sidebar-nav">
        <div class="nav-section-label">MAIN</div>
        <a *ngFor="let item of mainNav" [routerLink]="item.route" routerLinkActive="active" class="nav-item">
          <span class="nav-icon" [innerHTML]="item.icon"></span>
          <span>{{ item.label }}</span>
        </a>

        <div class="nav-section-label ops-label">OPERATIONS</div>
        <a *ngFor="let item of opsNav" [routerLink]="item.route" routerLinkActive="active" class="nav-item">
          <span class="nav-icon" [innerHTML]="item.icon"></span>
          <span>{{ item.label }}</span>
        </a>
      </nav>

      <div class="sidebar-user">
        <div class="user-avatar">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
        </div>
        <div class="user-info">
          <div class="user-name">Admin User</div>
          <div class="user-role">SUPER ADMIN</div>
        </div>
        <button class="logout-btn" (click)="logout()" title="Logout">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
        </button>
      </div>
    </aside>
  `,
  styles: [`
    .sidebar { width: 240px; min-height: 100vh; background: #0a1628; display: flex; flex-direction: column; flex-shrink: 0; }
    .sidebar-brand { display: flex; align-items: center; gap: 12px; padding: 22px 18px; border-bottom: 1px solid rgba(255,255,255,0.06); }
    .brand-icon { width: 42px; height: 42px; background: rgba(255,255,255,0.1); border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .brand-name { color: white; font-size: 17px; font-weight: 700; letter-spacing: -0.2px; }
    .brand-sub { color: rgba(255,255,255,0.4); font-size: 11px; margin-top: 1px; }
    .sidebar-nav { flex: 1; padding: 14px 10px; overflow-y: auto; }
    .nav-section-label { font-size: 9.5px; font-weight: 700; letter-spacing: 1.2px; color: rgba(255,255,255,0.25); padding: 4px 10px 8px; }
    .ops-label { margin-top: 12px; }
    .nav-item { display: flex; align-items: center; gap: 11px; padding: 10px 12px; border-radius: 8px; color: rgba(255,255,255,0.5); text-decoration: none; font-size: 13px; font-weight: 500; transition: all 0.18s; cursor: pointer; margin-bottom: 1px; }
    .nav-item:hover { background: rgba(255,255,255,0.06); color: rgba(255,255,255,0.85); }
    .nav-item.active { background: rgba(16,185,129,0.12); color: #34d399; border-left: 3px solid #10b981; padding-left: 9px; }
    .nav-icon { display: flex; align-items: center; flex-shrink: 0; }
    .sidebar-user { display: flex; align-items: center; gap: 10px; padding: 14px 18px; border-top: 1px solid rgba(255,255,255,0.06); }
    .user-avatar { width: 36px; height: 36px; background: linear-gradient(135deg, #10b981, #0d9488); border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .user-info { flex: 1; min-width: 0; }
    .user-name { color: white; font-size: 12px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .user-role { color: rgba(255,255,255,0.35); font-size: 10px; letter-spacing: 0.5px; }
    .logout-btn { background: none; border: none; color: rgba(255,255,255,0.3); cursor: pointer; padding: 4px; border-radius: 6px; display: flex; transition: all 0.18s; }
    .logout-btn:hover { color: #ef4444; background: rgba(239,68,68,0.1); }
  `]
})
export class SidebarComponent {
  mainNav: NavItem[] = [
    { label: 'Dashboard', route: '/dashboard', icon: `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>` },
    { label: 'Analytics', route: '/analytics', icon: `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>` }
  ];

  opsNav: NavItem[] = [
    { label: 'Fleet Status', route: '/fleet-status', icon: `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h5l2 4v3h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>` },
    { label: 'Driver Management', route: '/driver-management', icon: `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>` },
    { label: 'Routes', route: '/routes', icon: `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>` },
    { label: 'Shipments', route: '/shipments', icon: `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>` },
    { label: 'Maintenance', route: '/maintenance', icon: `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>` },
    { label: 'Fuel Management', route: '/fuel', icon: `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="22" x2="3" y2="2"/><line x1="21" y1="22" x2="21" y2="2"/><path d="M6 22V2h12v20"/><path d="M3 11h18"/></svg>` }
  ];

  constructor(private auth: AuthService, private router: Router, private toast: ToastService) {}

  logout(): void {
    this.auth.logout();
    this.toast.info('You have been logged out.', 'Goodbye!');
    this.router.navigate(['/login']);
  }
}
