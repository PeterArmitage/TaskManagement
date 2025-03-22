import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { TaskItem } from '../models/task-item.model';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private apiUrl = `${environment.apiUrl}/api/tasks`;

  constructor(private http: HttpClient) {}

  getTasks(): Observable<TaskItem[]> {
    return this.http.get<TaskItem[]>(this.apiUrl).pipe(
      tap((response) => console.log('GetTasks response:', response)),
      catchError(this.handleError)
    );
  }

  getTask(id: number): Observable<TaskItem> {
    return this.http
      .get<TaskItem>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  createTask(task: TaskItem): Observable<TaskItem> {
    console.log('Sending task to backend:', task);

    // Ensure task format matches what backend expects
    const backendTask = {
      title: task.title,
      description: task.description,
      isCompleted: task.isCompleted,
      dueDate: task.dueDate,
      status: task.status,
      createdAt: task.createdAt,
      priority: task.priority,
      assignedTo: task.assignedTo,
      comments: task.comments || [],
      checklist: task.checklist || [],
      labels: task.labels || [],
    };

    console.log('Formatted task for backend:', JSON.stringify(backendTask));

    return this.http
      .post<TaskItem>(this.apiUrl, backendTask, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .pipe(
        tap((response) => console.log('CreateTask response:', response)),
        catchError(this.handleError)
      );
  }

  updateTask(task: TaskItem): Observable<TaskItem> {
    console.log('Updating task with data:', JSON.stringify(task));

    // Ensure all fields are included
    const updateData = {
      id: task.id,
      title: task.title,
      description: task.description,
      isCompleted: task.isCompleted,
      dueDate: task.dueDate,
      status: task.status,
      createdAt: task.createdAt,
      priority: task.priority,
      assignedTo: task.assignedTo,
      comments: task.comments || [],
      checklist: task.checklist || [],
      labels: task.labels || [],
    };

    return this.http
      .put<TaskItem>(`${this.apiUrl}/${task.id}`, updateData, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .pipe(
        tap((response) => {
          console.log('UpdateTask response:', response);
          // If the response is empty, return the original task data
          return response || task;
        }),
        catchError(this.handleError)
      );
  }

  deleteTask(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;

      if (error.error) {
        console.error('Error details:', error.error);
        if (typeof error.error === 'string') {
          errorMessage += `\nDetails: ${error.error}`;
        }
      }
    }

    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
