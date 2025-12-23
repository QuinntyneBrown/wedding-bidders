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
    path: 'register-bidder',
    loadComponent: () => import('./pages/register-bidder').then(m => m.RegisterBidder)
  },
  {
    path: 'register-customer',
    loadComponent: () => import('./pages/register-customer').then(m => m.RegisterCustomer)
  },
  {
    path: 'workspace',
    loadComponent: () => import('./pages/workspace').then(m => m.Workspace),
    canActivate: [AuthGuard]
  },
  {
    path: 'weddings',
    loadComponent: () => import('./pages/weddings').then(m => m.Weddings),
    canActivate: [AuthGuard]
  },
  {
    path: 'create-wedding',
    loadComponent: () => import('./pages/create-wedding').then(m => m.CreateWedding),
    canActivate: [AuthGuard]
  },
  {
    path: 'bids',
    loadComponent: () => import('./pages/bids').then(m => m.Bids),
    canActivate: [AuthGuard]
  },
  {
    path: 'bids/:weddingId',
    loadComponent: () => import('./pages/bids').then(m => m.Bids),
    canActivate: [AuthGuard]
  },
  {
    path: 'messages',
    loadComponent: () => import('./pages/messages').then(m => m.Messages),
    canActivate: [AuthGuard]
  },
  {
    path: 'profile',
    loadComponent: () => import('./pages/profile').then(m => m.ProfilePage),
    canActivate: [AuthGuard]
  },
  {
    path: 'report-issue',
    loadComponent: () => import('./pages/report-issue').then(m => m.ReportIssue),
    canActivate: [AuthGuard]
  },
  {
    path: 'payment',
    loadComponent: () => import('./pages/payment').then(m => m.Payment),
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];
