import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { ToastComponent } from '../toast/toast.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, ToastComponent],
  template: `
    <div class="app-layout">
      <app-sidebar />
      <main class="app-main">
        <router-outlet />
      </main>
    </div>
    <app-toast />
  `,
  styles: [`
    .app-layout {
      display: flex;
      min-height: 100vh;
      background: #f1f4f8;
    }
    .app-main {
      flex: 1;
      overflow-y: auto;
      min-width: 0;
    }
  `]
})
export class LayoutComponent {}
