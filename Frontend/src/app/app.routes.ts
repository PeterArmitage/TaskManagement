import { Routes } from '@angular/router';
import { inject } from '@angular/core';
import { HomeComponent } from './components/core/home/home.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { NotFoundComponent } from './components/core/not-found/not-found.component';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { DashboardComponent } from './components/core/dashboard/dashboard.component';
import { ProfileComponent } from './components/core/profile/profile.component';
import { TasksComponent } from './components/tasks/tasks/tasks.component';

// Auth guard function
const authGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true;
  }

  // Redirect to login page if not authenticated
  return router.parseUrl('/login');
};

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '', component: HomeComponent, canActivate: [() => authGuard()] }, // Landing page
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [() => authGuard()],
  }, // Dashboard page
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [() => authGuard()],
  }, // Profile page
  {
    path: 'tasks',
    component: TasksComponent,
    canActivate: [() => authGuard()],
  }, // Tasks page
  { path: '404', component: NotFoundComponent },
  { path: '**', redirectTo: '/404' },
];
