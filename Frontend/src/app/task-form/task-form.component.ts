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
  styleUrls: ['./task-form.component.scss'],
})
export class TaskFormComponent {
  task: TaskItem = {
    id: 0,
    title: '',
    description: '',
    isCompleted: false,
    dueDate: new Date().toISOString().split('T')[0],
  };

  constructor(private router: Router, private taskService: TaskService) {}

  saveTask(): void {
    const formattedTask = {
      ...this.task,
      dueDate: this.task.dueDate,
    };

    this.taskService.createTask(formattedTask).subscribe({
      next: () => {
        this.router.navigate(['/tasks']);
      },
      error: (err) => {
        console.error('Error creating task:', err);
        alert('Failed to create task. Please try again.');
      },
    });
  }

  cancel(): void {
    this.router.navigate(['/tasks']);
  }
}
