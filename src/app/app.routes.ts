import { Routes } from '@angular/router';
import { authGuard, loginGuard } from './guards/auth.guard';
import { LayoutComponent } from './components/layout/layout.component';
import { LoginComponent } from './pages/login/login.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [loginGuard] },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'fleet-status',
        loadComponent: () => import('./pages/fleet-status/fleet-status.component').then(m => m.FleetStatusComponent)
      },
      {
        path: 'driver-management',
        loadComponent: () => import('./pages/driver-management/driver-management.component').then(m => m.DriverManagementComponent)
      },
      {
        path: 'routes',
        loadComponent: () => import('./pages/routes-page/routes-page.component').then(m => m.RoutesPageComponent)
      },
      {
        path: 'analytics',
        loadComponent: () => import('./pages/analytics/analytics.component').then(m => m.AnalyticsComponent)
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: '/dashboard' }
];
