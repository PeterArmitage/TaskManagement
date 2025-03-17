import { Routes } from '@angular/router';
import { inject } from '@angular/core';
import { HomeComponent } from './home/home.component';
import { BoardComponent } from './board/board.component';
import { ListComponent } from './list/list.component';
import { CardComponent } from './card/card.component';
import { BoardFormComponent } from './board-form/board-form.component';
import { ListFormComponent } from './list-form/list-form.component';
import { CardFormComponent } from './card-form/card-form.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

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
    path: 'boards',
    component: BoardComponent,
    canActivate: [() => authGuard()],
  }, // Board list page
  {
    path: 'boards/add',
    component: BoardFormComponent,
    canActivate: [() => authGuard()],
  }, // Add board page
  {
    path: 'boards/:id/lists',
    component: ListComponent,
    canActivate: [() => authGuard()],
  }, // List page for a specific board
  {
    path: 'boards/:id/lists/add',
    component: ListFormComponent,
    canActivate: [() => authGuard()],
  }, // Add list page
  {
    path: 'lists/:id/cards',
    component: CardComponent,
    canActivate: [() => authGuard()],
  }, // Card page for a specific list
  {
    path: 'lists/:id/cards/add',
    component: CardFormComponent,
    canActivate: [() => authGuard()],
  }, // Add card page
  {
    path: 'lists/:id/cards/edit/:cardId',
    component: CardFormComponent,
    canActivate: [() => authGuard()],
  }, // Edit card page
  { path: '404', component: NotFoundComponent }, // 404 page
  { path: '**', redirectTo: '/404' }, // Redirect to 404 page for any unmatched routes
];
