import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly VALID_EMAIL = 'admin@gmail.com';
  private readonly VALID_PASSWORD = '123456';

  isLoggedIn = signal<boolean>(false);

  constructor() {
    const stored = localStorage.getItem('lp_auth');
    if (stored === 'true') this.isLoggedIn.set(true);
  }

  login(email: string, password: string): boolean {
    if (email === this.VALID_EMAIL && password === this.VALID_PASSWORD) {
      this.isLoggedIn.set(true);
      localStorage.setItem('lp_auth', 'true');
      return true;
    }
    return false;
  }

  logout(): void {
    this.isLoggedIn.set(false);
    localStorage.removeItem('lp_auth');
  }
}
