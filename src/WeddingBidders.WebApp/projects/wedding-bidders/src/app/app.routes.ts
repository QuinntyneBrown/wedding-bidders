import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login').then(m => m.Login)
  },
  {
    path: 'create-account',
    loadComponent: () => import('./pages/create-account').then(m => m.CreateAccount)
  },
  {
    path: 'workspace',
    loadComponent: () => import('./pages/workspace').then(m => m.Workspace),
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];
