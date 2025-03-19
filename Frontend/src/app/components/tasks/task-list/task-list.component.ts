import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../../services/task.service';
import { TaskItem } from '../../../models/task-item.model';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    RouterModule,
  ],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
})
export class TaskListComponent implements OnInit {
  tasks: TaskItem[] = [];
  task: TaskItem = {
    id: 0,
    title: '',
    description: '',
    dueDate: new Date().toISOString().split('T')[0],
    createdAt: new Date().toISOString(),
    isCompleted: false,
  };
  displayedColumns: string[] = ['title', 'description', 'actions'];

  constructor(private taskService: TaskService, private router: Router) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.taskService.getTasks().subscribe((tasks) => {
      this.tasks = tasks;
    });
  }

  editTask(task: TaskItem): void {
    if (task && task.id) {
      this.router.navigate(['/task', task.id]);
    } else {
      console.error('Task ID is undefined:', task);
    }
  }

  deleteTask(id: number): void {
    if (id) {
      if (confirm('Are you sure you want to delete this task?')) {
        this.taskService.deleteTask(id).subscribe(() => {
          this.loadTasks();
        });
      }
    } else {
      console.error('Task ID is undefined:', id);
    }
  }

  addTask(): void {
    this.router.navigate(['/add']);
  }

  saveTask(): void {
    this.taskService.createTask(this.task).subscribe(() => {
      this.loadTasks();
      this.router.navigate(['/']);
    });
  }
}
