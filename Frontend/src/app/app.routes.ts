import { Routes } from '@angular/router';
import { TaskListComponent } from './task-list/task-list.component';
import { TaskDetailComponent } from './task-detail/task-detail.component';
import { TaskFormComponent } from './task-form/task-form.component';

export const routes: Routes = [
  { path: '', component: TaskListComponent },
  { path: 'task/:id', component: TaskDetailComponent },
  { path: 'add', component: TaskFormComponent },
];
