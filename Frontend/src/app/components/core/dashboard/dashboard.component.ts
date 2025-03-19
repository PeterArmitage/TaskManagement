import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { RouterModule } from '@angular/router';
import { TaskService } from '../../../services/task.service';
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';
import { TaskItem } from '../../../models/task-item.model';

interface TaskStats {
  total: number;
  completed: number;
  inProgress: number;
  pending: number;
  completionRate: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    MatProgressBarModule,
    RouterModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  taskStats: TaskStats = {
    total: 0,
    completed: 0,
    inProgress: 0,
    pending: 0,
    completionRate: 0,
  };

  recentTasks: TaskItem[] = [];
  isLoading = true;
  error = '';

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.loadTaskStats();
    this.loadRecentTasks();
  }

  loadTaskStats(): void {
    this.taskService
      .getTasks()
      .pipe(
        map((tasks) => {
          const taskArray = Array.isArray(tasks) ? tasks : [];
          const total = taskArray.length;

          taskArray.forEach((task) => {
            if (!task.status) {
              task.status = task.isCompleted ? 'Completed' : 'Pending';
            }
          });

          const completed = taskArray.filter(
            (task) => task.status === 'Completed' || task.isCompleted
          ).length;

          const inProgress = taskArray.filter(
            (task) => task.status === 'In Progress'
          ).length;

          const pending = taskArray.filter(
            (task) =>
              task.status === 'Pending' ||
              (!task.isCompleted && task.status !== 'In Progress')
          ).length;

          return {
            total,
            completed,
            inProgress,
            pending,
            completionRate: total > 0 ? (completed / total) * 100 : 0,
          };
        }),
        catchError((error) => {
          this.error = 'Failed to load task statistics';
          console.error('Error loading task stats:', error);
          return of({
            total: 0,
            completed: 0,
            inProgress: 0,
            pending: 0,
            completionRate: 0,
          });
        })
      )
      .subscribe((stats) => {
        this.taskStats = stats;
        this.isLoading = false;
      });
  }

  loadRecentTasks(): void {
    this.taskService
      .getTasks()
      .pipe(
        map((tasks) => {
          const taskArray = Array.isArray(tasks) ? tasks : [];

          taskArray.forEach((task) => {
            if (!task.createdAt) {
              task.createdAt = new Date().toISOString();
            }
            if (!task.status) {
              task.status = task.isCompleted ? 'Completed' : 'Pending';
            }
          });

          return taskArray
            .sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            )
            .slice(0, 5);
        }),
        catchError((error) => {
          this.error = 'Failed to load recent tasks';
          console.error('Error loading recent tasks:', error);
          return of([]);
        })
      )
      .subscribe((tasks) => {
        this.recentTasks = tasks;
        this.isLoading = false;
      });
  }

  getStatusColor(status: string | undefined): string {
    switch (status) {
      case 'Completed':
        return 'green';
      case 'In Progress':
        return 'orange';
      case 'Pending':
        return 'gray';
      default:
        return 'black';
    }
  }
}
