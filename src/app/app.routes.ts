import { Routes } from '@angular/router';
import { AuthGuard } from './core/auth';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./core/auth/components/login').then(m => m.LoginComponent),
    data: {
      title: 'Login'
    }
  },
  {
    path: 'forgot-password',
    loadComponent: () => import('./core/auth/components/forgot-password').then(m => m.ForgotPasswordComponent),
    data: {
      title: 'Forgot Password'
    }
  },
  {
    path: '',
    loadComponent: () => import('./layout/default-layout/default-layout.component').then(m => m.DefaultLayoutComponent),
    canActivate: [AuthGuard],
    data: {
      title: 'Home'
    },
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./views/dashboard/routes').then((m) => m.routes),
        canActivate: [AuthGuard]
      },
      {
        path: 'widgets',
        loadChildren: () => import('./views/widgets/routes').then((m) => m.routes),
        canActivate: [AuthGuard]
      }
    ]
  },
  { path: '**', redirectTo: 'dashboard' }
];
