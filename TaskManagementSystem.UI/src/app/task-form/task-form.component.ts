import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TaskService } from '../services/task.service';
import { TaskItem } from '../models/task-item.model';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
  ],
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css'],
})
export class TaskFormComponent {
  task: TaskItem = {
    Id: 0,
    Title: '',
    Description: '',
    IsCompleted: false,
    DueDate: new Date(),
  };

  constructor(
    private router: Router, // To navigate back to the task list
    private taskService: TaskService // To add a new task
  ) {}

  saveTask(): void {
    // Add the new task to the backend
    this.taskService.createTask(this.task).subscribe(() => {
      // Navigate back to the task list after saving
      this.router.navigate(['/']);
    });
  }

  cancel(): void {
    // Navigate back to the task list without saving
    this.router.navigate(['/']);
  }
}
