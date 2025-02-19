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
    id: 0,
    title: '',
    description: '',
    isCompleted: false,
    dueDate: new Date(),
  };

  constructor(
    private router: Router, // To navigate back to the task list
    private taskService: TaskService // To add a new task
  ) {}

  saveTask(): void {
    const formattedTask = {
      ...this.task,
      dueDate: new Date(this.task.dueDate),
    };

    this.taskService.createTask(formattedTask).subscribe(() => {
      this.router.navigate(['/']).then(() => {
        window.location.reload(); // Force refresh the page
      });
    });
  }
  cancel(): void {
    // Navigate back to the task list without saving
    this.router.navigate(['/']);
  }
}
