import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { BoardComponent } from './board/board.component';
import { ListComponent } from './list/list.component';
import { CardComponent } from './card/card.component';
import { BoardFormComponent } from './board-form/board-form.component';
import { ListFormComponent } from './list-form/list-form.component';
import { CardFormComponent } from './card-form/card-form.component';

export const routes: Routes = [
  { path: '', component: HomeComponent }, // Landing page
  { path: 'boards', component: BoardComponent }, // Board list page
  { path: 'boards/add', component: BoardFormComponent }, // Add board page
  { path: 'boards/:id/lists', component: ListComponent }, // List page for a specific board
  { path: 'boards/:id/lists/add', component: ListFormComponent }, // Add list page
  { path: 'lists/:id/cards', component: CardComponent }, // Card page for a specific list
  { path: 'lists/:id/cards/add', component: CardFormComponent }, // Add card page
];
