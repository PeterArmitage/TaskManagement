import { Component, OnInit, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TaskService } from '../../../services/task.service';
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import {
  TaskItem,
  TaskComment,
  TaskChecklistItem,
  TaskLabel,
} from '../../../models/task-item.model';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatChipsModule,
    MatDialogModule,
    MatSnackBarModule,
    MatProgressBarModule,
    MatTooltipModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatDividerModule,
    ReactiveFormsModule,
    RouterModule,
  ],
  schemas: [NO_ERRORS_SCHEMA],
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss'],
})
export class TasksComponent implements OnInit {
  tasks: TaskItem[] = [];
  filteredTasks: TaskItem[] = [];
  displayedColumns: string[] = [
    'title',
    'description',
    'status',
    'dueDate',
    'actions',
  ];
  isLoading = true;
  error = '';
  taskForm: FormGroup;
  isEditing = false;
  isCreating = false;
  currentTaskId: number | null = null;
  statusOptions = ['Pending', 'In Progress', 'Completed'];
  filterStatus = 'All';
  priorityOptions = ['Low', 'Medium', 'High', 'Urgent'];
  availableLabels: TaskLabel[] = [
    { name: 'Bug', color: '#f44336' },
    { name: 'Feature', color: '#2196f3' },
    { name: 'Enhancement', color: '#4caf50' },
    { name: 'Documentation', color: '#ff9800' },
    { name: 'Design', color: '#9c27b0' },
  ];

  constructor(
    private taskService: TaskService,
    private authService: AuthService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.taskForm = this.createTaskForm();
  }

  ngOnInit(): void {
    this.taskForm = this.createTaskForm();
    this.loadTasks();
  }

  createTaskForm(): FormGroup {
    return this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', Validators.required],
      status: ['Pending', Validators.required],
      dueDate: ['', Validators.required],
      priority: ['Medium'],
      assignedTo: [''],
      labels: [[]],
      comments: this.fb.array([]),
      checklist: this.fb.array([]),
    });
  }

  get commentsArray(): FormArray {
    return this.taskForm.get('comments') as FormArray;
  }

  get checklistArray(): FormArray {
    return this.taskForm.get('checklist') as FormArray;
  }

  addComment(): void {
    this.commentsArray.push(
      this.fb.group({
        content: ['', Validators.required],
        createdAt: [new Date().toISOString()],
        author: [this.authService.getCurrentUser()?.username || 'Anonymous'],
      })
    );
  }

  removeComment(index: number): void {
    this.commentsArray.removeAt(index);
  }

  addChecklistItem(): void {
    this.checklistArray.push(
      this.fb.group({
        content: ['', Validators.required],
        isCompleted: [false],
      })
    );
  }

  removeChecklistItem(index: number): void {
    this.checklistArray.removeAt(index);
  }

  toggleLabel(label: TaskLabel): void {
    const currentLabels = this.taskForm.get('labels')?.value || [];
    const labelIndex = currentLabels.findIndex(
      (l: TaskLabel) => l.name === label.name
    );

    if (labelIndex === -1) {
      this.taskForm.patchValue({
        labels: [...currentLabels, label],
      });
    } else {
      const newLabels = [...currentLabels];
      newLabels.splice(labelIndex, 1);
      this.taskForm.patchValue({
        labels: newLabels,
      });
    }
  }

  isLabelSelected(label: TaskLabel): boolean {
    const currentLabels = this.taskForm.get('labels')?.value || [];
    return currentLabels.some((l: TaskLabel) => l.name === label.name);
  }

  loadTasks(): void {
    this.isLoading = true;
    this.taskService
      .getTasks()
      .pipe(
        tap((response: any) => {
          console.log('Raw API response:', response);

          let tasksArray: TaskItem[] = [];
          if (response && response['$values']) {
            tasksArray = response['$values'];
          } else if (Array.isArray(response)) {
            tasksArray = response;
          } else {
            console.warn('Unexpected response format:', response);
            tasksArray = [];
          }

          this.tasks = tasksArray.map((task) => ({
            ...task,
            status: task.status || (task.isCompleted ? 'Completed' : 'Pending'),
            createdAt: task.createdAt || new Date().toISOString(),
          }));
          this.filteredTasks = [...this.tasks];
          this.isLoading = false;
        }),
        catchError((error) => {
          this.error = 'Failed to load tasks';
          console.error('Error loading tasks:', error);
          this.isLoading = false;
          return of([]);
        })
      )
      .subscribe();
  }

  filterTasks(status: string): void {
    this.filterStatus = status;
    if (status === 'All') {
      this.filteredTasks = [...this.tasks];
    } else {
      this.filteredTasks = this.tasks.filter((task) => task.status === status);
    }
  }

  openTaskForm(task?: TaskItem): void {
    console.log('openTaskForm called');
    this.taskForm.reset();
    this.taskForm.patchValue({
      status: 'Pending',
      dueDate: new Date().toISOString().split('T')[0],
      priority: 'Medium',
      labels: [],
    });

    while (this.commentsArray.length) {
      this.commentsArray.removeAt(0);
    }

    while (this.checklistArray.length) {
      this.checklistArray.removeAt(0);
    }

    if (task) {
      this.isEditing = true;
      this.isCreating = false;
      this.currentTaskId = task.id;
      this.taskForm.patchValue({
        title: task.title,
        description: task.description,
        status: task.status || (task.isCompleted ? 'Completed' : 'Pending'),
        dueDate: new Date(task.dueDate).toISOString().split('T')[0],
        priority: task.priority || 'Medium',
        assignedTo: task.assignedTo || '',
        labels: task.labels || [],
      });

      if (task.comments && task.comments.length > 0) {
        task.comments.forEach((comment) => {
          this.commentsArray.push(
            this.fb.group({
              content: [comment.content, Validators.required],
              createdAt: [comment.createdAt],
              author: [comment.author || 'Unknown'],
            })
          );
        });
      }

      if (task.checklist && task.checklist.length > 0) {
        task.checklist.forEach((item) => {
          this.checklistArray.push(
            this.fb.group({
              content: [item.content, Validators.required],
              isCompleted: [item.isCompleted],
            })
          );
        });
      }
    } else {
      this.isEditing = false;
      this.isCreating = true;
      this.currentTaskId = null;
    }
  }

  cancelEdit(): void {
    this.resetFormState();
  }

  saveTask(): void {
    if (this.taskForm.invalid) {
      return;
    }

    const taskData = this.taskForm.value;
    const task: TaskItem = {
      id: this.currentTaskId || 0,
      title: taskData.title,
      description: taskData.description,
      isCompleted: taskData.status === 'Completed',
      dueDate: taskData.dueDate,
      createdAt: new Date().toISOString(),
      status: taskData.status,
      priority: taskData.priority,
      assignedTo: taskData.assignedTo,
      comments: taskData.comments,
      checklist: taskData.checklist,
      labels: taskData.labels,
    };

    const saveOperation = this.isEditing
      ? this.taskService.updateTask(task)
      : this.taskService.createTask(task);

    saveOperation.subscribe({
      next: () => {
        this.loadTasks();
        this.resetFormState();
      },
      error: (err) => {
        console.error('Error saving task:', err);
        alert('Failed to save task. Please try again.');
      },
    });
  }

  resetFormState(): void {
    this.isEditing = false;
    this.isCreating = false;
    this.currentTaskId = null;
    this.taskForm.reset();
  }

  deleteTask(id: number): void {
    if (confirm('Are you sure you want to delete this task?')) {
      this.taskService
        .deleteTask(id)
        .pipe(
          tap(() => {
            this.tasks = this.tasks.filter((task) => task.id !== id);
            this.filterTasks(this.filterStatus);
            this.snackBar.open('Task deleted successfully', 'Close', {
              duration: 3000,
            });
          }),
          catchError((error) => {
            console.error('Error deleting task:', error);
            this.snackBar.open('Failed to delete task', 'Close', {
              duration: 3000,
            });
            return of(null);
          })
        )
        .subscribe();
    }
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

  formatDate(dateString: string): string {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    } catch (error) {
      return dateString;
    }
  }

  getCompletedChecklistCount(task: TaskItem): number {
    if (!task.checklist || !Array.isArray(task.checklist)) {
      return 0;
    }
    return task.checklist.filter((item) => item.isCompleted).length;
  }

  // Helper methods for comments and checklist
  saveComment(index: number): void {
    const comment = this.commentsArray.at(index);
    if (comment && comment.valid) {
      this.snackBar.open('Comment saved', 'Close', {
        duration: 1500,
      });
    } else if (comment) {
      comment.markAllAsTouched();
      this.snackBar.open('Please fill out the comment', 'Close', {
        duration: 1500,
      });
    }
  }

  saveChecklistItem(index: number): void {
    const item = this.checklistArray.at(index);
    if (item && item.valid) {
      this.snackBar.open('Checklist item saved', 'Close', {
        duration: 1500,
      });
    } else if (item) {
      item.markAllAsTouched();
      this.snackBar.open('Please fill out the checklist item', 'Close', {
        duration: 1500,
      });
    }
  }
}
