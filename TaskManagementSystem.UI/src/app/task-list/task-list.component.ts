import { Component, OnInit } from '@angular/core';
import { TaskService } from '../services/task.service';
import { TaskItem } from '../models/task-item.model';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css'],
})
export class TaskListComponent implements OnInit {
  tasks: TaskItem[] = [];
  displayedColumns: string[] = ['title', 'actions'];

  constructor(
    private taskService: TaskService,
    private router: Router // Inject Router for navigation
  ) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.taskService.getTasks().subscribe((tasks) => {
      this.tasks = tasks;
    });
  }

  editTask(task: TaskItem): void {
    // Navigate to the task detail page with the task ID
    this.router.navigate(['/task', task.Id]);
  }

  deleteTask(id: number): void {
    if (confirm('Are you sure you want to delete this task?')) {
      this.taskService.deleteTask(id).subscribe(() => {
        // Reload the task list after deletion
        this.loadTasks();
      });
    }
  }

  addTask(): void {
    this.router.navigate(['/add']);
  }
}
