import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/autos', pathMatch: 'full' },
  { 
    path: 'autos', 
    loadComponent: () => import('./features/autos/auto-list/auto-list').then(m => m.AutoListComponent) 
  },
  { 
    path: 'admin/autos/nuevo', 
    loadComponent: () => import('./features/autos/auto-form/auto-form').then(m => m.AutoFormComponent) 
  },
  { 
    path: 'admin/autos/editar/:id', 
    loadComponent: () => import('./features/autos/auto-edit/auto-edit').then(m => m.AutoEditComponent) 
  },
  { 
    path: 'admin/usuarios', 
    loadComponent: () => import('./features/admin/user-list/user-list').then(m => m.UserListComponent) 
  },
  { 
  path: 'admin/usuarios/editar/:id', 
  loadComponent: () => import('./features/admin/user-edit/user-edit').then(m => m.UserEditComponent) 
  },
  { 
    path: 'login', 
    loadComponent: () => import('./features/auth/login/login').then(m => m.LoginComponent) 
  },
  { 
    path: 'registro', 
    loadComponent: () => import('./features/auth/register/register').then(m => m.RegisterComponent) 
  },
];