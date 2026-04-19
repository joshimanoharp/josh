import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

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
        <a routerLink="/dashboard" routerLinkActive="active" class="nav-item">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
            <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
          </svg>
          <span>Dashboard</span>
        </a>
        <a routerLink="/fleet-status" routerLinkActive="active" class="nav-item">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="1" y="3" width="15" height="13" rx="2"/>
            <path d="M16 8h5l2 4v3h-7V8z"/>
            <circle cx="5.5" cy="18.5" r="2.5"/>
            <circle cx="18.5" cy="18.5" r="2.5"/>
          </svg>
          <span>Fleet Status</span>
        </a>
        <a routerLink="/driver-management" routerLinkActive="active" class="nav-item">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
          <span>Driver Management</span>
        </a>
        <a routerLink="/routes" routerLinkActive="active" class="nav-item">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
          </svg>
          <span>Routes</span>
        </a>
        <a routerLink="/analytics" routerLinkActive="active" class="nav-item">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="20" x2="18" y2="10"/>
            <line x1="12" y1="20" x2="12" y2="4"/>
            <line x1="6" y1="20" x2="6" y2="14"/>
          </svg>
          <span>Analytics</span>
        </a>
      </nav>

      <div class="sidebar-user">
        <div class="user-avatar">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
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
    .sidebar {
      width: 240px;
      min-height: 100vh;
      background: #0a1628;
      display: flex;
      flex-direction: column;
      flex-shrink: 0;
    }
    .sidebar-brand {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 24px 20px;
      border-bottom: 1px solid rgba(255,255,255,0.06);
    }
    .brand-icon {
      width: 42px;
      height: 42px;
      background: rgba(255,255,255,0.1);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .brand-name {
      color: white;
      font-size: 17px;
      font-weight: 700;
      letter-spacing: -0.2px;
    }
    .brand-sub {
      color: rgba(255,255,255,0.4);
      font-size: 11px;
      margin-top: 1px;
    }
    .sidebar-nav {
      flex: 1;
      padding: 16px 12px;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .nav-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 11px 14px;
      border-radius: 8px;
      color: rgba(255,255,255,0.55);
      text-decoration: none;
      font-size: 14px;
      font-weight: 500;
      transition: all 0.18s;
      cursor: pointer;
    }
    .nav-item:hover {
      background: rgba(255,255,255,0.06);
      color: rgba(255,255,255,0.85);
    }
    .nav-item.active {
      background: rgba(16,185,129,0.12);
      color: #34d399;
      border-left: 3px solid #10b981;
      padding-left: 11px;
    }
    .sidebar-user {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 16px 20px;
      border-top: 1px solid rgba(255,255,255,0.06);
    }
    .user-avatar {
      width: 38px;
      height: 38px;
      background: linear-gradient(135deg, #10b981, #0d9488);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .user-info { flex: 1; min-width: 0; }
    .user-name {
      color: white;
      font-size: 13px;
      font-weight: 600;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .user-role {
      color: rgba(255,255,255,0.4);
      font-size: 10px;
      letter-spacing: 0.5px;
    }
    .logout-btn {
      background: none;
      border: none;
      color: rgba(255,255,255,0.35);
      cursor: pointer;
      padding: 4px;
      border-radius: 6px;
      display: flex;
      transition: all 0.18s;
    }
    .logout-btn:hover {
      color: #ef4444;
      background: rgba(239,68,68,0.1);
    }
  `]
})
export class SidebarComponent {
  constructor(
    private auth: AuthService,
    private router: Router,
    private toast: ToastService
  ) {}

  logout(): void {
    this.auth.logout();
    this.toast.info('You have been logged out.', 'Goodbye!');
    this.router.navigate(['/login']);
  }
}
