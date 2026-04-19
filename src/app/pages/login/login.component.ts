import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  template: `
    <div class="login-bg">
      <div class="login-card">
        <div class="login-brand">
          <div class="brand-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <rect x="1" y="3" width="15" height="13" rx="2" fill="white"/>
              <path d="M16 8h5l2 4v3h-7V8z" fill="white"/>
              <circle cx="5.5" cy="18.5" r="2.5" fill="white"/>
              <circle cx="18.5" cy="18.5" r="2.5" fill="white"/>
            </svg>
          </div>
          <div>
            <h1 class="brand-name">Logistics Pro</h1>
            <p class="brand-sub">National Fleet Admin</p>
          </div>
        </div>

        <div class="login-body">
          <h2 class="login-title">Welcome back</h2>
          <p class="login-desc">Sign in to access your fleet dashboard</p>

          <form (ngSubmit)="onSubmit()" class="login-form">
            <div class="form-group">
              <label class="form-label">Email Address</label>
              <div class="input-wrap">
                <svg class="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                <input
                  type="email"
                  class="form-input"
                  [(ngModel)]="email"
                  name="email"
                  placeholder="admin@gmail.com"
                  [class.input-error]="showError"
                  autocomplete="email"
                />
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Password</label>
              <div class="input-wrap">
                <svg class="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                <input
                  [type]="showPassword() ? 'text' : 'password'"
                  class="form-input"
                  [(ngModel)]="password"
                  name="password"
                  placeholder="••••••••"
                  [class.input-error]="showError"
                  autocomplete="current-password"
                />
                <button type="button" class="eye-btn" (click)="showPassword.set(!showPassword())">
                  <svg *ngIf="!showPassword()" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                  <svg *ngIf="showPassword()" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                </button>
              </div>
              <p *ngIf="showError" class="error-msg">Invalid email or password. Try admin&#64;gmail.com / 123456</p>
            </div>

            <div class="form-remember">
              <label class="checkbox-wrap">
                <input type="checkbox" [(ngModel)]="rememberMe" name="rememberMe" />
                <span class="checkbox-label">Remember me</span>
              </label>
            </div>

            <button type="submit" class="btn-login" [disabled]="loading()">
              <span *ngIf="!loading()">Sign In</span>
              <span *ngIf="loading()" class="spinner"></span>
            </button>
          </form>

          <div class="login-hint">
            <p>Demo credentials: <strong>admin&#64;gmail.com</strong> / <strong>123456</strong></p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-bg {
      min-height: 100vh;
      background: linear-gradient(135deg, #0a1628 0%, #0f2140 50%, #1a3a5c 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
      position: relative;
      overflow: hidden;
    }
    .login-bg::before {
      content: '';
      position: absolute;
      width: 600px;
      height: 600px;
      background: radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%);
      top: -100px;
      right: -100px;
      pointer-events: none;
    }
    .login-bg::after {
      content: '';
      position: absolute;
      width: 400px;
      height: 400px;
      background: radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%);
      bottom: -50px;
      left: -50px;
      pointer-events: none;
    }
    .login-card {
      background: white;
      border-radius: 16px;
      width: 100%;
      max-width: 440px;
      box-shadow: 0 25px 60px rgba(0,0,0,0.35);
      overflow: hidden;
      position: relative;
      z-index: 1;
    }
    .login-brand {
      background: linear-gradient(135deg, #0a1628, #0f2140);
      padding: 28px 32px;
      display: flex;
      align-items: center;
      gap: 14px;
    }
    .brand-icon {
      width: 48px;
      height: 48px;
      background: rgba(255,255,255,0.12);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .brand-name {
      color: white;
      font-size: 22px;
      font-weight: 700;
      margin: 0;
      letter-spacing: -0.3px;
    }
    .brand-sub {
      color: rgba(255,255,255,0.5);
      font-size: 12px;
      margin: 2px 0 0;
    }
    .login-body {
      padding: 32px;
    }
    .login-title {
      font-size: 24px;
      font-weight: 700;
      color: #0f2140;
      margin: 0 0 6px;
    }
    .login-desc {
      color: #64748b;
      font-size: 14px;
      margin: 0 0 28px;
    }
    .login-form { display: flex; flex-direction: column; gap: 20px; }
    .form-group { display: flex; flex-direction: column; gap: 6px; }
    .form-label {
      font-size: 13px;
      font-weight: 600;
      color: #374151;
      letter-spacing: 0.3px;
    }
    .input-wrap { position: relative; }
    .input-icon {
      position: absolute;
      left: 12px;
      top: 50%;
      transform: translateY(-50%);
      color: #9ca3af;
      pointer-events: none;
    }
    .form-input {
      width: 100%;
      padding: 11px 40px 11px 38px;
      border: 1.5px solid #e5e7eb;
      border-radius: 8px;
      font-size: 14px;
      color: #111827;
      background: #fafafa;
      transition: all 0.2s;
      box-sizing: border-box;
      outline: none;
    }
    .form-input:focus {
      border-color: #0f2140;
      background: white;
      box-shadow: 0 0 0 3px rgba(15,33,64,0.08);
    }
    .form-input.input-error {
      border-color: #ef4444;
      background: #fff5f5;
    }
    .eye-btn {
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      cursor: pointer;
      color: #9ca3af;
      padding: 2px;
      display: flex;
      align-items: center;
    }
    .eye-btn:hover { color: #374151; }
    .error-msg {
      color: #ef4444;
      font-size: 12px;
      margin: 4px 0 0;
    }
    .form-remember { display: flex; align-items: center; }
    .checkbox-wrap {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
    }
    .checkbox-wrap input[type="checkbox"] {
      width: 16px;
      height: 16px;
      accent-color: #0f2140;
      cursor: pointer;
    }
    .checkbox-label { font-size: 13px; color: #374151; }
    .btn-login {
      width: 100%;
      padding: 13px;
      background: linear-gradient(135deg, #0f2140, #1a3a5c);
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 15px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 46px;
    }
    .btn-login:hover:not(:disabled) {
      background: linear-gradient(135deg, #1a3a5c, #234d7a);
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(15,33,64,0.35);
    }
    .btn-login:disabled { opacity: 0.7; cursor: not-allowed; }
    .spinner {
      width: 20px;
      height: 20px;
      border: 2px solid rgba(255,255,255,0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    .login-hint {
      margin-top: 20px;
      padding: 12px;
      background: #f0f9ff;
      border-radius: 8px;
      border: 1px solid #bae6fd;
      text-align: center;
    }
    .login-hint p {
      font-size: 12px;
      color: #0369a1;
      margin: 0;
    }
    .login-hint strong { color: #0f2140; }
  `]
})
export class LoginComponent {
  email = '';
  password = '';
  rememberMe = false;
  showError = false;
  showPassword = signal(false);
  loading = signal(false);

  constructor(
    private auth: AuthService,
    private router: Router,
    private toast: ToastService
  ) {}

  onSubmit(): void {
    this.showError = false;
    this.loading.set(true);
    setTimeout(() => {
      const ok = this.auth.login(this.email.trim(), this.password);
      this.loading.set(false);
      if (ok) {
        this.toast.success('Welcome back, Admin User!', 'Login Successful');
        this.router.navigate(['/dashboard']);
      } else {
        this.showError = true;
        this.toast.error('Invalid credentials. Please try again.', 'Login Failed');
      }
    }, 800);
  }
}
